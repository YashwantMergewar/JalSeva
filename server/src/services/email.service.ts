import nodemailer from "nodemailer";
import { config } from "../config/env.js";

interface TransportOptions {
  host?: string;
  port: number;
  secure: boolean;
  auth?: { user: string; pass: string };
  tls?: { rejectUnauthorized: boolean };
}

const buildTransport = () => {
  const opts: TransportOptions = {
    host: config.SMTP_HOST || "smtp.gmail.com",
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE === "true" || config.SMTP_PORT === 465,
    tls: {
      // Prevents "self-signed certificate in certificate chain" errors
      // caused by local antivirus, network proxies, or test mailers (e.g. Ethereal) in development.
      rejectUnauthorized: config.NODE_ENV === "production",
    },
  };

  if (config.SMTP_USER && config.SMTP_PASS) {
    opts.auth = { user: config.SMTP_USER, pass: config.SMTP_PASS };
  }

  return nodemailer.createTransport(opts);
};

interface SendActivationEmailParams {
  to: string;
  employeeName: string;
  employeeId: string;
  departmentName: string;
  roleName: string;
  activationUrl: string;
}

export async function sendActivationEmail(params: SendActivationEmailParams): Promise<void> {
  const { to, employeeName, employeeId, departmentName, roleName, activationUrl } = params;

  const firstName = employeeName.split(" ")[0] ?? employeeName;
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Activate Your Jal Seva Account</title>
<style>
  body{margin:0;padding:0;background-color:#f0f4fb;font-family:'Segoe UI',Arial,sans-serif}
  .wrapper{max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
  .hdr{background:linear-gradient(135deg,#0040a1 0%,#0056d2 100%);padding:36px 32px;text-align:center}
  .hdr h1{color:#ffffff;font-size:22px;font-weight:700;margin:8px 0 4px 0}
  .hdr p{color:rgba(255,255,255,.8);font-size:13px;margin:0}
  .badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);border-radius:20px;padding:4px 14px;color:rgba(255,255,255,.9);font-size:11px;font-weight:600;margin-top:12px;letter-spacing:.5px}
  .body{padding:36px 32px}
  .greeting{font-size:20px;font-weight:700;color:#0f172a;margin:0 0 8px 0}
  .intro{font-size:15px;color:#475569;line-height:1.6;margin:0 0 28px 0}
  .info-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:28px}
  .info-lbl{font-size:11px;font-weight:700;color:#64748b;letter-spacing:.8px;text-transform:uppercase;margin:0 0 14px 0}
  .row{display:flex;gap:10px;margin-bottom:10px;align-items:flex-start}
  .dot{width:8px;height:8px;background:#0056d2;border-radius:50%;margin-top:5px;flex-shrink:0}
  .lbl{font-size:12px;color:#64748b;font-weight:500;min-width:120px}
  .val{font-size:13px;color:#0f172a;font-weight:700}
  .id-val{font-size:14px;color:#0040a1;font-weight:800;letter-spacing:.5px}
  .exp{display:flex;gap:12px;align-items:flex-start;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-bottom:24px}
  .exp-text{font-size:13px;color:#92400e;line-height:1.5}
  .cta{text-align:center;margin-bottom:24px}
  .btn{display:inline-block;background:linear-gradient(135deg,#0040a1 0%,#0056d2 100%);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:16px 36px;border-radius:10px;box-shadow:0 4px 16px rgba(0,64,161,.3)}
  .cta-hint{font-size:12px;color:#94a3b8;margin-top:10px}
  .url-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:24px;word-break:break-all;font-size:11px;color:#475569}
  .sec{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 16px;margin-bottom:28px}
  .sec p{font-size:12px;color:#15803d;margin:0;line-height:1.5}
  .divider{height:1px;background:#e2e8f0;margin:20px 0}
  .footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 32px;text-align:center}
  .footer p{font-size:11px;color:#94a3b8;margin:4px 0;line-height:1.5}
  .footer .brand{font-size:12px;font-weight:700;color:#0040a1;margin-bottom:6px}
</style>
</head>
<body>
<div class="wrapper">
  <div class="hdr">
    <div style="font-size:36px;margin-bottom:8px">💧</div>
    <h1>Jal Seva</h1>
    <p>Municipal Water &amp; Sanitation Authority</p>
    <div class="badge">&#127470;&#127475; Ministry of Jal Shakti &bull; Govt. of India</div>
  </div>
  <div class="body">
    <p class="greeting">Welcome, ${firstName}!</p>
    <p class="intro">An official employee account has been created for you in the Jal Seva municipal management system. To complete your registration, please activate your account by creating a secure password.</p>
    <div class="info-card">
      <p class="info-lbl">Your Account Details</p>
      <div class="row"><div class="dot"></div><span class="lbl">Employee Name</span><span class="val">${employeeName}</span></div>
      <div class="row"><div class="dot"></div><span class="lbl">Employee ID</span><span class="id-val">${employeeId}</span></div>
      <div class="row"><div class="dot"></div><span class="lbl">Department</span><span class="val">${departmentName}</span></div>
      <div class="row"><div class="dot"></div><span class="lbl">Assigned Role</span><span class="val">${roleName}</span></div>
    </div>
    <div class="exp">
      <div style="font-size:18px">&#9200;</div>
      <div class="exp-text"><strong>This link expires in 24 hours.</strong> Please activate your account promptly. If the link expires, contact your administrator for a new invitation. <strong>This link is single-use</strong> — it will be invalidated after first activation.</div>
    </div>
    <div class="cta">
      <a href="${activationUrl}" class="btn">&#10003;&nbsp; Create Password &amp; Activate Account</a>
      <p class="cta-hint">Button not working? Copy the link below into your browser.</p>
    </div>
    <div class="url-box"><strong>Activation URL:</strong><br/>${activationUrl}</div>
    <div class="divider"></div>
    <div class="sec"><p>&#128274; <strong>Security Notice:</strong> If you did not expect this account invitation, please disregard this email and contact your municipal administrator immediately. Never share your activation link. Jal Seva staff will never ask for your password.</p></div>
  </div>
  <div class="footer">
    <p class="brand">Jal Seva &mdash; Municipal Water &amp; Sanitation Management</p>
    <p>This is an automated message. Please do not reply to this email.</p>
    <p>&copy; ${year} Jal Seva. Ministry of Jal Shakti, Government of India.</p>
  </div>
</div>
</body>
</html>`;

  const transport = buildTransport();

  await transport.sendMail({
    from: config.SMTP_FROM,
    to,
    subject: "Welcome to Jal Seva \u2013 Activate Your Employee Account",
    html,
    text: [
      `Welcome to Jal Seva, ${firstName}!`,
      "",
      "An official employee account has been created for you.",
      "",
      `Employee Name: ${employeeName}`,
      `Employee ID:   ${employeeId}`,
      `Department:    ${departmentName}`,
      `Role:          ${roleName}`,
      "",
      "Activate your account (valid 24 hours, single-use):",
      activationUrl,
      "",
      "If you did not expect this, contact your administrator.",
    ].join("\n"),
  });
}
