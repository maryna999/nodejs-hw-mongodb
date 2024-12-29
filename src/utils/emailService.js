import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: env('SMTP_PORT'),
  secure: false,
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = (to, subject, htmlContent) => {
const mailOptions = {
  from: env('SMTP_FROM'),
  to,
  subject,
  html: htmlContent,
};

  return transporter.sendMail(mailOptions);
};
