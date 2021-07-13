const nodemailer = require('nodemailer');
const moment = require('moment');

var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
   }
});
const sendMail = (receiverEmail, receiverName, recieverPassword, token) => {


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

const sendMailMeeting = (receiverEmail, receiverName, meetingInfo) => {

   var mailOptions = {
      from: process.env.EMAIL,
      to: receiverEmail,
      subject: 'Meeting invitation',
      text: `Dear ${receiverName}

You are invited to join a meeting on ${meetingInfo.date}

Click the link to join 
https://safe-woodland-14290.herokuapp.com/a0fc7cba-1ef8-446b-808d-52ee27e33af2`
      ,
      html: `<h1>Meeting Invitation</h1> <br/>
      <h2>Dear ${receiverName}</h2><br/>
      <p>You are invited to join a meeting on <b>${moment(meetingInfo.date).format('MMMM Do YYYY, HH:mm')}</b></p><br/>
     <p>Click the link below to join the meeting:</p> <br/>
<a href="https://safe-woodland-14290.herokuapp.com/a0fc7cba-1ef8-446b-808d-52ee27e33af2
" target="_blank"> Join Meeting</a>
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


module.exports = {sendMail, sendMailMeeting};