import nodemailer from 'nodemailer';

const TO_EMAIL = process.env.NOTIFICATION_EMAIL || 'ratishkannur@gmail.com';

export const sendContactEmailNotification = async ({ name, email, company, subject, message, id }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
      <h2 style="color: #6366f1; margin-top: 0;">New Portfolio Contact Message (#${id})</h2>
      <p>You have received a new contact inquiry via your portfolio website database.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; font-weight: bold; width: 140px; background: #f8fafc;">From Name:</td>
          <td style="padding: 8px; background: #ffffff;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background: #f8fafc;">Email Address:</td>
          <td style="padding: 8px; background: #ffffff;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background: #f8fafc;">Company / Org:</td>
          <td style="padding: 8px; background: #ffffff;">${company || 'Not Specified'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background: #f8fafc;">Subject:</td>
          <td style="padding: 8px; background: #ffffff;">${subject || 'General Inquiry'}</td>
        </tr>
      </table>

      <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 15px;">
        <strong style="display: block; margin-bottom: 8px;">Message Content:</strong>
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
        Message stored in SQLite database (portfolio.db).
      </div>
    </div>
  `;

  // 1. Try free public email relay service (FormSubmit / Web3Forms) so email reaches Gmail without needing SMTP setup
  try {
    const relayResponse = await fetch(`https://formsubmit.co/ajax/${TO_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        company: company || 'N/A',
        subject: `[Portfolio Inquiry] ${subject || 'New Contact Form Submission'} from ${name}`,
        message: `From: ${name} (${email})\nCompany: ${company || 'N/A'}\nSubject: ${subject}\n\nMessage:\n${message}\n\n[Record ID: #${id}]`
      })
    });

    const relayResult = await relayResponse.json();
    if (relayResponse.ok) {
      console.log(`[Email Dispatch] Successfully sent email to ${TO_EMAIL} via FormSubmit relay.`);
      return { success: true, provider: 'FormSubmit', result: relayResult };
    }
  } catch (relayErr) {
    console.log('[Email Dispatch] FormSubmit relay attempt info:', relayErr.message);
  }

  // 2. Fallback to Nodemailer SMTP if credentials exist in .env
  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"${name} via Portfolio" <${emailUser}>`,
        to: TO_EMAIL,
        replyTo: email,
        subject: `[Portfolio Inquiry] ${subject || 'New Contact Form Submission'} from ${name}`,
        html: emailHtml,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Dispatch] Sent notification email to ${TO_EMAIL} via SMTP (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Email Dispatch] Failed to send email via SMTP:', err.message);
      return { success: false, error: err.message };
    }
  }

  return { success: true, simulated: true };
};
