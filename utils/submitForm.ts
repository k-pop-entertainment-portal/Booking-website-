/**
 * All portal form submissions are delivered to the portal support inbox.
 * Uses FormSubmit's AJAX endpoint so no backend server is required.
 */
export const PORTAL_EMAIL = "support.kpop.wave.portal897@gmail.com";

const ENDPOINT = `https://formsubmit.co/ajax/${PORTAL_EMAIL}`;

export interface FormPayload {
  [key: string]: string;
}

export async function submitToPortal(
  subject: string,
  payload: FormPayload
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        _captcha: "false",
        _replyto: payload.email || "",
        ...payload,
      }),
    });

    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const data = await res.json().catch(() => ({}));

    if (data.success === "false" || data.success === false) {
      throw new Error(data.message || "Submission rejected");
    }
    return { ok: true, message: "Submission received successfully." };
  } catch (err: any) {
    return {
      ok: false,
      message:
        err?.message ||
        "Network issue — please try again in a moment.",
    };
  }
}
