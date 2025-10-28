require('dotenv').config()
const nodemailer = require('nodemailer');


const sendOTPEmail = async (email, otp) => {
      try {
            const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                        user: process.env.EMAIL_HOSTUSER,
                        pass: process.env.EMAIL_HOSTPASS,
                  },
            });
            const mailOptions = {
                  from: process.env.EMAIL_HOSTUSER,
                  to: email,
                  subject: 'OTP Verification',
                  text: `Your OTP: ${otp}`,
            };
            await transporter.sendMail(mailOptions);
            console.log('OTP email sent successfully!');
      } catch (error) {
            console.log(error.message);
      }
};

module.exports = { sendOTPEmail };