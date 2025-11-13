const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpEmail = async ({ to, subject, otp, template = 'verification' }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials are not configured. Set SMTP_USER and SMTP_PASS.');
  }

  const templates = {
    verification: `
      <div style="font-family: Arial, sans-serif; color: #1f2345; padding: 24px;">
        <h2 style="color:#4C51BF;">Verify your email address</h2>
        <p>Use the OTP below to complete your verification. The code expires in 10 minutes.</p>
        <div style="font-size:32px; letter-spacing:12px; font-weight:bold; color:#2D3748; margin:24px 0;">
          ${otp}
        </div>
        <p>If you did not request this, please ignore the email.</p>
        <p>— Premium Resume Optimizer</p>
      </div>
    `,
    reset: `
      <div style="font-family: Arial, sans-serif; color: #1f2345; padding: 24px;">
        <h2 style="color:#D53F8C;">Reset your password</h2>
        <p>Use the OTP below to reset your password. The code expires in 10 minutes.</p>
        <div style="font-size:32px; letter-spacing:12px; font-weight:bold; color:#2D3748; margin:24px 0;">
          ${otp}
        </div>
        <p>If you did not request this, please secure your account.</p>
        <p>— Premium Resume Optimizer</p>
      </div>
    `,
  };

  await transporter.sendMail({
    from: `"Premium Resume Optimizer" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: templates[template] || templates.verification,
  });
};

module.exports = {
  sendOtpEmail,
};

