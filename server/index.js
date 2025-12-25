/*
Node email server for sending generated greeting images via Gmail SMTP.
- Uses express + nodemailer
- Reads EMAIL_USER and EMAIL_PASS from environment
- Endpoint: POST /api/send-greeting-email
  Body: { email: string, imageBase64: string }

Security notes:
- Do NOT commit credentials. Use environment variables or a secret manager.
- Validation enforces Gmail domain (userflow asks for Gmail specifically).
*/

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow images as base64

// Simple email validator for Gmail addresses
function isValidGmail(email) {
  if (typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  return /^[^\s@]+@gmail\.com$/.test(normalized);
}

app.post('/api/send-greeting-email', async (req, res) => {
  try {
    const { email, imageBase64 } = req.body || {};

    if (!email || !imageBase64) {
      return res.status(400).json({ error: 'Missing required fields: email and imageBase64' });
    }

    if (!isValidGmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid Gmail address (example@gmail.com)' });
    }

    // imageBase64 should be a data URL (e.g. data:image/png;base64,AAAA...)
    const matches = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'imageBase64 must be a data URL with PNG or JPEG base64 data' });
    }

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error('Email credentials are not configured in environment variables');
      return res.status(500).json({ error: 'Email service is not configured' });
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Send email
    const mailOptions = {
      from: 'rcewishweaver@gmail.com',
      to: email,
      subject: "Your RCE Welcome's 2026 Greeting 🎉",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#222;">
          <p>Greetings from <strong>Ramachandra College of Engineering (Autonomous)</strong>,</p>
          <p>Wishing you a wonderful and successful 2026.</p>
          <p>Please find your personalized RCE New Year 2026 greeting attached.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'greeting-2026.png',
          content: buffer,
        }
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to send greeting email:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Email server listening on http://localhost:${PORT}`);
});
