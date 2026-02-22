import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? "465");
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true"
      : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  return transporter;
}

export async function sendEmail({ to, subject, text, html }: SendEmailInput) {
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const transport = getTransporter();

  if (!from || !transport) {
    console.warn("Email not configured. Skipping outbound email.");
    return { ok: false, error: "Email not configured." };
  }

  try {
    await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    return { ok: true };
  } catch (error) {
    console.error("Email send failed.", error);
    return { ok: false, error: "Email send failed." };
  }
}
