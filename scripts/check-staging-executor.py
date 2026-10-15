"""Check the bounded staging workflow using PyYAML and Bash; never use credentials."""
import copy
import datetime
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import yaml

ROOT = Path(__file__).resolve().parent.parent
SOURCE = "a53a92092d608620fdf6edef0bbea287e2cef162"
BRANCH = "codex/beta-staging-executor-a53a920"
FINGERPRINT = "345f4ee2f0e3d38635292aef493b746f716702d32c6b737558e56f0d44ebccdb"
checks = []


def check(name, condition):
    checks.append({"name": name, "passed": bool(condition)})
    if not condition:
        raise AssertionError(name)


def run(args, cwd, env=None):
    return subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True, timeout=20)


def main():
    workflow = yaml.load((ROOT / ".github/workflows/staging-deploy.yml").read_text(), Loader=yaml.BaseLoader)
    job = workflow["jobs"]["deploy"]
    steps = job["steps"]
    check("only_dedicated_push", workflow["on"] == {"push": {"branches": [BRANCH]}})
    check("read_only_repository_token", workflow["permissions"] == {"contents": "read"})
    check("serialized_without_cancellation", workflow["concurrency"] == {"group": "cocreate-beta-staging-deploy", "cancel-in-progress": "false"})
    check("standard_bounded_runner", job["runs-on"] == "ubuntu-22.04" and job["timeout-minutes"] == "35")
    check("protected_staging_environment", job["environment"]["name"] == "cocreate-beta-staging")
    check("job_admission_expression", all(x in job["if"] for x in ["github.repository == 'DD7780/Cocreate'", "github.event_name == 'push'", f"github.ref == 'refs/heads/{BRANCH}'", "github.run_attempt == 1"]))
    actions = [s for s in steps if "uses" in s]
    check("pinned_actions", all(re.fullmatch(r"[\w/-]+@[a-f0-9]{40}", s["uses"]) for s in actions))
    check("frozen_checkout_without_credentials", actions[0]["with"] == {"ref": SOURCE, "persist-credentials": "false"})
    secret_steps = [s for s in steps if "secrets." in json.dumps(s)]
    check("only_deploy_receives_secret", len(secret_steps) == 1 and secret_steps[0]["name"] == "Deploy approved staging target once" and secret_steps[0]["env"]["CLOUDFLARE_API_TOKEN"] == "${{ secrets.COCREATE_STAGING_DEPLOY_TOKEN }}")
    existing = yaml.load((ROOT / ".github/workflows/code-checks.yml").read_text(), Loader=yaml.BaseLoader)
    check("only_executor_skips_unchanged_ci", existing["on"]["push"] == {"branches-ignore": [BRANCH]} and "pull_request" in existing["on"])
    bash = shutil.which("bash") if os.name != "nt" else str(Path.home() / "AppData/Local/hermes/git/bin/bash.exe")
    node = shutil.which("node")
    if not node and os.name == "nt":
        node = str(Path.home() / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe")
    check("local_bash_and_node_available", bash and Path(bash).exists() and node and Path(node).exists())
    with tempfile.TemporaryDirectory(prefix="staging-executor-") as directory:
        temp = Path(directory)
        scripts = {}
        node_blocks = []
        for i, step in enumerate(steps):
            if "run" not in step:
                continue
            script = temp / f"step-{i}.sh"
            script.write_text(step["run"], encoding="utf-8", newline="\n")
            check(f"bash_syntax_{i}", run([bash, "--noprofile", "--norc", "-n", str(script)], temp).returncode == 0)
            scripts[step.get("name", str(i))] = script
            node_blocks.extend(re.findall(r"node --input-type=module <<'NODE'\n(.*?)\nNODE", step["run"], re.S))
        check("two_node_admission_blocks", len(node_blocks) == 2)
        for i, block in enumerate(node_blocks):
            file = temp / f"node-{i}.mjs"
            file.write_text(block, encoding="utf-8")
            check(f"node_syntax_{i}", run([node, "--check", str(file)], temp).returncode == 0)
        base = {**os.environ, "GITHUB_REPOSITORY": "DD7780/Cocreate", "GITHUB_EVENT_NAME": "push", "GITHUB_REF": f"refs/heads/{BRANCH}", "GITHUB_RUN_ATTEMPT": "1"}
        guard = str(scripts["Check executor authority"])
        check("authorized_executor_guard", run([bash, "--noprofile", "--norc", guard], temp, base).returncode == 0)
        for name, field, value in [("fork", "GITHUB_REPOSITORY", "other/Cocreate"), ("main", "GITHUB_REF", "refs/heads/main"), ("pr", "GITHUB_EVENT_NAME", "pull_request"), ("rerun", "GITHUB_RUN_ATTEMPT", "2"), ("literal_injection", "GITHUB_REF", "$(touch should-not-exist)")]:
            check(f"reject_{name}", run([bash, "--noprofile", "--norc", guard], temp, {**base, field: value}).returncode != 0)
        check("no_injected_command", not (temp / "should-not-exist").exists())
        frozen = scripts["Verify frozen source"].read_text()
        prefix = 'git() { if [ "$1" = rev-parse ]; then printf "%s\\n" "$FAKE_HEAD"; elif [ "$1" = ls-remote ]; then printf "%s\\trefs/heads/frozen\\n" "$FAKE_REMOTE"; else return 1; fi; }\n'
        source_test = temp / "source-test.sh"
        source_test.write_text(prefix + frozen, encoding="utf-8", newline="\n")
        for label, head, remote, expected in [("frozen_source", SOURCE, SOURCE, True), ("wrong_checkout", "0" * 40, SOURCE, False), ("moved_source_branch", SOURCE, "0" * 40, False)]:
            result = run([bash, "--noprofile", "--norc", str(source_test)], temp, {**base, "FAKE_HEAD": head, "FAKE_REMOTE": remote})
            check(label, (result.returncode == 0) == expected)
        config = {"account_id": "fc419457dc350fcfada2b0a3f00bfe3e", "name": "cocreate-beta-staging", "vars": {"COCREATE_PUBLIC_ORIGIN": "https://cocreate-beta-staging.susan981314271.workers.dev", "SUPABASE_URL": "https://ctnjxvwyttnjehnbfktq.supabase.co", "COCREATE_RELEASE_FINGERPRINT": FINGERPRINT}, "routes": [], "triggers": {"crons": []}, "preview_urls": False, "containers": [{"instance_type": "basic", "max_instances": 1}]}
        for label in ["valid_target", "production_worker", "wrong_fingerprint", "larger_container"]:
            value = copy.deepcopy(config)
            if label == "production_worker": value["name"] = "cocreate"
            if label == "wrong_fingerprint": value["vars"]["COCREATE_RELEASE_FINGERPRINT"] = "0" * 64
            if label == "larger_container": value["containers"][0]["instance_type"] = "standard-2"
            (temp / "wrangler.staging.local.jsonc").write_text(json.dumps(value))
            result = run([node, str(temp / "node-0.mjs")], temp)
            check(label, (result.returncode == 0) == (label == "valid_target"))
        mock = '''Date.now = () => Date.parse('2026-10-15T06:00:00Z');
        globalThis.fetch = async url => {
          const scenario = process.env.TEST_SCENARIO;
          let status = 200, result;
          if (url.endsWith('/tokens/verify')) result = {status: 'active', expires_on: scenario === 'wrong_expiry' ? '2026-10-16T18:00:00Z' : '2026-10-15T18:00:00Z'};
          else if (url.endsWith('/workers/scripts/cocreate-beta-staging/settings')) result = {bindings: [{name: 'COCREATE_CONTAINER', namespace_id: scenario === 'wrong_namespace' ? 'other' : 'fa67999dd3634304a5aa268eaf3a417d'}]};
          else if (url.endsWith('/workers/scripts/cocreate/settings')) status = scenario === 'production_access' ? 200 : 403;
          else throw new Error('Unexpected mock route');
          return {status, ok: status === 200, json: async () => ({success: status === 200, result})};
        };
        '''
        deploy_check = temp / "deploy-admission.mjs"
        deploy_check.write_text(mock + node_blocks[1])
        for scenario in ["valid", "wrong_expiry", "wrong_namespace", "production_access", "invalid_secret"]:
            synthetic = "short-test-secret" if scenario == "invalid_secret" else "a" * 40
            env = {**base, "CLOUDFLARE_API_TOKEN": synthetic, "GITHUB_STEP_SUMMARY": str(temp / "summary.md"), "TEST_SCENARIO": scenario}
            result = run([node, str(deploy_check)], temp, env)
            check(f"credential_admission_{scenario}", (result.returncode == 0) == (scenario == "valid"))
            check(f"no_secret_output_{scenario}", synthetic not in result.stdout + result.stderr)


try:
    main()
except Exception as error:
    checks.append({"name": type(error).__name__, "passed": False})
now = datetime.datetime.now(datetime.timezone.utc)
receipt = {"checkedAt": now.isoformat(), "sourceCommit": SOURCE, "executorBranch": BRANCH, "checks": checks, "passed": all(c["passed"] for c in checks), "providersContacted": False, "credentialsRead": False, "localOnly": True}
stamp = now.strftime("%Y-%m-%dT%H-%M-%S")
(ROOT / f"artifacts/staging-preparation/github-executor-checks-{stamp}.json").write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps({"passed": receipt["passed"], "checks": len(checks), "failedChecks": [c["name"] for c in checks if not c["passed"]], "providersContacted": False, "credentialsRead": False}))
raise SystemExit(0 if receipt["passed"] else 1)
