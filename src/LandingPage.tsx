import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Layers,
  Users,
  GitBranch,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import "./landing.css";

function CanvasExample() {
  return (
    <figure className="landing-example" aria-labelledby="example-caption">
      <div className="example-top">
        <span>
          <span className="landing-symbol">✳</span> Weekend recipe club
        </span>
        <span className="example-label">Illustrative example</span>
      </div>
      <div className="example-tabs">
        <span>Canvas</span>
        <span>Workflow</span>
        <span>Artifacts</span>
        <div className="example-people">
          <b className="person-a">AK</b>
          <b className="person-b">JM</b>
        </div>
      </div>
      <div className="example-body">
        <div className="example-paper">
          <p className="landing-eyebrow">ONE SHARED CANVAS</p>
          <h3>
            A little space for
            <br />
            good food & good ideas.
          </h3>
          <p>
            <span className="author person-a">Alex · request</span>
            <br />
            Make a recipe list with ingredient filters.
          </p>
          <p>
            <span className="author person-b">Jamie · proposal</span>
            <br />
            Maybe use a dark background?
          </p>
          <p>
            <span className="author person-a">Alex · request</span>
            <br />
            Use ivory, and let us save favorites.
          </p>
          <div className="example-cursor" aria-hidden="true">
            ↖ Jamie is writing
          </div>
        </div>
        <aside>
          <span className="landing-eyebrow">SHARED CONTEXT</span>
          <h4>Accepted requirements</h4>
          <p>
            <Check size={14} /> Recipe list & filters
          </p>
          <p>
            <Check size={14} /> Ivory & favorites
          </p>
          <div className="example-note">
            Jamie’s color idea stays a proposal, ready for discussion.
          </div>
          <div className="example-build">
            Build my changes <ArrowUpRight size={14} />
          </div>
          <small>Each person submits their own steering.</small>
        </aside>
      </div>
      <figcaption id="example-caption">
        Example content, not a live session. Names, activity and requirements
        are illustrative.
      </figcaption>
    </figure>
  );
}

const questions = [
  [
    "Does typing start a build?",
    "No. Writing, saving and presence do not call a model. Build my changes submits only your steering; editor-focused Alt+X invokes the same action on Windows and Linux.",
  ],
  [
    "Can teammates keep writing during a build?",
    "Yes. The coordinator builds a fixed accepted revision. Later submissions wait for that build, then reconcile in capture order. A stopped build returns queued edits for explicit resubmission. Updates are coordinated, not instant.",
  ],
  [
    "What happens when we disagree?",
    "Proposals and questions stay separate from accepted requests and decisions. Detected contradictions keep attributable alternatives; affected contributors resolve them explicitly. Detection is limited and can miss conflicts. Review the interpretation before relying on it.",
  ],
  [
    "Can I choose my models?",
    "The hosted beta uses OpenRouter with your own key. The project owner explicitly selects compatible Interpretation and builder models, and authorizes editors to spend. Automatic need-based model routing is planned.",
  ],
  [
    "What does running locally cost?",
    "Run locally without cloud-hosting costs. Model-provider charges may apply. Local startup requires the app and its dependencies; this is not a promise of fully offline operation or free inference.",
  ],
  [
    "Does joining the waitlist give me access?",
    "Registration records interest only. Beta access is approved manually. Signing in and accepting a project invitation do not bypass approval. Approved testers still need membership in each private project.",
  ],
];

export function LandingPage() {
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
      <a className="landing-skip" href="#main-content">
        Skip to content
      </a>
      <header className="landing-nav">
        <a className="landing-brand" href="/" aria-label="2guys1canvas home">
          <span className="landing-symbol">✳</span>2guys1canvas
        </a>
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#questions">Questions</a>
          <a className="landing-signin" href="/login?returnTo=%2Fapp">
            Beta tester sign-in <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
      <main id="main-content">
        <section className="landing-hero">
          <div>
            <p className="landing-eyebrow">
              <span className="landing-dot" /> IN THE MAKING · PRIVATE BETA
            </p>
            <h1>
              One canvas.
              <br />
              Multiple people.
              <br />
              <em>One product.</em>
            </h1>
            <p className="hero-copy">
              Give your ideas a shared place to become something real. Write
              together, submit your own changes, and follow the decisions into
              one working product.
            </p>
            <div className="landing-actions">
              <a className="landing-cta" href="#waitlist">
                Join the beta waitlist <ArrowUpRight size={19} />
              </a>
              <a href="/login?returnTo=%2Fapp">
                Beta tester sign-in <ArrowRight size={16} />
              </a>
            </div>
            <p className="hero-footnote">
              Built for collaboration. A deliberate step from writing to
              building.
            </p>
          </div>
          <div className="hero-margin-note">
            <span>01 / THE IDEA</span>
            <p>
              Less passing prompts.
              <br />
              More making together.
            </p>
            <span className="margin-flower" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>
        <CanvasExample />
        <section className="landing-section" id="the-canvas">
          <div className="section-heading">
            <p className="landing-eyebrow">
              A SHARED DOCUMENT. A CLEARER PROCESS.
            </p>
            <h2>
              Many perspectives.
              <br />
              One shared direction.
            </h2>
            <p>
              Keep the people, their intent and the product in the same
              conversation.
            </p>
          </div>
          <div className="landing-pillars">
            <article>
              <Users />
              <span className="pillar-number">01</span>
              <h3>A canvas for everyone</h3>
              <p>
                Write together with participant labels, distinct colors and
                presence. See whose ideas are taking shape without handing the
                document back and forth.
              </p>
            </article>
            <article>
              <Layers />
              <span className="pillar-number">02</span>
              <h3>Your changes, deliberately submitted</h3>
              <p>
                Build my changes captures your steering only. Teammates keep
                writing while one coordinator builds an accepted revision. Later
                submissions queue for the next coordinated update.
              </p>
            </article>
            <article>
              <GitBranch />
              <span className="pillar-number">03</span>
              <h3>Two ways to protect intent</h3>
              <p>
                <strong>First, classify.</strong> Requests and settled decisions
                can become accepted requirements. Ideas, proposals and questions
                stay open for discussion.
              </p>
              <p>
                <strong>Then, resolve.</strong> Potential contradictions retain
                their authors and alternatives. Affected contributors explicitly
                resolve detected conflicts; detection is not comprehensive.
              </p>
              <div className="pillar-example">
                “Maybe use a dark background” → proposal
                <br />
                “Use ivory” → request
                <br />A conflicting explicit request → flagged for resolution
              </div>
            </article>
            <article>
              <KeyRound />
              <span className="pillar-number">04</span>
              <h3>Your key. Your model choices.</h3>
              <p>
                Hosted beta: connect an OpenRouter key and explicitly choose
                compatible Interpretation and builder models. The owner controls
                spending permission.
              </p>
              <p className="planned-label">
                Planned: automatic routing based on the task’s needs.
              </p>
              <p>
                Run locally without cloud-hosting costs. Model-provider charges
                may apply.
              </p>
            </article>
          </div>
        </section>
        <section className="landing-process landing-section" id="how-it-works">
          <div className="section-heading">
            <p className="landing-eyebrow">FROM A THOUGHT TO A THING</p>
            <h2>
              Write. Submit.
              <br />
              Review. Make.
            </h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <h3>Write together</h3>
              <p>Share a canvas. Explore ideas without starting inference.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Submit your changes</h3>
              <p>Choose Build my changes when your steering is ready.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Review the intent</h3>
              <p>
                Inspect interpretations, accepted requests and conflicts.
                Correct what needs attention.
              </p>
            </li>
            <li>
              <span>04</span>
              <h3>See the product grow</h3>
              <p>
                One builder integrates accepted changes. Failed updates retain
                the previous product.
              </p>
            </li>
          </ol>
        </section>
        <section className="landing-status landing-section">
          <div>
            <p className="landing-eyebrow">WHERE WE ARE TODAY</p>
            <h2>
              A working foundation.
              <br />
              Room to grow.
            </h2>
            <p>
              Local checks exercise shared writing, author-only submissions,
              intent review, coordinated builds and retained products. These
              checks do not establish hosted launch readiness.
            </p>
          </div>
          <div>
            <h3>Working in local checks</h3>
            <ul>
              <li>Collaborative canvas and attributed steering</li>
              <li>Request/proposal separation and explicit conflict choices</li>
              <li>Serialized updates, bounded recovery and recorded usage</li>
            </ul>
            <h3>Planned & still being verified</h3>
            <ul>
              <li>Automatic need-based model routing</li>
              <li>Broader functional checks and conflict detection</li>
              <li>Hosted database, storage and release verification</li>
            </ul>
          </div>
        </section>
        <section
          className="landing-recording landing-section"
          aria-labelledby="recording-heading"
        >
          <div className="recording-art" aria-hidden="true">
            <div>Canvas → Accepted intent → Product</div>
            <span>✳</span>
          </div>
          <div>
            <p className="landing-eyebrow">A CLOSER LOOK</p>
            <h2 id="recording-heading">The process, in view.</h2>
            <p>
              The example above shows how ideas and accepted requests stay
              distinct. A recorded walkthrough is planned for this space. There
              is no product video yet.
            </p>
            <a href="#the-canvas">
              Explore the canvas example <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <section className="landing-section landing-faq" id="questions">
          <div className="section-heading">
            <p className="landing-eyebrow">A FEW THINGS YOU MIGHT WONDER</p>
            <h2>Good questions.</h2>
          </div>
          <div>
            {questions.map(([title, answer]) => (
              <details key={title}>
                <summary>
                  {title}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="landing-waitlist landing-section" id="waitlist">
          <div>
            <p className="landing-eyebrow">LET’S MAKE SOMETHING TOGETHER</p>
            <h2>
              Be part of
              <br />
              <em>the first canvas.</em>
            </h2>
            <p>
              Register your interest in the private beta. We’ll email when a
              spot is available; there’s no promised date or queue position.
            </p>
            <a href="/login?returnTo=%2Fapp">
              Already approved? Beta tester sign-in <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="waitlist-card">
            <h3>Join the beta waitlist</h3>
            <form onSubmit={submit} aria-busy={busy}>
              <label htmlFor="waitlist-email">Email address</label>
              <input
                id="waitlist-email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                required
                disabled={busy || !!success}
                placeholder="you@example.com"
                aria-describedby="waitlist-privacy"
              />
              <div className="waitlist-honeypot" aria-hidden="true">
                <label htmlFor="waitlist-website">Website</label>
                <input
                  id="waitlist-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <label className="waitlist-consent">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  disabled={busy || !!success}
                />
                <span>
                  I consent to receive beta invitations and product updates by
                  email.
                </span>
              </label>
              <button className="landing-cta" disabled={busy || !!success}>
                {busy
                  ? "Saving registration…"
                  : success
                    ? "Registered"
                    : "Join the beta waitlist"}
                {success ? <Check size={19} /> : <ArrowUpRight size={19} />}
              </button>
              <p id="waitlist-privacy" className="waitlist-privacy">
                Your registration is private and does not create an account or
                grant access. We store your email, consent and registration
                time. No tracking is added.
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
        </section>
      </main>
      <footer className="landing-footer">
        <a className="landing-brand" href="/">
          <span className="landing-symbol">✳</span>2guys1canvas
        </a>
        <p>A shared place to make things.</p>
        <a href="/login?returnTo=%2Fapp">
          Beta tester sign-in <ArrowUpRight size={16} />
        </a>
      </footer>
    </div>
  );
}
