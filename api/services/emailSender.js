const nodemailer = require('nodemailer');

const sendMail = (receiverEmail, receiverName, recieverPassword, token) => {
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

Click the link below to verify your email:
http://localhost:3030/users/verify/${token}



HERE IS YOUR LOGIN INFO:
   email: ${receiverEmail}
   password: ${recieverPassword}

We are glad to have you with us !

Wind Consulting Team
      `
      ,
      html: `<h1>Welcome ${receiverName}</h1> <br/>
      
     <p>Click the link below to verify your email:</p> <br/>
<a href="http://localhost:3030/users/verify/${token}" target="_blank"> Verify your email</a>
     <br/>
     <h4> Wind Consulting Team </h4>
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

const sendMailMeeting = (receiverEmail, receiverName, recieverPassword, token) => {
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

Click the link below to verify your email:
http://localhost:3030/users/verify/${token}



HERE IS YOUR LOGIN INFO:
   email: ${receiverEmail}
   password: ${recieverPassword}

We are glad to have you with us !

Wind Consulting Team
      `
      ,
      html: `<h1>Welcome ${receiverName}</h1> <br/>
      
     <p>Click the link below to verify your email:</p> <br/>
<a href="http://localhost:3030/users/verify/${token}" target="_blank"> Verify your email</a>
     <br/>
     <h4> Wind Consulting Team </h4>
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