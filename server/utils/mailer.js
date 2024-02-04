require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text
        });

        console.log("Email sent successfully");
        return { success: true };
    } catch (error) {
        console.log(error, "Email not sent");
        return { success: false, error: error.message };
    }
}

module.exports = sendEmail;
