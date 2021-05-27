const nodemailer = require('nodemailer');

const sendMail = (receiverEmail, receiverName, recieverPassword) => {
   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.EMAIL,
         pass: process.env.EMAIL_PASSWORD
      }
   });

   var mailOptions = {
      from: process.env.EMAIL,
      to: receiverEmail,
      subject: 'Welcome to Wind Project Management',
      text: `Dear ${receiverName}

You have joined Wind Project Management
HERE IS YOUR LOGIN INFO:
   email: ${receiverEmail}
   password: ${recieverPassword}

We are glad to have you with us !

Wind Consulting Team
      `
   };
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
         console.log(error);
      } else {
         console.log('Email sent SUCCESSFULLY ');
      }
   });
}


module.exports = sendMail;