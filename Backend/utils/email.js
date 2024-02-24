const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // For TLS support
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    console.log(process.env.EMAIL_HOST, process.env.EMAIL_PORT, process.env.EMAIL_HOST, process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);
    // 2) Define the email options
    const mailOptions = {
        // from: 'INSTITUTEHUB <contact@institutehub.com>',
        from: 'support@ssccglpinnacle.com',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: '<p> Here will be your HTML CODE in mailoptions</p>'
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;