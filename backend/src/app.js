import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import fs from "fs";
import mailer from "nodemailer";
import {join} from "path";
import cors from "cors";
import {
  userRouter,
  videoRouter,
  searchRouter,
} from "./routes/index.routes.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use("/uploads", express.static(join("src", "uploads")));
app.use(userRouter);
app.use(videoRouter);
app.use(searchRouter);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const transport = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
 
app.post("/send", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email kiritilmadi" });
    }

    const verify_code = generateOTP();

    await transport.sendMail({
      from: `"Hacking Tutorials" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 SYSTEM VERIFICATION CODE",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0f14;font-family:Courier New, monospace;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0f172a;border-radius:12px;overflow:hidden;">
<tr>
<td style="padding:20px;text-align:center;background:#020617;color:#00ffae;">
<strong>⚠ SYSTEM ACCESS VERIFICATION</strong>
</td>
</tr>

<tr>
<td style="padding:20px;color:#00ffae;font-size:13px;">
<pre style="margin:0;">
Initializing secure connection...
Bypassing firewall...
Decrypting payload...
Access granted ✔
</pre>
</td>
</tr>

<tr>
<td align="center" style="padding:30px;background:#020617;">
<div style="
padding:16px 32px;
font-size:28px;
letter-spacing:6px;
color:#00ffae;
border:2px dashed #00ffae;
border-radius:8px;
">
${verify_code}
</div>
</td>
</tr>

<tr>
<td style="padding:24px;color:#cbd5e1;font-size:14px;text-align:center;">
Ushbu tasdiqlash kodi <b>5 daqiqa</b> amal qiladi.
</td>
</tr>

<tr>
<td style="padding:16px;text-align:center;font-size:12px;color:#64748b;background:#020617;">
© 2026 Domain Hackers • Automated Security Message
</td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>
      `,
    });

    let otps = fs.readFileSync(join(process.cwd(), "src", "databases", "otp.json"))
    otps = JSON.parse(otps)

    let newOtps = {
      email, 
      otp: verify_code,
      expire:new Date().getTime() + 120000 * 5
    }

    otps.push(newOtps)

    fs.writeFileSync(join(process.cwd(), "src", "databases", "otp.json"), JSON.stringify(otps, null, 4))


    res.status(200).json({
      message: "Tasdiqlash kodi yuborildi",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email yuborishda xatolik" });
  }
});

app.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = join("src", "uploads", filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).json({ message: "Error downloading file" });
    }
  });
});

app.use((err, req, res, next) => {
  if (err) {
    if (err.status > 500 || !err.status) {
      res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
      });
      fs.appendFileSync(
        join("src", "logs", "errors.log"),
        `[${new Date().toISOString()}] - [ERROR] - [${err.status || 500}] ${
          err.message
        }\n\t${err.stack}\n`
      );
    } else if (err.status <= 500) {
      res.status(err.status).json({
        status: err.status,
        message: err.message,
        name: err.name,
      });
    }
  }
});

app.listen(PORT, () => console.log(`Server is runned on ${PORT}`));
