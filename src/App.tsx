import {VerificationSummary} from "./VerificationSummary";
import {BuildProgress} from "./BuildProgress";
import { api } from "./api";
import { AgentPanel } from "./workspace/AgentPanel";
import { BuildAccounting } from "./workspace/BuildAccounting";
import {
  draftKey,
  persistDraft,
  restoreDraft,
  type LocalDraftStatus,
} from "./local-drafts";
import { WorkflowBoard } from "./WorkflowBoard";
import { ByokSetup } from "./ByokSetup";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { Collaboration } from "@tiptap/extension-collaboration";
import { CollaborationCaret } from "@tiptap/extension-collaboration-caret";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BarChart3,
  Bold,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Heading1,
  Heading2,
  KeyRound,
  List,
  ListOrdered,
  LoaderCircle,
  PanelLeftClose,
  Pencil,
  Plug,
  RefreshCw,
  Sparkles,
  Undo2,
  Redo2,
  Users,
  WifiOff,
  WandSparkles,
  X,
} from "lucide-react";
import { CoCreateProvider, type ConnectionStatus } from "./provider";
import type {
  AIFormat,
  AIProvider,
  Participant,
  RoomView,
  WorkflowStatus,
} from "../shared/types";
import {
  ariaShortcut,
  defaultBuildShortcut,
  isBuildShortcut,
  shortcutLabel,
} from "./build-shortcut";
type ProviderChoice = AIProvider;
type FormatChoice = AIFormat;
const roomId = location.pathname.match(/^\/r\/([A-Za-z0-9_-]+)$/)?.[1];
const tokenParticipant = (token: string) => {
  try {
    return JSON.parse(
      atob(token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/")),
    ).participantId as string;
  } catch {
    return "";
  }
};

function Join({ id, fresh = false }: { id?: string; fresh?: boolean }) {
  const [name, setName] = useState(localStorage.getItem("cocreate-name") || ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function enter(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    try {
      const rid =
          id || (await api("/api/rooms", undefined, { method: "POST" })).roomId,
        key = `cocreate-session-${rid}`,
        session = await api("/api/session", undefined, {
          method: "POST",
          body: JSON.stringify({
            roomId: rid,
            name,
            token: fresh ? undefined : localStorage.getItem(key),
          }),
        });
      localStorage.setItem(key, session.token);
      localStorage.setItem("cocreate-name", name);
      location.href = `/r/${rid}`;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not open room");
      setBusy(false);
    }
  }
  return (
    <main className="join-screen">
      <section className="join-card">
        <div className="brand-mark">
          <Sparkles />
        </div>
        <p className="kicker">2guys1canvas</p>
        <h1>{id ? "Join the brainstorm" : "Start a shared canvas"}</h1>
        <p className="join-copy">
          Vibe code together in one live document. As the team brainstorms and
          co-writes, one builder turns the combined idea into a working product.
        </p>
        <form onSubmit={enter}>
          <label>
            Display name
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How collaborators will see you"
              maxLength={40}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary wide" disabled={busy || !name.trim()}>
            {busy ? <LoaderCircle className="spin" /> : <Users />}
            {id ? "Join canvas" : "Start brainstorming"}
          </button>
        </form>
      </section>
    </main>
  );
}

const providerPresets: Record<
  ProviderChoice,
  {
    label: string;
    baseUrl: string;
    apiFormat: FormatChoice;
    requiresKey: boolean;
  }
> = {
  openai: {
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiFormat: "responses",
    requiresKey: true,
  },
  anthropic: {
    label: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiFormat: "chat-completions",
    requiresKey: true,
  },
  gemini: {
    label: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiFormat: "chat-completions",
    requiresKey: true,
  },
  openrouter: {
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiFormat: "chat-completions",
    requiresKey: true,
  },
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    apiFormat: "chat-completions",
    requiresKey: true,
  },
  custom: {
    label: "Custom OpenAI-compatible",
    baseUrl: "",
    apiFormat: "chat-completions",
    requiresKey: true,
  },
  ollama: {
    label: "Ollama (local)",
    baseUrl: "http://localhost:11434",
    apiFormat: "chat-completions",
    requiresKey: false,
  },
};

function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  const tools = [
    [
      "Bold",
      Bold,
      () => editor.chain().focus().toggleBold().run(),
      editor.isActive("bold"),
    ],
    [
      "Heading 1",
      Heading1,
      () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      editor.isActive("heading", { level: 1 }),
    ],
    [
      "Heading 2",
      Heading2,
      () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      editor.isActive("heading", { level: 2 }),
    ],
    [
      "Bullet list",
      List,
      () => editor.chain().focus().toggleBulletList().run(),
      editor.isActive("bulletList"),
    ],
    [
      "Numbered list",
      ListOrdered,
      () => editor.chain().focus().toggleOrderedList().run(),
      editor.isActive("orderedList"),
    ],
  ] as const;
  return (
    <div className="toolbar">
      <button title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 />
      </button>
      <button title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 />
      </button>
      <span className="divider" />
      {tools.map(([label, Icon, run, active]) => (
        <button
          key={label}
          title={label}
          onClick={run}
          className={active ? "active" : ""}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}
function People({ people }: { people: Participant[] }) {
  const active = people.filter((p) => p.active);
  return (
    <div className="people">
      <div className="avatar-stack">
        {active.map((p) => (
          <span
            className="avatar"
            title={`${p.name} · ${p.agentStatus}`}
            key={p.id}
            style={{ background: p.color }}
          >
            {p.name[0]?.toUpperCase()}
          </span>
        ))}
      </div>
      <span>{active.length} here</span>
    </div>
  );
}
const statusCopy: { [K in WorkflowStatus]: string } = {
  "Waiting for ideas": "Brainstorm together",
  "Collecting submissions": "Collecting team submissions…",
  "Understanding edits": "Combining submitted ideas",
  "Decision needed": "Resolve a requirement conflict",
  Building: "Shaping the product",
  Updated: "Product updated",
  Error: "Needs attention",
};
function Product({ state, token }: { state: RoomView; token: string }) {
  const [frameKey, setFrameKey] = useState(0),
    [runtimeError, setRuntimeError] = useState("");
  const frame = useRef<HTMLIFrameElement>(null),
    v = state.latestVersion,
    storageKey = `cocreate-product-storage-${state.roomId}`,
    previewUrl = v
      ? `/preview/${state.roomId}/${v}?token=${encodeURIComponent(token)}`
      : "";
  useEffect(() => {
    const readStorage = () => {
        try {
          return JSON.parse(localStorage.getItem(storageKey) || "{}") as Record<
            string,
            string
          >;
        } catch {
          return {};
        }
      },
      writeStorage = (values: Record<string, string>) =>
        localStorage.setItem(storageKey, JSON.stringify(values));
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      const data = event.data || {};
      if (data.type === "cocreate-storage-ready")
        frame.current?.contentWindow?.postMessage(
          { type: "cocreate-storage-init", values: readStorage() },
          "*",
        );
      if (data.type === "cocreate-storage-set") {
        const values = readStorage();
        values[String(data.key)] = String(data.value);
        writeStorage(values);
      }
      if (data.type === "cocreate-storage-remove") {
        const values = readStorage();
        delete values[String(data.key)];
        writeStorage(values);
      }
      if (data.type === "cocreate-storage-clear") writeStorage({});
      if (data.type === "cocreate-preview-error") {
        const message = String(data.message || "Unknown error");
        setRuntimeError(message);
        void api(`/api/rooms/${state.roomId}/runtime-error`, token, {
          method: "POST",
          body: JSON.stringify({ message, version: v }),
        });
      }
    };
    addEventListener("message", receive);
    return () => removeEventListener("message", receive);
  }, [state.roomId, token, frameKey, v, storageKey]);
  return (
    <section className="product-shell">
      {v ? (
        <>
          <div className="preview-bar">
            <div>
              <span className="live-dot" />
              <strong>Shared product v{v}</strong>
              <span>{state.versions.at(-1)?.summary}</span>
            </div>
            <div>
              <button
                title="Refresh preview"
                onClick={() => {
                  setRuntimeError("");
                  setFrameKey((x) => x + 1);
                }}
              >
                <RefreshCw />
              </button>
              <a
                title="Download runnable project"
                href={`/api/rooms/${state.roomId}/download/${v}?token=${encodeURIComponent(token)}`}
                download
              >
                <Download />
              </a>
              <a
                title="Open preview in a new tab"
                target="_blank"
                rel="noreferrer"
                href={previewUrl}
              >
                <ExternalLink />
              </a>
            </div>
          </div>
          {runtimeError && (
            <div className="runtime-error">Preview error: {runtimeError}</div>
          )}
          <iframe
            ref={frame}
            key={frameKey}
            title="2guys1canvas product preview"
            sandbox="allow-scripts allow-forms"
            referrerPolicy="no-referrer"
            src={previewUrl}
          />
        </>
      ) : (
        <div className="preview-empty">
          <div className="preview-symbol">
            <Code2 />
          </div>
          <h2>
            {state.ai.status === "disconnected"
              ? "Connect an AI model to generate your app."
              : "The product will emerge here"}
          </h2>
          {state.ai.status !== "disconnected" && (
            <p>
              Brainstorm or co-write in the canvas. Use Build my changes to turn
              your submitted ideas into a working app.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export function Workspace({ id, tokenOverride, projectTitle, onInvite, onRenameProject, inviteBusy = false }: {
    id: string;
    tokenOverride?: string;
    projectTitle?: string;
    onInvite?: () => void | Promise<void>;
    onRenameProject?: () => void;
    inviteBusy?: boolean;
}) {
    const forceJoin = !tokenOverride && new URLSearchParams(location.search).has('join'), token = tokenOverride || localStorage.getItem(`cocreate-session-${id}`) || '', isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
    const [state, setState] = useState<RoomView | null>(null), [sessionNeeded, setSessionNeeded] = useState(!tokenOverride && (forceJoin || !token)), [connection, setConnection] = useState<ConnectionStatus>({
        state: 'connecting', message: 'Connecting to live collaboration…'
    }), [saveState, setSaveState] = useState<'saving' | 'saved' | 'unsynced'>('unsynced'), [savedAt, setSavedAt] = useState<string>(), [tab, setTab] = useState<'workflow' | 'document' | 'product'>('document'), [split, setSplit] = useState(false), [copied, setCopied] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState(''), [submitting, setSubmitting] = useState(false), shortcut = defaultBuildShortcut(isMac), [settings, setSettings] = useState(false);
    const [localDraft, setLocalDraft] = useState<LocalDraftStatus>('loading');
    const doc = useMemo(() => new Y.Doc(), [id]), [provider, setProvider] = useState<CoCreateProvider>(), submittingRef = useRef(false), apiButtonRef = useRef<HTMLButtonElement>(null), submissionRequest = useRef<string | undefined>(undefined), retryRequest = useRef<string | undefined>(undefined);
    useEffect(() => {
        if (!token)
            return;
        let cancelled = false, p: CoCreateProvider | undefined, stopDraft: (() => void) | undefined;
        const receiveState = (next: RoomView) => {
            setState(next);
            if (next.savedAt)
                setSavedAt(next.savedAt);
        };
        void (async () => {
            // Validate membership before reading private cached content into the editor.
            try {
                await api('/api/rooms/' + id + '/state', token);
                if (cancelled)
                    return;
                const key = draftKey(id, tokenParticipant(token));
                await restoreDraft(doc, key);
                if (cancelled)
                    return;
                setLocalDraft('saved');
                stopDraft = persistDraft(doc, key, setLocalDraft);
            }
            catch {
                if (!cancelled)
                    setLocalDraft('unavailable');
            }
            if (cancelled)
                return;
            p = new CoCreateProvider(doc, id, token, receiveState, setConnection, (status, at) => {
                setSaveState(status);
                if (at)
                    setSavedAt(at);
            });
            setProvider(p);
        })();
        return () => {
            cancelled = true;
            stopDraft?.();
            p?.destroy();
        };
    }, [doc, id, token]);
    const myId = tokenParticipant(token), me = state?.participants.find(p => p.id === myId), isOwner = !!state && state.ownerId === myId;
    const action = useCallback(async (path: string, body?: unknown) => {
        setError('');
        try {
            return await api(path, token, {
                method: 'POST', body: body ? JSON.stringify(body) : undefined
            });
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Action failed');
            throw error;
        }
    }, [token]);
    const editor = useEditor({
        extensions: [StarterKit.configure({
                undoRedo: false
            }), Collaboration.configure({
                document: doc
            }), ...(provider ? [CollaborationCaret.configure({
                    provider, user: {
                        name: me?.name || 'Teammate', color: me?.color || '#5B6BE1'
                    }
                })] : [])], editorProps: {
            attributes: {
                class: 'document-editor', 'aria-label': 'Shared planning document'
            }
        }, immediatelyRender: false
    }, [provider, me?.name, me?.color]);
    const submitChanges = useCallback(async () => {
        if (submittingRef.current)
            return;
        const activeEditor = editor, activeProvider = provider, unavailable = connection.state !== 'connected' ? connection.message : !state || state.ai.status === 'disconnected' ? 'Connect an AI model before submitting changes.' : !activeProvider || !activeEditor ? 'The shared document is still opening.' : null;
        if (unavailable || !activeEditor || !activeProvider) {
            setNotice(unavailable || 'The shared document is still opening.');
            return;
        }
        submittingRef.current = true;
        setSubmitting(true);
        setNotice('');
        const keepFocus = activeEditor.isFocused;
        try {
            await activeProvider.flush();
            submissionRequest.current ||= crypto.randomUUID();
            const result = await action(`/api/rooms/${id}/submit`, {
                requestId: submissionRequest.current
            });
            submissionRequest.current = undefined;
            setNotice(result.message || 'Changes submitted.');
        }
        catch {
        }
        finally {
            submittingRef.current = false;
            setSubmitting(false);
            if (keepFocus)
                requestAnimationFrame(() => activeEditor.commands.focus());
        }
    }, [action, connection, editor, id, provider, state]);
    const retryFailedBuild = useCallback(async () => {
        if (submittingRef.current)
            return;
        submittingRef.current = true;
        setSubmitting(true);
        setNotice('');
        try {
            retryRequest.current ||= crypto.randomUUID();
            const result = await action(`/api/rooms/${id}/retry-build`, {
                requestId: retryRequest.current
            });
            retryRequest.current = undefined;
            setNotice(result.message || 'Retry requested.');
        }
        catch {
        }
        finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    }, [action, id]);
    useEffect(() => {
        if (!editor)
            return;
        let root: HTMLElement | undefined;
        const handle = (event: KeyboardEvent) => {
            if (!isBuildShortcut(event, shortcut))
                return;
            event.preventDefault();
            void submitChanges();
        }, frame = requestAnimationFrame(() => {
            if (editor.isDestroyed)
                return;
            root = editor.view.dom;
            root.addEventListener('keydown', handle);
        });
        return () => {
            cancelAnimationFrame(frame);
            root?.removeEventListener('keydown', handle);
        };
    }, [editor, shortcut, submitChanges]);
    useEffect(() => {
        const context = (document as Document & {
            modelContext?: {
                registerTool: (tool: unknown, options?: {
                    signal?: AbortSignal;
                }) => unknown;
            };
        }).modelContext;
        if (!context?.registerTool || !editor || !state)
            return;
        const lifecycle = new AbortController();
        void Promise.resolve(context.registerTool({
            name: 'cocreate_add_idea', title: 'Add idea', description: 'Append an idea to the visible shared product document.', inputSchema: {
                type: 'object', properties: {
                    idea: {
                        type: 'string', minLength: 1, maxLength: 1000
                    }
                }, required: ['idea'], additionalProperties: false
            }, annotations: {
                readOnlyHint: false, untrustedContentHint: true
            }, execute: (input: any) => {
                const idea = String(input?.idea || '').trim();
                if (!idea)
                    throw new Error('idea is required');
                editor.chain().focus().insertContent(`<p>${idea.replace(/[<>&]/g, c => ({
                    '<': '&lt;', '>': '&gt;', '&': '&amp;'
                }[c]!))}</p>`).run();
                return {
                    added: true
                };
            }
        }, {
            signal: lifecycle.signal
        })).catch(() => {
        });
        return () => lifecycle.abort();
    }, [editor, id, !!state]);
    if (sessionNeeded)
        return <Join id={id} fresh={forceJoin}/>;
    if (!state && connection.state === 'error') {
        const rejoin = connection.reason === 'invalid-session';
        return <main className="loading"><WifiOff /><p>{connection.message}</p><button className="primary" onClick={() => {
            if (rejoin) {
                localStorage.removeItem(`cocreate-session-${id}`);
                setSessionNeeded(true);
            }
            else
                location.href = '/';
        }}>{rejoin ? 'Rejoin room' : 'Return home'}</button></main>;
    }
    if (!state)
        return <main className="loading"><LoaderCircle className="spin"/><p>{connection.message}</p></main>;
    const initialSetup = false;
    const invite = async () => {
        if (onInvite)
            await onInvite();
        else
            await navigator.clipboard.writeText(`${location.origin}/r/${id}?join=1`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1300);
    }, latestRun = state.aiRuns.at(-1);
    return <main className="workspace simple">
    <header className="topbar"><div className="brand"><div className="brand-mark small-mark"><Sparkles /></div><div>{onRenameProject ? <button className="project-title-button" aria-label={`Rename project ${projectTitle}`} title="Rename project" onClick={onRenameProject}><strong>{projectTitle}</strong><Pencil aria-hidden="true"/></button> : <strong>{projectTitle || '2guys1canvas'}</strong>}<span>{projectTitle ? 'Private shared project · select the pencil to rename' : 'Shared product document'}</span></div></div><nav className="tabs" aria-label="Workspace views"><button className={tab === 'workflow' ? 'active' : ''} onClick={() => {
        setTab('workflow');
        setSplit(false);
    }}><BarChart3 />Workflow</button><button className={tab === 'document' ? 'active' : ''} onClick={() => {
        setTab('document');
        setSplit(false);
    }}><FileText />Canvas</button><button className={tab === 'product' ? 'active' : ''} onClick={() => {
        setTab('product');
        setSplit(false);
    }}><Code2 />Artifacts</button></nav><div className="header-actions"><People people={state.participants}/><button ref={apiButtonRef} className="api-connections" onClick={() => setSettings(true)}><Plug />{projectTitle ? 'Builder' : 'AI setup'}</button>{(!projectTitle || onInvite) && <button className="share" disabled={inviteBusy} onClick={() => void invite()}>{copied ? <Check /> : <Copy />}{copied ? 'Copied' : inviteBusy ? 'Creating…' : 'Invite'}</button>}</div></header>
    <div className="controlbar"><div className={`status-pill ${state.status.toLowerCase().replaceAll(' ', '-')}`}>{state.status === 'Building' || state.status === 'Understanding edits' || state.status === 'Collecting submissions' ? <LoaderCircle className="spin"/> : state.status === 'Updated' ? <Check /> : state.status === 'Error' ? <X /> : <WandSparkles />}<span>{statusCopy[state.status]}</span><small>{state.ai.status === 'connected' ? `${providerPresets[state.ai.provider || 'openai'].label} · ${state.ai.builderModel}` : 'AI not connected'}</small></div><div className="control-actions"><button className={split ? 'selected' : ''} onClick={() => {
        setSplit(!split);
        setTab('document');
    }}><PanelLeftClose />Split view</button><span className="build-shortcut-hint">{shortcut === 'disabled' ? 'No macOS shortcut' : shortcutLabel(shortcut)}</span><button className="primary" disabled={submitting} aria-keyshortcuts={ariaShortcut(shortcut)} title={`Build my changes${shortcut === 'disabled' ? '' : ` (${shortcutLabel(shortcut)})`}`} onMouseDown={event => event.preventDefault()} onClick={() => void submitChanges()}>{submitting ? <LoaderCircle className="spin"/> : <WandSparkles />}Build my changes</button></div></div>
    <BuildProgress progress={state.buildProgress}/><VerificationSummary run={state.aiRuns.at(-1)} revisions={state.requirementRevisions}/>
    {notice && <div className="submission-notice" role="status" aria-live="polite">{notice}</div>}{connection.state !== 'connected' && <div className={`connection-banner ${connection.state === 'error' ? 'terminal' : ''}`} role="status"><WifiOff /><span>{connection.message}{connection.state === 'reconnecting' ? ` Retrying (${connection.attempt}/6)…` : ''}</span>{connection.state === 'error' && connection.reason === 'invalid-session' && <button onClick={() => {
        if (tokenOverride)
            location.href = `/login?returnTo=${encodeURIComponent(`/projects/${id}`)}`;
        else {
            localStorage.removeItem(`cocreate-session-${id}`);
            setSessionNeeded(true);
        }
    }}>{tokenOverride ? 'Sign in again' : 'Rejoin room'}</button>}{connection.state === 'error' && connection.reason === 'missing-room' && <button onClick={() => location.href = projectTitle ? '/projects' : '/'}>{projectTitle ? 'Return to projects' : 'Return home'}</button>}</div>}
    {state.ai.status === 'disconnected' && <div className="ai-banner"><KeyRound /><span><strong>Generation is paused.</strong> {isOwner ? 'Connect AI when you’re ready; writing still works.' : 'The project owner needs to connect AI. You can keep writing.'}</span>{isOwner && <button onClick={() => setSettings(true)}>Connect AI</button>}</div>}{(error || state.lastError) && <div className="error-banner"><span><strong>Error.</strong> {error || state.lastError} The last working product remains available.</span>{state.status === 'Error' && state.ai.status === 'connected' && (isOwner || state.ai.temporary?.authorizedSpenderIds.includes(me?.id || '')) && <button onClick={() => void retryFailedBuild()} disabled={submitting}>Retry build</button>}<button onClick={() => setError('')}>Dismiss</button></div>}
    <section className={`content ${split ? 'is-split' : ''}`}>{tab === 'workflow' && !split && <div className="workflow-page"><div className="workflow-main"><WorkflowBoard state={state} onCanvas={() => setTab('document')} onArtifacts={() => setTab('product')}/>{latestRun && <BuildAccounting run={latestRun} history={state.aiRuns}/>}</div><AgentPanel me={me} state={state} token={token} id={id} hosted={true} onViewUsage={() => {
        setTab('workflow');
        requestAnimationFrame(() => document.getElementById('workflow-usage')?.scrollIntoView());
    }}/></div>}{(tab === 'document' || split) && <div className="document-layout"><div className="paper-wrap"><Toolbar editor={editor}/><div className="paper"><div className="doc-meta"><span>SHARED CANVAS</span><span title="Browser recovery copy; shared saves are confirmed separately">{localDraft === 'saved' ? 'Saved on this device' : localDraft === 'saving' ? 'Saving on device…' : localDraft === 'unavailable' ? 'Device backup unavailable' : 'Opening device backup…'}</span><span className={saveState !== 'saved' ? 'saving' : ''}>{saveState === 'unsynced' || connection.state !== 'connected' && saveState === 'saving' ? 'Unsynced changes' : saveState === 'saving' ? 'Saving…' : savedAt ? `Synced ${new Date(savedAt).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
    })}` : 'Not saved yet'}</span></div><EditorContent editor={editor}/></div></div>{!split && <AgentPanel me={me} state={state} token={token} id={id} hosted={true} onViewUsage={() => {
        setTab('workflow');
        requestAnimationFrame(() => document.getElementById('workflow-usage')?.scrollIntoView());
    }}/>}</div>}{(tab === 'product' || split) && <div className="artifacts-layout"><Product state={state} token={token}/>{!split && <AgentPanel me={me} state={state} token={token} id={id} hosted={true} onViewUsage={() => {
        setTab('workflow');
        requestAnimationFrame(() => document.getElementById('workflow-usage')?.scrollIntoView());
    }}/>}</div>}</section>
    {(initialSetup || settings) && <ByokSetup id={id} token={token} current={state.ai} owner={isOwner} onClose={() => {
        setSettings(false);
        requestAnimationFrame(() => apiButtonRef.current?.focus());
    }}/>}
  </main>;
}

export function App() {
  return roomId ? <Workspace id={roomId} /> : <Join />;
}
