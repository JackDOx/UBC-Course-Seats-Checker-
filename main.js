const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const gettingSeats = require('./app');
// const { sendMail } = require('./mailing');

dotenv.config({ path: './config.env' });

var mailSent = false;

const options = {
  hostname: process.env.HOST_DOMAIN,
  path: process.env.HOST_PATH,
  method: 'GET'
};

function courseChecker() {
  // If the mail has bent sent, exit program immediately
  if (mailSent) {
    process.exit(0);
  };

  const url = process.env.HOST_DOMAIN + process.env.HOST_PATH;
  let seats = 0;

  // sending https request to courses.students.ubc.ca
  const req = https.request(options, res => {
    console.log(`StatusCode: ${res.statusCode}`);

    // write it in a html fild
    const file = fs.createWriteStream('response.html');
    res.pipe(file);

    // Extracting the dept value
    const deptMatch = url.match(/dept=([^&]+)/);
    const dept = deptMatch ? deptMatch[1] : null;

    // Extracting the course value
    const sectionMatch = url.match(/course=([^&]+)/);
    const section = sectionMatch ? sectionMatch[1] : null;

    const course = dept + ' '  + section;
    // On event finish of writeStream, gettingSeats() will be called
    file.on('finish', () => {
      seats = gettingSeats();
      console.log(`Seats remaining in the course ${course}: ${seats} \nChecked at ${Date(Date.now()).toString()} \n`);
    });

    if ( seats >= 1) {
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
        subject: `Seats remaining for the course ${course}`, // Subject line
        text: `There is 1 or more seats remaining in the course ${course}. Come check it out!`, // plain text body
        html: `<b>Come check it bro! Link: https://${url}</b>` // html body
      };
      // sendmail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        mailSent = true;
      });
    };

  });

  req.on('error', error => {
    console.error(error);
  });

  req.end();


};

courseChecker() // run the code initially

setInterval(courseChecker, 12*60*1000);
 // run every 20 mins
// courseChecker();
