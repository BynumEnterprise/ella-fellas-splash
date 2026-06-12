import { marked } from "marked";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

export const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? "Ella Fellas <daily@ellafellas.com>";
export const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "hi@ellafellas.com";

/**
 * Send a single email through the Resend HTTP API.
 *
 * Returns { ok, status, id?, error? }. Never throws — callers decide how to
 * handle a failed send (e.g. continue the batch, log, retry).
 *
 * `listUnsubscribeUrl`, when provided, sets the List-Unsubscribe header so
 * Gmail/Apple show a native one-click unsubscribe button. This is required
 * for good deliverability on bulk sends.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  listUnsubscribeUrl?: string;
}): Promise<{ ok: boolean; status: number; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping send to", opts.to);
    return { ok: false, status: 0, error: "RESEND_API_KEY not set" };
  }

  const headers: Record<string, string> = {};
  if (opts.listUnsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${opts.listUnsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        reply_to: REPLY_TO,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        headers: Object.keys(headers).length ? headers : undefined,
      }),
    });
    if (!res.ok) {
      const error = await res.text();
      console.error(`Resend send failed (${res.status}) to ${opts.to}:`, error);
      return { ok: false, status: res.status, error };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, status: res.status, id: data.id };
  } catch (err) {
    console.error("Resend send threw:", err);
    return { ok: false, status: 0, error: String(err) };
  }
}

/**
 * Wrap arbitrary inner HTML in the Ella Fellas branded email shell.
 * Keeps the same look as the signup/welcome emails: cream background,
 * white card, gold wordmark, footer with unsubscribe.
 */
export function wrapEmail(opts: {
  innerHtml: string;
  unsubscribeUrl: string;
  preheader?: string;
}): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>`
    : "";
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FAF7F0;font-family:-apple-system,system-ui,sans-serif;color:#1A1A1A;">
  ${preheader}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid rgba(26,26,26,0.1);border-radius:8px;padding:32px;">
        <tr><td>
          <a href="${SITE_URL}" style="text-decoration:none;">
            <h1 style="font-family:Impact,sans-serif;color:#C89B3C;letter-spacing:0.08em;font-size:32px;margin:0 0 4px 0;">ELLA FELLAS</h1>
          </a>
          <p style="color:rgba(26,26,26,0.6);font-size:13px;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 24px 0;">The unofficial Ella Langley superfan HQ</p>
          ${opts.innerHtml}
        </td></tr>
      </table>
      <p style="color:rgba(26,26,26,0.45);font-size:12px;line-height:1.6;margin:24px 0 0 0;max-width:560px;">
        You're getting this because you signed up at <a href="${SITE_URL}" style="color:rgba(26,26,26,0.55);">ellafellas.com</a>.<br />
        <a href="${opts.unsubscribeUrl}" style="color:rgba(26,26,26,0.55);">Unsubscribe instantly</a> &middot; We're a fan site, not affiliated with Ella Langley, her label, or her management.<br />
        Bynum Enterprises &middot; San Bernardino, CA
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Convert newsletter markdown (body only, no frontmatter) into HTML styled
 * for email. We render with `marked`, then inject a scoped <style> block so
 * headings/links/lists carry the brand colors in clients that honor <style>.
 */
export function newsletterMarkdownToHtml(markdownBody: string): string {
  // Absolutize internal links: email clients turn a root-relative href like
  // "/news/x" into the invalid "http:///news/x". Force every internal link/img
  // to a full https://ellafellas.com URL. (Belt-and-suspenders: senders should
  // already write absolute URLs.)
  const rendered = (marked.parse(markdownBody, { async: false }) as string)
    .replace(/href="\/(?!\/)/g, `href="${SITE_URL}/`)
    .replace(/src="\/(?!\/)/g, `src="${SITE_URL}/`);
  const styled = `
  <style>
    .nl h1 { font-family:Impact,sans-serif; color:#2F4858; letter-spacing:0.03em; font-size:26px; margin:16px 0 8px; }
    .nl h2 { font-family:Impact,sans-serif; color:#C89B3C; letter-spacing:0.03em; font-size:19px; margin:24px 0 8px; text-transform:uppercase; }
    .nl p { font-size:15px; line-height:1.6; margin:0 0 14px; }
    .nl ul { font-size:15px; line-height:1.6; padding-left:20px; margin:0 0 14px; }
    .nl li { margin:0 0 10px; }
    .nl a { color:#2F4858; }
    .nl hr { border:none; border-top:1px solid rgba(26,26,26,0.12); margin:24px 0; }
    .nl em { color:rgba(26,26,26,0.7); }
  </style>
  <div class="nl">${rendered}</div>`;
  return styled;
}

/** Build the public unsubscribe URL for a given token. */
export function unsubscribeUrl(token: string): string {
  return `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

/** Build the public confirm URL for a given token. */
export function confirmUrl(token: string): string {
  return `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
}
