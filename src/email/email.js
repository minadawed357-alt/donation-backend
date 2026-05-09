import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, html) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Donation App <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  return response.json();
};

export const sendConfirmationEmail = async (email, token) => {
  const html = `
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
      <p style="font-size:14px;color:#6b7280;font-style:italic;">This link will expire in 20 minutes.</p>
      <p style="font-size:16px;color:#4b5563;">If you didn't create an account with us, please ignore this email.</p>
    </div>
    <div style="background-color:#eef2ff;padding:20px;text-align:center;color:#6b7280;font-size:14px;border-top:1px solid #e5e7eb;">
      <p style="margin:5px 0;">© ${new Date().getFullYear()} Donation App. All rights reserved.</p>
    </div>
  `;

  try {
    const info = await sendEmail(email, "Confirm your email", html);
    console.log("Email sent:", info);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(error);
  }
};

export const sendResetPasswordEmail = async (email, token) => {
  const html = `
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
      <p style="font-size:14px;color:#6b7280;font-style:italic;">This link will expire in 20 minutes.</p>
      <p style="font-size:16px;color:#4b5563;">If you didn't request this, please ignore this email.</p>
    </div>
    <div style="background-color:#eef2ff;padding:20px;text-align:center;color:#6b7280;font-size:14px;border-top:1px solid #e5e7eb;">
      <p style="margin:5px 0;">© ${new Date().getFullYear()} Donation App. All rights reserved.</p>
    </div>
  `;

  try {
    await sendEmail(email, "Reset your password", html);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};