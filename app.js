const express = require('express')

const app = express();
const userRoutes = require('./api/routes/user')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect('mongodb+srv://youssefwind99:windpassword@wind.td90i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('DB Connected!'))
   .catch(err => {
      console.log(`DB Connection Error: ${err.message}`);
   })

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', '*');
   if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', '*')
      return res.status(200).json({})
   }
   next()
})
mongoose.set('useCreateIndex', true)
app.use('/user', userRoutes)


app.use((req, res, next) => {
   const error = new Error('NOT FOUND')
   error.status = 404;
   next(error);
})

app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message
      }
   })
})



module.exports = app;