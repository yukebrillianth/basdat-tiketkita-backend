import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: Number(process.env.SMTP2GO_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP2GO_USERNAME,
    pass: process.env.SMTP2GO_API_KEY,
  },
});

export const sendVerificationEmail = async (
  to: string,
  fullname: string,
  code: string,
): Promise<void> => {
  await transporter.sendMail({
    from: `"TiketKita" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Verifikasi Email - TiketKita",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #1a1a2e;">Verifikasi Email TiketKita</h2>
        <p>Halo <strong>${fullname}</strong>,</p>
        <p>Terima kasih telah mendaftar di TiketKita. Masukkan kode berikut untuk memverifikasi email Anda:</p>
        <div style="background: #f0f0f5; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16213e;">${code}</span>
        </div>
        <p>Kode ini berlaku selama <strong>15 menit</strong>.</p>
        <p style="color: #888; font-size: 14px;">Jika Anda tidak mendaftar di TiketKita, abaikan email ini.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  fullname: string,
  code: string,
): Promise<void> => {
  await transporter.sendMail({
    from: `"TiketKita" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Reset Password - TiketKita",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #1a1a2e;">Reset Password TiketKita</h2>
        <p>Halo <strong>${fullname}</strong>,</p>
        <p>Gunakan kode berikut untuk mereset password Anda:</p>
        <div style="background: #f0f0f5; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16213e;">${code}</span>
        </div>
        <p>Kode ini berlaku selama <strong>15 menit</strong>.</p>
        <p style="color: #888; font-size: 14px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });
};
