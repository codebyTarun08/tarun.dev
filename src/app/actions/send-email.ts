
'use server';

import nodemailer from 'nodemailer';

export async function sendEmailAction(formData: { name: string; email: string; message: string }) {
  const { name, email, message } = formData;

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    replyTo: email,
    subject: `New Portfolio Message from ${name}`,
    html: `
      <div style="background-color: #f4f4f7; padding: 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Portfolio Inquiry</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">You have received a new message from your portfolio contact form.</p>
            
            <div style="margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; font-weight: bold; text-transform: uppercase;">From</p>
              <p style="margin: 5px 0 0; font-size: 16px; color: #111827;">${name} (${email})</p>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; font-weight: bold; text-transform: uppercase;">Message</p>
              <div style="margin: 10px 0 0; font-size: 16px; color: #111827; background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #6d28d9; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} Portfolio Admin System</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
