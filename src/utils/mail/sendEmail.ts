import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.MAIL_APP_PASSWORD,
    },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, subject: string, html: string) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"Sara7a Team" <${process.env.EMAIL}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
