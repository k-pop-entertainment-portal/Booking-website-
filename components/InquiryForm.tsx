import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Disc3,
  ListFilter,
  Star,
  MessageSquare,
  Images,
  ShieldAlert,
  Send,
  Loader2,
  CheckCircle2,
  TriangleAlert,
} from "lucide-react";
import { allGroups } from "../data/matrix";
import { submitToPortal } from "../utils/submitForm";

const inquiryTypes = [
  "Official Membership Card — Information & Registration Guide",
  "Fan Club Tier Guidance (VIP / Premium / Gold)",
  "Event Ticketing Support",
  "Report Fake Profiles & Imposters",
  "Official Fan Meeting & Fan-Sign Information",
  "Idol Support — Official Photo Books & Merchandise",
  "Charity & Donation Verification",
  "Fan Letter & Message Delivery",
  "General Fan Advocacy Support",
  "Business / Collaboration Inquiry",
  "Other Request",
];

const initial = {
  name: "",
  email: "",
  phone: "",
  target: "",
  type: "",
  idol: "",
  details: "",
};

function Label({ icon: Icon, children, required }: { icon: any; children: React.ReactNode; required?: boolean }) {
  return (
    <span className="mb-2 flex items-center gap-2 text-xs font-bold text-white/80">
      <Icon className="h-3.5 w-3.5 text-neon-violet" />
      {children}
      {required && <span className="text-neon-pink">*</span>}
    </span>
  );
}

export default function InquiryForm() {
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState<{ photos: string[]; evidence: string[] }>({
    photos: [],
    evidence: [],
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: keyof typeof initial) => (e: any) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickFiles =
    (key: "photos" | "evidence") => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFiles((f) => ({ ...f, [key]: Array.from(e.target.files ?? []).map((x) => x.name) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const list = (arr: string[]) => (arr.length ? arr.join(", ") : "— none —");

    const res = await submitToPortal(`Portal Inquiry — ${form.name} · ${form.type}`, {
      Name: form.name,
      email: form.email,
      "Phone (with country code)": form.phone,
      "Target Artist / Group": form.target,
      "Inquiry Type": form.type,
      "Favorite K-pop Idol": form.idol,
      "Request Details": form.details,
      "Attached Photos": list(files.photos),
      "Attached Impersonator Evidence": list(files.evidence),
      "Submitted From": "K-Pop Wave Entertainment Portal — 2026 Matrix (inquiry form)",
    });

    if (res.ok) {
      setStatus("sent");
      setForm(initial);
      setFiles({ photos: [], evidence: [] });
    } else {
      setStatus("error");
      setErrorMsg(res.message);
    }
  };

  return (
    <motion.aside
      id="inquiry"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="h-fit rounded-3xl border border-[#3b2a63] bg-gradient-to-b from-[#181431]/95 to-[#0f1220]/95 p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] md:p-6 lg:sticky lg:top-24"
    >
      <div className="mb-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-800 tracking-tight text-white">
          <Send className="h-5 w-5 text-neon-pink" />
          Send Your Request
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Submit your request — feedback is sent to your email by Entertainment Industry
          Management.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[24rem] flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.1 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-neon-cyan shadow-xl shadow-emerald-400/30"
            >
              <CheckCircle2 className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="mt-5 font-display text-xl font-800 text-white">Request Submitted</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
              Your request and its attachments have been securely forwarded to the management
              team of the group and idol you selected. Feedback will be sent to{" "}
              <span className="font-semibold text-neon-cyan">your email</span> shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-full border border-line bg-panel px-6 py-2.5 text-xs font-bold text-white transition-colors hover:border-neon-violet"
            >
              Submit another request
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <label className="block">
              <Label icon={User} required>Name</Label>
              <input required className="field" placeholder="Your full name" value={form.name} onChange={set("name")} />
            </label>

            <label className="block">
              <Label icon={Mail} required>Email</Label>
              <input required type="email" className="field" placeholder="you@example.com" value={form.email} onChange={set("email")} />
            </label>

            <div>
              <label className="block">
                <Label icon={Phone} required>Phone Number (with country code)</Label>
                <input
                  required
                  type="tel"
                  className="field"
                  placeholder="+82 10 1234 5678"
                  pattern="^\+[0-9\s\-]{6,20}$"
                  title="Include your country code starting with + (e.g. +1, +44, +82, +234)"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </label>
              <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-amber-400/90">
                <TriangleAlert className="mt-px h-3 w-3 shrink-0" />
                You must include your country code starting with "+" (e.g. +1, +44, +82, +234).
              </p>
            </div>

            <label className="block">
              <Label icon={Disc3} required>Target Artist / Group</Label>
              <select required className="field" value={form.target} onChange={set("target")}>
                <option value="" disabled>
                  Select an artist / group
                </option>
                {allGroups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="Other / Multiple">Other / Multiple</option>
              </select>
            </label>

            <label className="block">
              <Label icon={ListFilter} required>Inquiry Type</Label>
              <select required className="field" value={form.type} onChange={set("type")}>
                <option value="" disabled>
                  Select inquiry type
                </option>
                {inquiryTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <Label icon={Star} required>Name of Your Favorite K-pop Idol</Label>
              <input required className="field" placeholder="e.g. Jung Kook" value={form.idol} onChange={set("idol")} />
            </label>

            <label className="block">
              <Label icon={MessageSquare} required>Request Details</Label>
              <textarea
                required
                rows={4}
                className="field resize-none"
                placeholder="Describe your request in detail…"
                value={form.details}
                onChange={set("details")}
              />
            </label>

            {/* Attachments */}
            <div className="space-y-3 rounded-2xl border border-line bg-black/20 p-4">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-bold text-white/80">
                  <Images className="h-3.5 w-3.5 text-neon-cyan" />
                  Upload Your Photos &amp; Favorite Idol Photos{" "}
                  <span className="font-medium text-white/35">(optional)</span>
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={pickFiles("photos")}
                  className="w-full text-xs text-white/50 file:mr-3 file:rounded-lg file:border-0 file:bg-neon-violet/20 file:px-3.5 file:py-2 file:text-xs file:font-bold file:text-neon-violet hover:file:bg-neon-violet/30"
                />
                <p className="mt-1.5 text-[11px] leading-snug text-white/35">
                  You can select <b className="text-white/60">as many photos as you like</b> at
                  once — tap the field, then tap/long-press to pick multiple images before
                  confirming. Optional — the form still submits without them.
                  {files.photos.length > 0 && (
                    <span className="mt-1 block text-neon-cyan">{files.photos.length} file(s) selected: {files.photos.join(", ")}</span>
                  )}
                </p>
              </label>

              <label className="block border-t border-white/5 pt-3">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-bold text-white/80">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                  Upload Impersonator Evidence / Screenshot{" "}
                  <span className="font-medium text-white/35">(optional)</span>
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={pickFiles("evidence")}
                  className="w-full text-xs text-white/50 file:mr-3 file:rounded-lg file:border-0 file:bg-red-400/15 file:px-3.5 file:py-2 file:text-xs file:font-bold file:text-red-400 hover:file:bg-red-400/25"
                />
                <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-white/35">
                  <TriangleAlert className="mt-px h-3 w-3 shrink-0 text-amber-400/80" />
                  <span>
                    You can attach <b className="text-white/60">multiple screenshots / files at once</b>.
                    Evidence &amp; information submitted here regarding fake profiles &amp;
                    imposters will be forwarded directly to the FBI / CIA and relevant
                    authorities for investigation.
                    {files.evidence.length > 0 && (
                      <span className="mt-1 block text-red-400">{files.evidence.length} file(s): {files.evidence.join(", ")}</span>
                    )}
                  </span>
                </p>
              </label>
            </div>

            {status === "error" && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs leading-relaxed text-red-300">
                {errorMsg} — please check your connection and try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-neon-violet to-neon-pink py-3.5 text-sm font-800 text-white shadow-xl shadow-neon-violet/30 transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting request…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Request
                </>
              )}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-white/35">
              Attachments are noted with your request. All inquiries and form submissions are
              securely forwarded to the appropriate group and idol management team that you
              select while filling out the form.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
