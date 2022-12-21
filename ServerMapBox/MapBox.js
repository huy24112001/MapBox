// ket noi database
const monggoose =  require('mongoose');
const crypto = require('crypto');
var cors = require('cors')
var express = require('express');
var app = express().use(express.json()).use(express.urlencoded({extended: true})).use(cors());

      

const bodyParser = require('body-parser');
const CoordinateModel = require('./model/coordinate')


app.use(bodyParser.urlencoded({ extended: true }));
  //  app.use(bodyParser.json());
  app.use(bodyParser.text());
  // app.use(bodyParser.raw());

  
app.post('/publicKey', function (req, res) {
    // console.log(req.body)
  //  const isVerified = crypto.verify("SHA256", data, publicKey, signature);
   const pbkey = JSON.parse(req.body)
    // console.log(pbkey.username)
  CoordinateModel.find({username :pbkey.username}, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
      if(docs.length == 0) {
      res.status(200).send({"results": 'Account incorrect'})
      }
      else{

        CoordinateModel.updateOne({username :pbkey.username},{keyPublic : pbkey.publicKey}, function (err, docs) {
          if (err)
              console.log(err);
        })

        if(docs[0].isPublicKey)
            res.status(200).send({"results": 'Account have register biometrics'})
        else
            res.status(200).send({"results": 'Account have not register biometrics'})

      }
    }
      })
       
     }, (err) => {
         console.log(err);
     });


app.post('/biometrics', function (req, res) {

  // openssl("openssl genrsa -out rsa_1024_priv.pem 1024")
  // openssl("openssl rsa -in rsa_1024_priv.pem -out rsa_1024_pub.pem -outform PEM -pubout")
      // console.log(req.body)
      const biome = JSON.parse(req.body)
       console.log(biome);
      var   pbKey;
      var isVerified = false;


      CoordinateModel.find({username : biome.username}, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
          if( docs.length !== 0){
          pbKey =  docs[0].keyPublic
  
          try{

          const verify = crypto.createVerify('RSA-SHA256');

          var l1 = "-----BEGIN PUBLIC KEY-----\n";
          var l3 = "\n-----END PUBLIC KEY-----";
    
          pbKey = l1+ pbKey +l3;
            
       // sign= "gzj2UIZ/VUpczXA/nWPUSvhRsqfjLm7lp8BvNis39yFOCdIh0uJ1M9k4KEqMpkUYEJ1uGDIOtEf2MC1qlabjHESaVINvZnYAfZ4PsbU5/9D+R2eqjQ80IIVYUYJmL5rUMejUh8fgE/q6HhNGuxJ52DVV4hWOo1Wy8uwmCT9EIvAPAkowmnY4qwLv2RVsteVH1dL1l6NJWQdKfqEbHblXInKYdResV2Nq4MHT5ZbmHgCo7IO/IX+RKfOkwG3rLMm02DdAfmpqZpiGtIz5XI5S3UvC9nYlcWkNGXE1Tn6ULPUQr6QyznIAq6KWELTqnvRK+EJrXNrfNq3/Qq7pBoSffg=="
          verify.update(biome.payload);
          isVerified = verify.verify( pbKey, biome.signature ,'base64')
          // console.log(isVerified);//true

          if(isVerified)
              res.status(200).send({"results": 'Verify Successfully'})
          else
              res.status(200).send({"results": 'Verify Failed'})
    
    }
    catch(e){
      console.log(e)
    }
 }   
 }
      })
     
    }, (err) => {
      console.log(err);
       });



app.post('/map', function (req, res) {
    var data = [];
  //  console.log(req.body)
   var user = JSON.parse(req.body);
    // console.log(user.username)
  //  var coordinate1 = JSON.parse("[" + coord.coordinate + "]");
  
    
      CoordinateModel.updateOne( {username: user.username, password : user.password} , {coordinate: user.coordinate } , { upsert: false } ,
      function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Updated Coordinate Successfully !! ");
        }
    })
      


    CoordinateModel.find({}, function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
      //  console.log(docs)
         for(let i = 0;i< docs.length;i++){
          // console.log("First function call : ", docs[i].coordinate);
           if(docs[i].username != user.username)
           data = data.concat([{ fullname: docs[i].fullname, coordinate: docs[i].coordinate}]);
         }
        //  console.log(data)
         res.status(200).send({"results": data})
        //  console.log(data)
      }
  });


   
  }, (err) => {
      console.log(err);
  });



  app.post('/login', function (req, res) {
   
    console.log(req.body)
   var user = JSON.parse(req.body);
  //  console.log(coord)
  //  var coordinate1 = JSON.parse("[" + coord.coordinate + "]");

  // console.log(user.username + user.password)
    CoordinateModel.find({username : user.username , password : user.password}, function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
        //  console.log(docs[0].fullname)
        if(docs.length == 0)
        res.status(200).send({"results" : "Account not exist"})
        else 
         res.status(200).send({"results": "Login Successfully","user" : docs[0]})
      }
  });
   
  }, (err) => {
      console.log(err);
  });


  
  app.post('/register', function (req, res) {
   
    //  console.log(req.body)
     var user = JSON.parse(req.body);

    //  console.log(user)
     CoordinateModel.findOne({username : user.username} , function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
          //  console.log(docs)
          if(docs == null){
            let coor = new CoordinateModel({fullname: user.name,username: user.username, password:user.password, coordinate:[] })
            coor.save()
            res.status(200).send({"results": "Register Successfully"})
            }
          else
          res.status(200).send({"results" : "Account already exist"})

          }    
    });
     
    }, (err) => {
        console.log(err);
    });
  


    // Connect to the db
monggoose.connect("mongodb://127.0.0.1:27017/MapBox", {} )
.then(results => console.log("Connect to database "))
     .catch(err => console.log(err))

app.get('/huy', function(req,res){
  res.send('heelo123')
})
 
const port = 3006

app.listen(port, function () {
  console.log('Example app listening on port 3006!');
});



