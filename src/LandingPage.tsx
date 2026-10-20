import { useEffect, useState, type KeyboardEvent } from "react";
import "./landing.css";

const demoTabs = ["canvas", "workflow", "artifacts"] as const;
type DemoTab = (typeof demoTabs)[number];
const artifactTabs = ["brief", "page", "scene"] as const;
type ArtifactTab = (typeof artifactTabs)[number];

function moveTab<T extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  choices: readonly T[],
  current: T,
  select: (value: T) => void,
  vertical = false,
) {
  const index = choices.indexOf(current);
  const next =
    event.key === (vertical ? "ArrowDown" : "ArrowRight")
      ? (index + 1) % choices.length
      : event.key === (vertical ? "ArrowUp" : "ArrowLeft")
        ? (index + choices.length - 1) % choices.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? choices.length - 1
            : undefined;
  if (next === undefined) return;
  event.preventDefault();
  select(choices[next]);
  event.currentTarget.parentElement
    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    [next]?.focus();
}

function WorkspaceExample({
  tab,
  onTabChange,
  onAvailability,
}: {
  tab: DemoTab;
  onTabChange: (tab: DemoTab, focus?: boolean) => void;
  onAvailability: () => void;
}) {
  const [artifact, setArtifact] = useState<ArtifactTab>("brief");
  const [compact, setCompact] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 760px)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <section
      className="lp-demo-section lp-wrap"
      id="project-demo"
      aria-labelledby="demo-title"
    >
      <div className="lp-section-meta">
        <h2 id="demo-title">YOUR TEAM AND AI IN THE SAME WORKSPACE</h2>
        <span>
          Explore an illustrative project <span aria-hidden="true">↙</span>
        </span>
      </div>
      <div className="lp-product-demo">
        <div className="lp-demo-titlebar">
          <div>
            <span className="lp-mini-mark" aria-hidden="true">
              ✳
            </span>
            <strong>Repair café launch</strong>
            <span className="lp-project-tag">Shared project</span>
          </div>
          <div
            className="lp-collaborators"
            aria-label="Illustrative participants: Maya, Arun and Lina"
          >
            <span className="lp-avatar lp-maya">M</span>
            <span className="lp-avatar lp-arun">A</span>
            <span className="lp-avatar lp-lina">L</span>
            <small>3 here</small>
          </div>
        </div>
        <div
          className="lp-demo-tabs"
          role="tablist"
          aria-label="Explore the product example"
        >
          <button
            id="tab-canvas"
            type="button"
            role="tab"
            aria-selected={tab === "canvas"}
            aria-controls="panel-canvas"
            tabIndex={tab === "canvas" ? 0 : -1}
            onClick={() => onTabChange("canvas")}
            onKeyDown={(event) => moveTab(event, demoTabs, tab, onTabChange)}
          >
            <span aria-hidden="true">▤</span> Canvas
          </button>
          <button
            id="tab-workflow"
            type="button"
            role="tab"
            aria-selected={tab === "workflow"}
            aria-controls="panel-workflow"
            tabIndex={tab === "workflow" ? 0 : -1}
            onClick={() => onTabChange("workflow")}
            onKeyDown={(event) => moveTab(event, demoTabs, tab, onTabChange)}
          >
            <span aria-hidden="true">▥</span> Workflow
          </button>
          <button
            id="tab-artifacts"
            type="button"
            role="tab"
            aria-selected={tab === "artifacts"}
            aria-controls="panel-artifacts"
            tabIndex={tab === "artifacts" ? 0 : -1}
            onClick={() => onTabChange("artifacts")}
            onKeyDown={(event) => moveTab(event, demoTabs, tab, onTabChange)}
          >
            <span aria-hidden="true">⌘</span> Artifacts
          </button>
          <span className="lp-demo-example-label">EXPANDED BETA · EXAMPLE</span>
        </div>

        <div
          id="panel-canvas"
          className="lp-demo-panel lp-canvas-panel"
          role="tabpanel"
          aria-labelledby="tab-canvas"
          tabIndex={0}
          hidden={tab !== "canvas"}
        >
          <div className="lp-canvas-paper">
            <div className="lp-paper-top">
              <span>SHARED CANVAS</span>
              <span>Illustrative content</span>
            </div>
            <h3>
              Plan our first
              <br /> community repair café.
            </h3>
            <div className="lp-contribution">
              <div className="lp-byline">
                <span className="lp-person-dot lp-blue"></span>Maya{" "}
                <span className="lp-content-tag lp-submitted">
                  Submitted request
                </span>
              </div>
              <p>
                Turn our notes into a project brief with goals and a launch
                checklist.
              </p>
            </div>
            <div className="lp-contribution lp-discussion">
              <div className="lp-byline">
                <span className="lp-person-dot lp-terracotta"></span>Arun{" "}
                <span className="lp-content-tag">Discussion</span>
              </div>
              <p>Could local shops help us find supplies?</p>
              <span className="lp-writing-cursor" aria-hidden="true">
                Arun
              </span>
            </div>
            <div className="lp-contribution">
              <div className="lp-byline">
                <span className="lp-person-dot lp-sage"></span>Lina{" "}
                <span className="lp-content-tag lp-submitted">
                  Submitted request
                </span>
              </div>
              <p>Build an early-access page using the brief.</p>
            </div>
            <p className="lp-canvas-bottom">
              Keep discussing while AI works on submitted instructions.
            </p>
          </div>
          <aside
            className="lp-accepted-panel"
            aria-label="Example instructions for the current update"
          >
            <p className="lp-eyebrow">SHARED CONTEXT</p>
            <h4>What we’re building</h4>
            <span className="lp-revision">Instructions for this update</span>
            <ul>
              <li>
                <span>✓</span>Project brief and launch checklist
              </li>
              <li>
                <span>✓</span>Early-access page from the brief
              </li>
            </ul>
            <div className="lp-discussion-note">
              <span className="lp-tiny-label">STILL A DISCUSSION</span>
              <p>The partnership idea is still open for discussion.</p>
            </div>
            <button
              className="lp-button lp-primary lp-demo-result"
              type="button"
              onClick={() => onTabChange("artifacts", true)}
            >
              Explore project outputs <span aria-hidden="true">↗</span>
            </button>
            <small>
              Sending your instructions leaves teammates’ drafts untouched.
            </small>
          </aside>
        </div>

        <div
          id="panel-workflow"
          className="lp-demo-panel lp-workflow-panel"
          role="tabpanel"
          aria-labelledby="tab-workflow"
          tabIndex={0}
          hidden={tab !== "workflow"}
        >
          <div className="lp-mini-usage">
            <div className="lp-mini-panel-heading">
              <h3>AI usage</h3>
              <span>Illustrative data · 7 days</span>
            </div>
            <div className="lp-demo-metrics">
              <div>
                <span>Reported tokens</span>
                <strong>16,800</strong>
              </div>
              <div>
                <span>Estimated AI cost · USD</span>
                <strong>$0.21</strong>
              </div>
            </div>
            <div
              className="lp-mini-bars"
              role="img"
              aria-label="Illustrative token usage for seven days: 600, 1200, 1800, 2400, 3000, 3600, 4200 tokens"
            >
              <i style={{ height: "14%" }}></i>
              <i style={{ height: "28%" }}></i>
              <i style={{ height: "43%" }}></i>
              <i style={{ height: "57%" }}></i>
              <i style={{ height: "71%" }}></i>
              <i style={{ height: "86%" }}></i>
              <i style={{ height: "100%" }}></i>
            </div>
            <small>
              Recent AI requests only · some usage may be missing. Cost is
              estimated, not a final bill.
            </small>
          </div>
          <div className="lp-mini-conflict">
            <p className="lp-eyebrow">CONTRADICTIONS</p>
            <h3>
              Two requests.
              <br /> One decision to make.
            </h3>
            <details>
              <summary>
                <span>Event schedule</span>
                <span className="lp-waiting">Waiting for choices</span>
              </summary>
              <div className="lp-conflict-options">
                <p>
                  <span className="lp-person-dot lp-blue"></span>
                  <strong>Maya</strong> · “Hold sessions every week.”
                </p>
                <p>
                  <span className="lp-person-dot lp-terracotta"></span>
                  <strong>Arun</strong> · “Hold sessions every month.”
                </p>
                <small>
                  Maya and Arun must both choose the same schedule before this
                  change proceeds.
                </small>
              </div>
            </details>
            <p className="lp-mini-conflict-footnote">
              Keep the alternatives, their authors and the last agreed direction
              together.
            </p>
          </div>
        </div>

        <div
          id="panel-artifacts"
          className="lp-demo-panel lp-library-panel"
          role="tabpanel"
          aria-labelledby="tab-artifacts"
          tabIndex={0}
          hidden={tab !== "artifacts"}
        >
          <div className="lp-library-heading">
            <strong>Project outputs</strong>
            <a href="#capability-status" onClick={onAvailability}>
              Expanded beta example · what’s available ↗
            </a>
          </div>
          <div className="lp-artifact-library">
            <div
              className="lp-artifact-picker"
              role="tablist"
              aria-label="Choose an example project output"
              aria-orientation={compact ? "horizontal" : "vertical"}
            >
              <button
                id="output-brief-tab"
                type="button"
                role="tab"
                aria-selected={artifact === "brief"}
                aria-controls="output-brief"
                tabIndex={artifact === "brief" ? 0 : -1}
                onClick={() => setArtifact("brief")}
                onKeyDown={(event) =>
                  moveTab(event, artifactTabs, artifact, setArtifact, !compact)
                }
              >
                <span className="lp-file-symbol" aria-hidden="true">
                  ▤
                </span>
                <span>
                  <strong>Project brief</strong>
                  <small>DOCUMENT · EXAMPLE</small>
                </span>
                <span className="lp-file-version">v1</span>
              </button>
              <button
                id="output-page-tab"
                type="button"
                role="tab"
                aria-selected={artifact === "page"}
                aria-controls="output-page"
                tabIndex={artifact === "page" ? 0 : -1}
                onClick={() => setArtifact("page")}
                onKeyDown={(event) =>
                  moveTab(event, artifactTabs, artifact, setArtifact, !compact)
                }
              >
                <span className="lp-file-symbol" aria-hidden="true">
                  ⌘
                </span>
                <span>
                  <strong>Early-access page</strong>
                  <small>APPLICATION · EXAMPLE</small>
                </span>
                <span className="lp-file-version">v1</span>
              </button>
              <button
                id="output-scene-tab"
                type="button"
                role="tab"
                aria-selected={artifact === "scene"}
                aria-controls="output-scene"
                tabIndex={artifact === "scene" ? 0 : -1}
                onClick={() => setArtifact("scene")}
                onKeyDown={(event) =>
                  moveTab(event, artifactTabs, artifact, setArtifact, !compact)
                }
              >
                <span className="lp-file-symbol" aria-hidden="true">
                  ◇
                </span>
                <span>
                  <strong>Event sign concept</strong>
                  <small>3D SCENE · EXAMPLE</small>
                </span>
                <span className="lp-file-version">β</span>
              </button>
              <p>Different outputs stay attached to the same shared project.</p>
            </div>
            <div className="lp-output-area">
              <div
                id="output-brief"
                role="tabpanel"
                aria-labelledby="output-brief-tab"
                className="lp-output-panel lp-brief-output"
                tabIndex={0}
                hidden={artifact !== "brief"}
              >
                <div className="lp-output-filename">
                  <span>project-brief.md</span>
                  <span>Illustrative document</span>
                </div>
                <article>
                  <p className="lp-eyebrow">PROJECT BRIEF</p>
                  <h3>
                    A repair café
                    <br /> for our neighborhood.
                  </h3>
                  <p>
                    Bring people together to repair everyday items, share
                    practical skills and reduce waste.
                  </p>
                  <div className="lp-brief-sections">
                    <section>
                      <h4>Who it’s for</h4>
                      <p>
                        Neighbors with something to fix, volunteers with repair
                        skills and local partners.
                      </p>
                    </section>
                    <section>
                      <h4>First launch checklist</h4>
                      <ul>
                        <li>Choose a venue and session schedule</li>
                        <li>Recruit the first volunteer team</li>
                        <li>Create an early-access signup page</li>
                      </ul>
                    </section>
                  </div>
                </article>
              </div>
              <div
                id="output-page"
                role="tabpanel"
                aria-labelledby="output-page-tab"
                className="lp-output-panel lp-page-output"
                tabIndex={0}
                hidden={artifact !== "page"}
              >
                <div className="lp-output-filename">
                  <span>early-access-page/</span>
                  <span>Illustrative application</span>
                </div>
                <div className="lp-repair-site">
                  <header>
                    <strong>Repair together.</strong>
                    <span>COMMUNITY REPAIR CAFÉ</span>
                  </header>
                  <div className="lp-repair-site-body">
                    <div>
                      <span className="lp-tiny-label">
                        A NEW COMMUNITY PROJECT
                      </span>
                      <h3>
                        Something broken?
                        <br /> Let’s fix it together.
                      </h3>
                      <p>
                        Meet your neighbors, learn a useful skill and give your
                        favorite things a longer life.
                      </p>
                      <span className="lp-site-demo-cta">
                        Join the first session{" "}
                        <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                    <div className="lp-repair-mark" aria-hidden="true">
                      ↗
                      <span>
                        REPAIR
                        <br /> REUSE
                        <br /> REPEAT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="output-scene"
                role="tabpanel"
                aria-labelledby="output-scene-tab"
                className="lp-output-panel lp-scene-output"
                tabIndex={0}
                hidden={artifact !== "scene"}
              >
                <div className="lp-output-filename">
                  <span>event-sign.blend</span>
                  <span>Example from Blender</span>
                </div>
                <div className="lp-scene-illustration">
                  <svg
                    viewBox="0 0 520 240"
                    role="img"
                    aria-label="Illustrative three-dimensional event sign"
                  >
                    <path
                      d="M20 215 260 100 500 215M65 235 305 120M155 235 395 120M20 175 290 235M90 140 360 235M180 115 450 235"
                      fill="none"
                      stroke="#d9dccc"
                      strokeWidth="1"
                    />
                    <path d="m220 67 142 38-33 116-142-38z" fill="#3158b8" />
                    <path d="m220 67 15-9 143 38-16 9z" fill="#9aaedd" />
                    <path d="m362 105 16-9-33 116-16 9z" fill="#233f85" />
                    <text
                      x="234"
                      y="116"
                      transform="rotate(15 234 116)"
                      fill="#fffdf8"
                      fontFamily="Inter,Arial,sans-serif"
                      fontSize="22"
                      fontWeight="600"
                    >
                      REPAIR
                    </text>
                    <text
                      x="227"
                      y="144"
                      transform="rotate(15 227 144)"
                      fill="#fffdf8"
                      fontFamily="Inter,Arial,sans-serif"
                      fontSize="22"
                      fontWeight="600"
                    >
                      CAFÉ ↗
                    </text>
                  </svg>
                  <p>Example of a 3D scene created using Blender.</p>
                  <span className="lp-tool-status">
                    The Blender connection is still being tested for the
                    expanded beta.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lp-demo-caption">
        <p>
          Example of the expanded workspace, not a live session. Browser and
          Blender features are still being tested for beta access.
        </p>
        <span>
          <span className="lp-small-line"></span> One project → multiple outputs
        </span>
      </div>
    </section>
  );
}

export function LandingPage() {
  const [demoTab, setDemoTab] = useState<DemoTab>("canvas");
  const [capabilityOpen, setCapabilityOpen] = useState(false);
  const chooseDemoTab = (tab: DemoTab, focus = false) => {
    setDemoTab(tab);
    if (focus) document.getElementById(`tab-${tab}`)?.focus();
  };
  const [busy, setBusy] = useState(false),
    [success, setSuccess] = useState(""),
    [error, setError] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/beta/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          consent: form.get("consent") === "on",
          website: form.get("website"),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || typeof body.message !== "string")
        throw new Error(
          body.error || "Registration could not be saved. Please try again.",
        );
      setSuccess(body.message);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Registration could not be saved. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="landing">
      <a className="landing-skip" href="#main">
        Skip to content
      </a>
      <main id="main">
        <div className="lp-editorial-overview" id="introduction">
          <aside className="lp-founder-column" aria-labelledby="hero-title">
            <div className="lp-founder-note">
              <a
                className="lp-brand"
                href="#introduction"
                aria-label="2guys1canvas home"
              >
                <span className="lp-brand-mark" aria-hidden="true">
                  ✳
                </span>
                2guys1canvas
              </a>
              <p className="lp-eyebrow lp-availability">
                <span className="lp-dot"></span> A NOTE FROM THE TEAM · PRIVATE
                BETA
              </p>
              <h1 id="hero-title">
                Meet <br />
                <span>2guys1canvas.</span>
              </h1>
              <p className="lp-founder-tagline">
                Build with AI.
                <br />
                Together on one canvas.
              </p>
              <div className="lp-founder-copy">
                <p>
                  We’re building 2guys1canvas because working with AI should
                  have room for more than one person’s ideas.
                </p>
                <p>
                  Imagine a Google Docs-like canvas where you and your team can
                  write, brainstorm and discuss a project together. When your
                  part is ready, use the build button to send your own
                  instructions to AI while everyone keeps contributing.
                </p>
                <p>
                  Your thinking stays in Canvas, the shared writing area. Files
                  and results appear in Artifacts, where you can review them
                  together and decide what comes next. A webpage is one
                  possibility. The bigger idea is a shared place for people to
                  build with AI.
                </p>
              </div>
              <div className="lp-founder-signoff">
                <p>Let’s make something together.</p>
                <span>The 2guys1canvas team</span>
              </div>
              <nav className="lp-intro-links" aria-label="Page navigation">
                <a href="#features">Features ↓</a>
                <a href="#beta-scope">Beta details ↓</a>
                <a href="/login?returnTo=%2Fapp">Sign in ↗</a>
              </nav>
              <a
                className="lp-button lp-primary lp-intro-join"
                href="#waitlist"
              >
                Join the private beta <span aria-hidden="true">↗</span>
              </a>
            </div>
          </aside>
          <div className="lp-editorial-content">
            <section
              className="lp-editorial-row"
              id="features"
              aria-labelledby="features-title"
            >
              <div className="lp-editorial-heading">
                <p className="lp-eyebrow">01 / SHARED CANVAS</p>
                <h2 id="features-title">
                  Think <br />
                  together.
                </h2>
                <p>
                  A shared space for everyone’s ideas, with room to discuss
                  before deciding what to build.
                </p>
              </div>
              <div className="lp-feature-list">
                <details className="lp-feature-detail" id="feature-01">
                  <summary>
                    <span className="lp-feature-number">01</span>
                    <span className="lp-feature-summary">
                      <strong>Brainstorm in the same canvas</strong>
                      <span className="lp-read-toggle">
                        <span className="lp-read-more-text">Read more</span>
                        <span className="lp-read-less-text">Show less</span>
                        <span className="lp-read-symbol" aria-hidden="true">
                          +
                        </span>
                      </span>
                    </span>
                  </summary>
                  <div className="lp-feature-body">
                    <p className="lp-feature-intro">
                      Work in a shared document where everyone can write, add
                      context and discuss ideas in real time. The conversation
                      and the project stay in one place.
                    </p>
                    <p>
                      Imagine planning a project with your cofounder. One of you
                      outlines the problem, another adds research or references,
                      and a teammate turns the discussion into a brief. You can
                      build on each other’s ideas without copying the same
                      context between separate AI chats.
                    </p>
                    <p>
                      The canvas works like a collaborative document: your team
                      can write, revise and organize its thinking together.
                      Invite teammates with their own accounts so everyone can
                      see who contributed each idea or instruction.
                    </p>
                  </div>
                </details>
                <details className="lp-feature-detail" id="feature-02">
                  <summary>
                    <span className="lp-feature-number">02</span>
                    <span className="lp-feature-summary">
                      <strong>
                        Discuss possibilities. Give instructions when you’re
                        ready.
                      </strong>
                      <span className="lp-read-toggle">
                        <span className="lp-read-more-text">Read more</span>
                        <span className="lp-read-less-text">Show less</span>
                        <span className="lp-read-symbol" aria-hidden="true">
                          +
                        </span>
                      </span>
                    </span>
                  </summary>
                  <div className="lp-feature-body">
                    <p className="lp-feature-intro">
                      The canvas has room for rough ideas and questions, as well
                      as decisions. Your team can explore possibilities without
                      treating every sentence as something AI must build.
                    </p>
                    <p>
                      “Could we add a members-only area?” is something to
                      discuss. “Add a members-only area with these requirements”
                      is an instruction. When you send your text to AI, it
                      separates ideas and questions from clear instructions
                      about what to make.
                    </p>
                    <p>
                      You can review what the system understood and correct your
                      own instructions. That gives your team room to think
                      openly, while keeping control over what you ask AI to do.
                    </p>
                  </div>
                </details>
                <details className="lp-feature-detail" id="feature-03">
                  <summary>
                    <span className="lp-feature-number">03</span>
                    <span className="lp-feature-summary">
                      <strong>
                        Submit your work while teammates keep contributing
                      </strong>
                      <span className="lp-read-toggle">
                        <span className="lp-read-more-text">Read more</span>
                        <span className="lp-read-less-text">Show less</span>
                        <span className="lp-read-symbol" aria-hidden="true">
                          +
                        </span>
                      </span>
                    </span>
                  </summary>
                  <div className="lp-feature-body">
                    <p className="lp-feature-intro">
                      When your instructions are ready, click the build button
                      above the canvas, labeled “Build my changes.” It sends
                      your own new edits to AI; it does not send your teammates’
                      unfinished writing. Everyone can keep contributing while
                      AI works.
                    </p>
                    <p>
                      Each person decides when their own instructions are ready.
                      Sharing a canvas does not mean giving up control over when
                      your work is sent to AI.
                    </p>
                    <p>
                      If several people send instructions, AI finishes the
                      current update using the instructions it started with.
                      Later requests wait for the next update. On Windows and
                      Linux, you can also press Alt+X while writing in the
                      canvas to send your changes.
                    </p>
                  </div>
                </details>
              </div>
            </section>
            <section className="lp-editorial-row" aria-labelledby="build-title">
              <div className="lp-editorial-heading">
                <p className="lp-eyebrow">02 / SHARED RESULTS</p>
                <h2 id="build-title">
                  Build <br />
                  together.
                </h2>
                <p>
                  Turn your team’s decisions into work you can review, with
                  control over direction, models and usage.
                </p>
              </div>
              <div className="lp-feature-list">
                <details className="lp-feature-detail" id="feature-04">
                  <summary>
                    <span className="lp-feature-number">04</span>
                    <span className="lp-feature-summary">
                      <strong>Resolve contradictions as a team</strong>
                      <span className="lp-read-toggle">
                        <span className="lp-read-more-text">Read more</span>
                        <span className="lp-read-less-text">Show less</span>
                        <span className="lp-read-symbol" aria-hidden="true">
                          +
                        </span>
                      </span>
                    </span>
                  </summary>
                  <div className="lp-feature-body">
                    <p className="lp-feature-intro">
                      A contradiction is when two instructions ask for
                      incompatible things. Both requests, who wrote them and the
                      decision stay visible. The people involved agree on a
                      direction before that disputed change proceeds.
                    </p>
                    <p>
                      If one person asks for weekly sessions and another asks
                      for monthly sessions, choosing one silently would ignore
                      what someone asked for. A detected contradiction keeps
                      both requests visible so the people who wrote them can
                      make the decision themselves.
                    </p>
                    <p>
                      Each person whose request is involved must choose; silence
                      does not count as agreement. The history stays with the
                      project so the team can understand the result later. You
                      can also review how AI understood your request and correct
                      it as the project develops.
                    </p>
                  </div>
                </details>
                <details className="lp-feature-detail" id="feature-05">
                  <summary>
                    <span className="lp-feature-number">05</span>
                    <span className="lp-feature-summary">
                      <strong>
                        Review different kinds of work in Artifacts
                      </strong>
                      <span className="lp-read-toggle">
                        <span className="lp-read-more-text">Read more</span>
                        <span className="lp-read-less-text">Show less</span>
                        <span className="lp-read-symbol" aria-hidden="true">
                          +
                        </span>
                      </span>
                    </span>
                  </summary>
                  <div className="lp-feature-body">
                    <p className="lp-feature-intro">
                      Use Canvas for your team’s writing and Artifacts for the
                      files, previews and other results AI produces. A project
                      can bring instructions, files and results together instead
                      of scattering them across separate conversations.
                    </p>
                    <p>
                      A project brief, an application and work from a connected
                      tool can all belong to the same project. In the expanded
                      Artifacts section, each result keeps its files and earlier
                      versions so people can reopen it and decide what should
                      happen next.
                    </p>
                    <p>
                      The important distinction is that the workspace organizes
                      the work; its available tools determine what AI can
                      actually produce or operate. Document creation and access
                      to tools such as a shared browser or Blender are still
                      being tested for the expanded beta. Connecting a tool
                      gives AI a specific way to help, such as using a browser
                      or creating a 3D scene.
                    </p>
                    <a
                      className="lp-inline-link"
                      href="#capability-status"
                      onClick={() => setCapabilityOpen(true)}
                    >
                      See what’s available now and what’s coming ↗
                    </a>
                  </div>
                </details>
                <details className="lp-feature-detail" id="feature-06">
                  <summary>
                    <span className="lp-feature-number">06</span>
                    <span className="lp-feature-summary">
                      <strong>Choose models and understand the usage</strong>
                      <span className="lp-read-toggle">
                        <span className="lp-read-more-text">Read more</span>
                        <span className="lp-read-less-text">Show less</span>
                        <span className="lp-read-symbol" aria-hidden="true">
                          +
                        </span>
                      </span>
                    </span>
                  </summary>
                  <div className="lp-feature-body">
                    <p className="lp-feature-intro">
                      Connect your own OpenRouter account to use AI models.
                      Workflow is the section where you review AI usage,
                      estimated cost and instructions that conflict.
                    </p>
                    <p>
                      OpenRouter is a service that gives you access to models
                      from different AI providers. The project owner connects it
                      with an API key—a private credential that lets the project
                      use models through that account—and chooses which models
                      to use. AI usage is charged to that account, and the owner
                      decides which teammates may use it.
                    </p>
                    <p>
                      Workflow shows recent AI requests, token usage and
                      estimated cost, including initial setup and repeated
                      attempts when reported. Tokens are the small pieces of
                      text a model reads or writes; providers use them to
                      measure usage. Missing figures stay marked as unknown.
                      Automatic model selection based on the task is planned;
                      for now, you choose the models.
                    </p>
                    <button
                      className="lp-inline-link"
                      type="button"
                      onClick={() => {
                        chooseDemoTab("workflow", true);
                        document
                          .getElementById("project-demo")
                          ?.scrollIntoView({ behavior: "instant" });
                      }}
                    >
                      Explore the Workflow example ↗
                    </button>
                  </div>
                </details>
              </div>
            </section>
            <section
              className="lp-editorial-row"
              id="beta-scope"
              aria-labelledby="scope-title"
            >
              <div className="lp-editorial-heading">
                <p className="lp-eyebrow">03 / BEFORE YOU BEGIN</p>
                <h2 id="scope-title">
                  Know what’s <br />
                  included.
                </h2>
                <p>
                  We’re building toward a broader AI workspace. Here’s what’s
                  available and what we’re still preparing.
                </p>
              </div>
              <div className="lp-scope-accordions">
                <details
                  id="capability-status"
                  open={capabilityOpen}
                  onToggle={(event) =>
                    setCapabilityOpen(event.currentTarget.open)
                  }
                >
                  <summary>
                    <span>
                      What can we use now, and what is being prepared?
                    </span>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div>
                    <p>
                      <strong>In the current public version:</strong> write
                      together, send your own instructions to AI, resolve
                      conflicting requests and track AI usage and estimated
                      cost. You can also preview AI-generated webpages and app
                      interfaces, and download their code.
                    </p>
                    <p>
                      <strong>Being prepared for the expanded beta:</strong>{" "}
                      saved files and earlier versions in Artifacts, AI-created
                      documents, shared browser sessions and a connection to
                      Blender for creating 3D scenes. These additions are built
                      but still being tested before beta users get access. They
                      are not yet enabled on the current public site.
                    </p>
                    <p>
                      What AI can do depends on the tools connected to your
                      project. A model needs the appropriate tool connection to
                      use a browser, work in another application or set up an
                      online service.
                    </p>
                  </div>
                </details>
                <details>
                  <summary>
                    <span>Which models can we use, and who pays?</span>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div>
                    <p>
                      The online beta uses OpenRouter, a service for accessing
                      different AI models. The project owner connects their
                      account using a private API key, chooses models and
                      decides which teammates can use the account. Model usage
                      is charged through that OpenRouter account.
                    </p>
                    <p>
                      You can review AI usage and estimated cost in Workflow.
                      Automatic model selection based on your task is planned;
                      for now, you choose the models yourself.{" "}
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get an OpenRouter key ↗
                      </a>
                    </p>
                  </div>
                </details>
                <details>
                  <summary>
                    <span>
                      Can we download the work or publish it elsewhere?
                    </span>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div>
                    <p>
                      Yes. You can download a ZIP file containing the code
                      behind your generated webpage or app interface, then keep
                      developing it or publish it through another service. Other
                      kinds of results offer downloads according to the tools
                      available in your project.
                    </p>
                    <p>
                      Publishing a generated app directly from 2guys1canvas is
                      not yet enabled on the public site. We’re preparing it for
                      the expanded beta; the hosting connection and release
                      checks still need to be completed.
                    </p>
                  </div>
                </details>
                <details id="how-it-works">
                  <summary>
                    <span>From team discussion to work you can review</span>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div>
                    <p>
                      Everyone can keep contributing while AI works on submitted
                      instructions. Your team stays involved in both the
                      direction and the result.
                    </p>
                    <ol className="lp-steps">
                      <li>
                        <span>01</span>
                        <h3>Start a shared project</h3>
                        <p>
                          Invite teammates and use the same canvas to explain
                          what you want to achieve.
                        </p>
                      </li>
                      <li>
                        <span>02</span>
                        <h3>Submit your instructions</h3>
                        <p>
                          Use the build button above the canvas, labeled “Build
                          my changes,” to send your own edits to AI. On
                          Windows/Linux, <kbd>Alt</kbd> + <kbd>X</kbd> does the
                          same while you’re writing in the canvas.
                        </p>
                      </li>
                      <li>
                        <span>03</span>
                        <h3>Keep shaping the project</h3>
                        <p>
                          Keep discussing ideas, check how AI understood your
                          requests and resolve any conflicting instructions it
                          flags.
                        </p>
                      </li>
                      <li>
                        <span>04</span>
                        <h3>Review the results together</h3>
                        <p>
                          Review files and previews in the Artifacts section,
                          decide what to change next and download the available
                          files.
                        </p>
                      </li>
                    </ol>
                  </div>
                </details>
              </div>
            </section>
            <div className="lp-overview-invitation">
              <p>Already a beta tester?</p>
              <a
                className="lp-button lp-beta-signin"
                href="/login?returnTo=%2Fapp"
              >
                Beta tester sign in <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="lp-workspace-intro lp-wrap">
          <p className="lp-eyebrow">TAKE A LOOK AROUND</p>
          <h2>Explore the workspace.</h2>
          <p>
            Follow an example from a shared idea to the work it produces. Try
            Canvas for shared writing, Workflow for AI usage and conflicting
            requests, and Artifacts for files and previews.
          </p>
        </div>
        <WorkspaceExample
          tab={demoTab}
          onTabChange={chooseDemoTab}
          onAvailability={() => setCapabilityOpen(true)}
        />

        <section
          className="lp-faq lp-wrap lp-section-space"
          id="questions"
          aria-labelledby="faq-title"
        >
          <div className="lp-section-heading">
            <p className="lp-eyebrow">MORE ABOUT THE WORKSPACE</p>
            <h2 id="faq-title">
              Frequently asked
              <br /> questions.
            </h2>
          </div>
          <div className="lp-faq-list">
            <details>
              <summary>
                Why use a canvas instead of a shared chat?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                A canvas gives the team an editable document to think in. You
                can put related ideas next to each other, revise a brief and
                discuss several parts of a project without making every
                contribution the next message in a single chat. When you’re
                ready, the build button sends your instructions to AI, and your
                team reviews the results together.
              </p>
            </details>
            <details>
              <summary>
                Does AI act on everything we write?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                No. Typing, saving or joining the canvas does not start AI work.
                To send your own new edits to AI, use the build button above the
                canvas, labeled “Build my changes,” or press Alt+X while writing
                on Windows/Linux. AI checks that text for instructions; ideas
                and questions remain discussion. You can review what it
                understood.
              </p>
            </details>
            <details>
              <summary>
                What happens if two people submit at the same time?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                Each person sends only their own changes. AI finishes the
                current update before taking on later requests, and everyone can
                keep writing. If a build is stopped, waiting requests are
                returned so you can decide whether to send them again. They do
                not restart automatically or spend more without that action.
              </p>
            </details>
            <details>
              <summary>
                What if AI misunderstands us or misses a conflict?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                AI can misunderstand instructions or miss conflicting requests.
                Check how it understood your request and correct it when needed.
                When it flags a conflict, the people who wrote those requests
                decide how to resolve it. If AI cannot complete an update, the
                last working result remains available.
              </p>
            </details>
            <details>
              <summary>
                Can we run the workspace locally?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                Yes. You can run the application locally without cloud-hosting
                costs, although model-provider charges can still apply. Local
                setup needs the application and its dependencies; connected
                tools can have additional setup. It is not a promise of fully
                offline operation or free AI inference.
              </p>
            </details>
            <details>
              <summary>
                How do we get private beta access?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                Join the waitlist to register interest, or sign in with a
                confirmed account to request access. Beta access requires
                approval. A project invitation or a known link does not bypass
                that approval, and access to each private project still depends
                on membership.
              </p>
            </details>
          </div>
        </section>

        <section
          className="lp-join-section"
          id="waitlist"
          aria-labelledby="join-title"
        >
          <div className="lp-join-inner lp-wrap">
            <div className="lp-join-copy">
              <p className="lp-eyebrow">LET’S MAKE SOMETHING TOGETHER</p>
              <h2 id="join-title">
                Bring your team
                <br /> into the beta.
              </h2>
              <p>
                Help us test a more collaborative way to work with AI. Register
                your interest and we’ll email when a beta spot is available.
              </p>
              <a href="/login?returnTo=%2Fapp">
                Have an account? Sign in or request access{" "}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="lp-waitlist-card">
              <h3>Join the private beta.</h3>
              <p>Register your interest in 2guys1canvas.</p>
              <form id="waitlist-form" onSubmit={submit} aria-busy={busy}>
                <label htmlFor="waitlist-email">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="waitlist-email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                  disabled={busy || !!success}
                  aria-describedby="waitlist-privacy"
                />
                <div className="lp-honeypot" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <label className="lp-consent">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    disabled={busy || !!success}
                  />
                  <span>
                    I agree to receive beta invitations and product updates by
                    email.
                  </span>
                </label>
                <button
                  className="lp-button lp-primary"
                  type="submit"
                  disabled={busy || !!success}
                >
                  {busy
                    ? "Saving registration…"
                    : success
                      ? "Registered"
                      : "Join the beta waitlist"}
                  <span aria-hidden="true">{success ? "✓" : "↗"}</span>
                </button>
                <p className="lp-privacy" id="waitlist-privacy">
                  Registration is private and requires approval for app access.
                  We store your email, consent and registration time. No
                  tracking is added.
                </p>
                {success && (
                  <p className="waitlist-success" role="status">
                    {success}
                  </p>
                )}
                {error && (
                  <p className="waitlist-error" role="alert">
                    {error}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="lp-footer lp-wrap">
        <a className="lp-brand" href="#">
          <span className="lp-brand-mark" aria-hidden="true">
            ✳
          </span>
          2guys1canvas
        </a>
        <p>A shared canvas for people working with AI.</p>
        <a className="lp-button lp-beta-signin" href="/login?returnTo=%2Fapp">
          Beta tester sign in <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </div>
  );
}
