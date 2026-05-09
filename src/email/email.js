import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendConfirmationEmail = async (email, token) => {
  const mailOptions = {
    from: `"Donation App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Confirm your email",
    html: `
    <div style="background-color:#4f46e5;padding:30px 0;text-align:center;">
      <h2 style="color:#fff;margin:0;font-size:26px;">Donation App</h2>
    </div>
    <div style="padding:30px;text-align:center;">
      <h1 style="color:#4338ca;font-size:24px;margin-bottom:20px;">Email Confirmation</h1>
      <p style="font-size:16px;color:#4b5563;">Thank you for registering! Click the button below to confirm your email:</p>
      <a href="${process.env.FRONTEND_URL}/confirm-email/${token}" 
         style="display:inline-block;background-color:#4f46e5;color:white;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;margin:20px 0;">
        Confirm Email
      </a>
      <p style="font-size:14px;color:#6b7280;">This link will expire in 20 minutes.</p>
    </div>
    <div style="background-color:#eef2ff;padding:20px;text-align:center;color:#6b7280;font-size:14px;">
      <p>© ${new Date().getFullYear()} Donation App. All rights reserved.</p>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(error);
  }
};

export const sendResetPasswordEmail = async (email, token) => {
  const mailOptions = {
    from: `"Donation App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
    <div style="background-color:#4f46e5;padding:30px 0;text-align:center;">
      <h2 style="color:#fff;margin:0;font-size:26px;">Donation App</h2>
    </div>
    <div style="padding:30px;text-align:center;">
      <h1 style="color:#4338ca;font-size:24px;margin-bottom:20px;">Reset Password</h1>
      <p style="font-size:16px;color:#4b5563;">Click the button below to reset your password:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password/${token}" 
         style="display:inline-block;background-color:#4f46e5;color:white;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;margin:20px 0;">
        Reset Password
      </a>
      <p style="font-size:14px;color:#6b7280;">This link will expire in 20 minutes.</p>
    </div>
    <div style="background-color:#eef2ff;padding:20px;text-align:center;color:#6b7280;font-size:14px;">
      <p>© ${new Date().getFullYear()} Donation App. All rights reserved.</p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};