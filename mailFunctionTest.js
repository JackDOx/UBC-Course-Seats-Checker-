const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// transporter options
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// mail options
let mailOptions = {
  from: '"Jack Do" <jackydo1973@gmail.com>', // sender address
  to: 'jackydo1974@gmail.com', // list of receivers
  subject: 'Seats remaining in course Math 100 Summer session 2023', // Subject line
  text: 'There is 1 or more seats remaining in this course. Come check it out!', // plain text body
  html: '<b>Come check it bro</b>' // html body
};


transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});

module.exports = transporter;