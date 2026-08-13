import nodemailer from 'nodemailer';

const isDemo = process.env.DEMO_MODE === 'true';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'demo@smartsched.ai',
    pass: process.env.EMAIL_PASS || 'demo_password',
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  if (isDemo) {
    console.log('--------------------------------------------------');
    console.log('📧 [DEMO MODE EMAIL SIMULATION]');
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY:\n${text || html}`);
    console.log('--------------------------------------------------');
    return { messageId: `demo-msg-${Date.now()}` };
  }

  try {
    const info = await transporter.sendMail({
      from: `"SmartSched AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('❌ Email sending failed (logging fallback):', err.message);
    return { error: err.message };
  }
};
