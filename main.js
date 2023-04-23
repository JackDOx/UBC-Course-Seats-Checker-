const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const gettingSeats = require('./app');
// const { sendMail } = require('./mailing');

dotenv.config({ path: './config.env' });

const options = {
  hostname: process.env.HOST_NAME,
  path: process.env.HOST_PATH,
  method: 'GET'
};

function courseChecker() {
  // sending https request to courses.students.ubc.ca
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    // write it in a html fild
    const file = fs.createWriteStream('response.html');
    res.pipe(file);

    console.log('Seats remaining in this course: ' + gettingSeats());
    if ( gettingSeats() >= 1) {
      // transporter options
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
      });
  
      // mail content
      let mailOptions = {
        from: '"Jack Đỗ" <jamiehuynh2022@gmail.com>', // sender address
        to: process.env.YOUR_EMAIL, // list of receivers
        subject: 'Seats remaining for this course', // Subject line
        text: 'There is 1 or more seats remaining in this course. Come check it out!', // plain text body
        html: '<b>Come check it bro</b>' // html body
      };
      // sendmail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });
    };

  });

  req.on('error', error => {
    console.error(error);
  });

  req.end();


};

setInterval(courseChecker, 25*60*1000); // run every 25 mins
//courseChecker();