import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email Transporter (Lazy initialization could be better but for simplified setup we check env)
  const getTransporter = () => {
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '587');
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !user || !pass) {
      console.warn("Email configuration missing. Notifications will not be sent.");
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  };

  // API Route to send email
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text, html } = req.body;
    console.log(`Email request to: ${to}, subject: ${subject}`);
    const transporter = getTransporter();

    if (!transporter) {
      console.error("Email send failed: Transporter not configured. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS.");
      return res.status(500).json({ error: "Email configuration missing. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in the Settings menu." });
    }

    try {
      await transporter.sendMail({
        from: `SprinterPlus <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/email-config-status", (req, res) => {
    res.json({
      configured: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS),
      host: !!process.env.EMAIL_HOST,
      user: !!process.env.EMAIL_USER,
      pass: !!process.env.EMAIL_PASS,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
