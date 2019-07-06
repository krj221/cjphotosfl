// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';

// const message, nonce, path, privateKey; // ...
// const hashDigest = sha256(nonce + message);
// const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));

const sendEmail = require('send-email');
var jwt = require("jsonwebtoken");
var fs = require("fs");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
// console.log(SHA256("Message"));

// var RSA_PRIVATE_KEY = 'mfdiosu9302idoe90w7rfdyhcuijskh78etwuidhsyf7d';
var privateKEY = fs.readFileSync('./private.key', 'utf8');
var publicKEY = fs.readFileSync('./public.key', 'utf8');

var CryptoJS = require("crypto-js");
// console.log(CryptoJS.HmacSHA1("Message", "Key"));

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

// connect to mongodb database
mongoose.connect(process.env.MONGODB_CONFIG, { useNewUrlParser: true })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to database');
});

const Appointment = mongoose.model('Appointment', {
    id: String,
    first: String,
    last: String,
    email: String,
    phone: Number,
    date: Number,
    time: Number,
    specialId: String
  }
);

const User = mongoose.model('User', {
    id: String,
    email: String,
    username: String,
    password: String,
    admin: Boolean
  }
);

const TokenDetails = mongoose.model('TokenDetails', {
    id: String,
    token: String
  }
);

const Special = mongoose.model('Special', {
    id: String,
    name: String,
    photoDir: String,
    description: String,
    dates: [{value: Number,
            times: [{value: Number,
                    isBooked: Boolean}]
            }]
  }
);



/* GET api listing. */
router.get('/', (req, res) => {
  console.log("Request is :\'" + req + "\'");
  res.send('api works');
});

// Get all Appointments
router.get('/appointments', (req, res) => {
  // console.log('Title: ' + req.query.title);

  Appointment.find(req.query, function(err, appointments) {
    if (err)
    {
      res.status(500).send(err);
    }
    else
    {
      // object of all the users
      // console.log('Query: ' + req.query.toString());
      console.log(appointments);
      res.status(200).json(appointments);
    }
  }).sort( { date: 1, time: 1 } );
});

// Get authorization
router.post('/auth', (req, res) => {
  // console.log('Title: ' + req.query.title);
  var tokenDetails = new TokenDetails(req.body);

  // var i  = tokenDetails.issuer;          // Issuer
  // var s  = tokenDetails.subject;        // Subject
  // var a  = tokenDetails.audience;        // Subject
  var token = tokenDetails.token;
  // console.log("Auth issuer: " + i);
  // console.log("Auth subject: " + s);
  // console.log("Auth audience: " + a);
  console.log("Auth token: " + token);

  var legit = isAuthorized(token);

  var authorized = legit != null ? true : false;

  res.status(200).json(legit);

});

// Get all Appointments
// router.get('/authorize', (req, res) => {
//   // console.log('Title: ' + req.query.title);
//   var encryptUserPass = Window.bota('kyle:password');
//   console.log('Encrypted base64: ' + encryptUserPass);
//   var decryptUserPass = Window.atob(req.query.userpass);
//   console.log('Decrypted base64: ' + decryptUserPass);
//   if (decryptUserPass == 'kyle:password')
//   {
//     console.log("User Authorized!");
//     res.status(200).json({response:"User Authorized!"});
//   }
//   else
//   {
//     res.status(401).json({response:"User Unauthorized"});
//   }
// });

// Get all specials
router.get('/specials', (req, res) => {
  // console.log('Title: ' + req.query.title);

  Special.find(req.query, function(err, specials) {
    if (err)
    {
      res.status(500).send(err);
    }
    else
    {
      // object of all the users
      // console.log('Query: ' + req.query.toString());
      console.log(specials);
      res.status(200).json(specials);
    }
  });
});
// Get all users
router.get('/users', (req, res) => {

  // var i  = 'cjphotos';          // Issuer
  // var s  = req.body.email;        // Subject
  // var a  = req.body.username;        // Subject
  // var token = req.body.token;
  //
  // var legit = isAuthorized(i, s, a, token);
  //
  // var authorized = legit != null ? true : false;
  //
  // User.find(req.query, function(err, users) {
  //   if (err)
  //   {
  //   }
  //   else
  //   {
  //
  //     if (authorized)
  //     {
  //       console.log("\nJWT verification result: " + JSON.stringify(legit));
  //       console.log(users);
  //       res.status(200).json(users);
  //     }
  //     else {
  //       res.sendStatus(401);
  //     }
  //   }
  // });


  User.find(req.query, function(err, users) {
    if (err)
    {
      console.log(err);
      res.status(500).json(err);
    }
    else
    {
      console.log(users);
      res.status(200).json(users);
    }
  });

});

// Get an Appointments
router.get('/appointments/:appointmentId', (req, res) => {
  // console.log('Title: ' + req.query.title);

  Appointment.findById(req.params.appointmentId, function(err, appointments) {
    if (err)
    {
      res.status(500).send(err);
    }
    else
    {
      // object of all the users
      // console.log('Query: ' + req.query.toString());
      console.log(appointments);
      res.status(200).json(appointments);
    }

  });
});

// Get an Specials
router.get('/specials/:specialId', (req, res) => {
  // console.log('Title: ' + req.query.title);

  Special.findById(req.params.specialId, function(err, specials) {
    if (err)
    {
      res.status(500).send(err);
    }
    else
    {
      // object of all the users
      // console.log('Query: ' + req.query.toString());
      console.log(specials);
      res.status(200).json(specials);
    }

  });
});

// create Appointment
router.post('/appointments', (req, res) => {

  var date = req.body.date;
  var time = req.body.time;

  Appointment.find({ "date": { $eq: date }, "time": { $eq: time }, }, function(err, appointments) {
    if (err)
    {
      res.status(500).send(err);
    }
    else
    {
      // object of all the users
      // console.log('Query: ' + req.query.toString());
      console.log(appointments);
      if (appointments != null && appointments.length > 0)
      {
        console.log('Appointment found already, could not create appointment');
        res.status(200).json({response:"booked"});
      }
      else
      {
        var newAppt = new Appointment(req.body);
        // save the user
        newAppt.save(function(err) {
          if (err)
          {
            res.status(500).send(err);
          }
          else
          {
            console.log('Appointment created!');
            console.log(newAppt);
            res.status(200).json({response:"created"});
          }
        });
      }
    }
  });

});

// create Special
router.post('/specials', (req, res) => {
  var newSpecial = new Special(req.body);

  var token = req.header('auth_token')
  console.log("Auth token: " + token);

  var legit = isAuthorized(token);

  var authorized = legit != null ? true : false;

  if (authorized)
  {
    // save the special
    newSpecial.save(function(err) {
      if (err)
      {
        res.status(500).send(err);
      }
      else
      {
        console.log('Special created!');
        console.log(newSpecial);
        res.status(200).json({response:"Special created!"});;
      }
    });
  }
  else
  {
    unauthResponse = "User Unauthorized - " + token;
    res.status(401).json({response:unauthResponse});
  }

});

// send email
router.post('/email', (req, res) => {
  var htmlMesg = req.body.fullName + " just confirmed a " + req.body.specialName + " Special on " + req.body.date + " at " + req.body.time
          + "<br /><br />Send an invoice to their email: " + req.body.email
          + "<br />Phone number: " + req.body.phone;
  if (req.body.errorMesg){
    htmlMesg = "<strong>"+ req.body.errorMesg +"</strong><br />" + htmlMesg;
  }
  let payload = {
    "to": "cjphotosfl@gmail.com",
    "subject": "Appointment Confirmation",
    // "text": "hello world!",
    "html": htmlMesg,
    "from": "Crystal Johnson Photography <cjohnson0992@gmail.com>"
  };

  try {
    sendEmail(payload)
    .then((res) => {
      console.log(res);
    });

  } catch (e) {
    res.status(500).json({response:"Email has not been verified yet: " + e});

  } finally {
    res.status(200).json({response:"email sent!"});
  }

  // sendEmail(payload, function(err) {
  //   if (err)
  //   {
  //     console.log("Error trying to get the user for validation");
  //     res.sendStatus(500);
  //   }
  //   else
  //   {
  //     console.log(res);
  //     res.status(200).json({response:"email sent!"});
  //   }
  // });
});
// Get all Appointments
router.post('/login', (req, res) => {
  var findUser = new User(req.body);
  const findEmail = findUser.email;
  const password = findUser.password;
  console.log("Login Email: " + findEmail);
  // console.log("Login Password: " + password);

  User.find({email: findEmail}, function(err, users) {
    if (err)
    {
      console.log("Error trying to get the user for validation");
      res.sendStatus(500);
    }
    else if (users.length > 0)
    {
      var decryptedBytes = CryptoJS.AES.decrypt(users[0].password, "My Secret Passphrase");
      // console.log("decryptedBytes: "+decryptedBytes);
      var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
      // console.log("plaintext: "+plaintext);

      if (password == plaintext)
      {
        // const userId = findUserIdForEmail(findEmail);
        const userId = users[0].username;

        // const jwtBearerToken = jwt.sign(payload, privateKEY, signOptions);
        var payload = {
        };

        // SIGNING OPTIONS
        var signOptions = {
         expiresIn:  "12h",
         algorithm:  "RS256"
        };

        // const jwtBearerToken = jwt.sign({foo:'bar'}, RSA_PRIVATE_KEY, {
        //   algorithm: 'RS256',
        //   expiresIn: 120,
        //   subject: userId
        // });
        // const jwtBearerToken = jwt.sign({ foo: 'bar' }, 'shhhhh');
        const jwtBearerToken = jwt.sign(payload, privateKEY, signOptions);

        console.log("User logged in");

        res.status(200).json({
          idToken: jwtBearerToken,
          expiresIn: 120
        });        // send the JWT back to the user
        // TODO - multiple options available
      }
      else{
        console.log("User Unauthorized");
        res.sendStatus(401);
      }
    }
    else {
      console.log("User does not exist");
      res.sendStatus(401);
    }
  });
});

// create user
router.post('/users', (req, res) => {
  var newUser = new User(req.body);
//   // Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
//
// // Decrypt
// var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
// var originalText = bytes.toString(CryptoJS.enc.Utf8);
  // console.log("password: "+req.body.password);
  var encryptedAES = CryptoJS.AES.encrypt(req.body.password, "My Secret Passphrase");
  // console.log("encryptedAES: "+encryptedAES);
  newUser.password = encryptedAES;
    var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, "My Secret Passphrase");
    // console.log("decryptedBytes: "+decryptedBytes);
    var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
    // console.log("plaintext: "+plaintext);
  // save the user
  newUser.save(function(err) {
    if (err)
    {
      res.status(500).send(err);
    }
    else
    {
      console.log('Admin created!');
      console.log(newUser);
      res.status(200).json({response:"User created!"});;
    }
  });
});

//  appointment
router.put('/appointments/:appointmentId', (req, res) => {
  console.log("Appointment id: " + req.params.appointmentId);

  var token = req.header('auth_token')
  console.log("Auth token: " + token);

  var legit = isAuthorized(token);

  var authorized = legit != null ? true : false;

  if (authorized)
  {
    Appointment.findByIdAndUpdate( req.params.appointmentId, req.body, function(err, appointment) {
      if (err)
      {
        res.status(500).send(err);
      }
      else
      {
        // we have the d user returned to us
        res.status(200).json({response:"Appointment d!"});;
      }
    });
  }
  else
  {
    unauthResponse = "User Unauthorized - " + token;
    res.status(401).json({response:unauthResponse});
  }

});

//  special
router.put('/specials/:specialId', (req, res) => {
  console.log("Special id: " + req.params.specialId);
  Special.findByIdAndUpdate( req.params.specialId, req.body, function(err, special) {
    if (err)
    {
      res.status(500).send(err);
    }
    else
    {
      // we have the d user returned to us
      res.status(200).json({response:"Special d!"});;
    }
  });
});
//  user
router.put('/users/:userId', (req, res) => {
  console.log("User id: " + req.params.userId);

  var token = req.header('auth_token')
  console.log("Auth token: " + token);

  var legit = isAuthorized(token);

  var authorized = legit != null ? true : false;

  if (authorized)
  {
    User.findByIdAndUpdate( req.params.userId, req.body, function(err, user) {
      if (err)
      {
        res.status(500).send(err);
      }
      else
      {
        // we have the d user returned to us
        res.status(200).json({response:"User d!"});;
      }
    });
  }
  else
  {
    unauthResponse = "User Unauthorized - " + token;
    res.status(401).json({response:unauthResponse});
  }

});

// Delete appointment
router.delete('/appointments/:appointmentId', (req, res) => {

  var token = req.header('auth_token')
  console.log("Auth token: " + token);

  var legit = isAuthorized(token);

  var authorized = legit != null ? true : false;

  if (authorized)
  {
    Appointment.findByIdAndDelete(req.params.appointmentId, function(err) {
      if (err)
      {
        res.status(500).send(err);
      }
      else
      {
        // we have deleted the user
        console.log('Appointment deleted!');
        res.status(200).json({response:"Appointment deleted!"});;
      }
    });
  }
  else
  {
    unauthResponse = "User Unauthorized - " + token;
    res.status(401).json({response:unauthResponse});
  }

});

// Delete special
router.delete('/specials/:specialId', (req, res) => {
  var token = req.header('auth_token')
  console.log("Auth token: " + token);

  var legit = isAuthorized(token);

  var authorized = legit != null ? true : false;

  if (authorized)
  {
    Special.findByIdAndDelete(req.params.specialId, function(err) {
      if (err)
      {
        res.status(500).send(err);
      }
      else
      {
        // we have deleted the user
        console.log('Special deleted!');
        res.status(200).json({response:"Special deleted!"});;
      }
    });
  }
  else
  {
    unauthResponse = "User Unauthorized - " + token;
    res.status(401).json({response:unauthResponse});
  }
});

// Delete User
router.delete('/users/:userId', (req, res) => {
  var token = req.header('auth_token')
  console.log("Auth token: " + token);

  var legit = isAuthorized(token);

  var authorized = legit != null ? true : false;

  if (authorized)
  {
    User.findByIdAndDelete(req.params.userId, function(err) {
      if (err)
      {
        res.status(500).send(err);
      }
      else
      {
        // we have deleted the user
        console.log('User deleted!');
        res.status(200).json({response:"User deleted!"});;
      }
    });
  }
  else
  {
    unauthResponse = "User Unauthorized - " + token;
    res.status(401).json({response:unauthResponse});
  }
});

module.exports = router;

function isAuthorized(token) {
  var legit = null;

  var verifyOptions = {
   expiresIn:  "12h",
   algorithm:  ["RS256"]
  };

  try{
    legit = jwt.verify(token, publicKEY, verifyOptions);
  } catch (e) {
    return null;
  }
  return legit;

}
