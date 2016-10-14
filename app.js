const express = require('express');
const Sequelize = require('sequelize');
const CronJob = require('cron').CronJob;
const bodyParser = require('body-parser');
const bluebird = require('bluebird');
const routes = require('./routes');
const models = require('./models');
const Message = models.Messages;
const gcm = require('node-gcm');

const app = express();

const sender = new gcm.Sender('AIzaSyAzuutimSryG3GRkDWRJqArRr2NJbbY-M0');

let regTokens;

const queryAndReformat = function(array,regTokens) {
    Message.findAll({
      where : {
        time : {
          $lte: new Date()
        },
        sent:false
      }
    })
    .then(pendingMessages => {
      
      pendingMessages.forEach(message => {
          
          regTokens = [message.dataValues.token];
          message= message.changeFormat;
          let note = new gcm.Message({
            notification: {
              title: message.title,
              icon: message.icon,
              body: message.body
              }
          });
          console.log("this is a note")
          array.push(note);
          
      })
     return note
    })
}    

let messageArray = [];

const job = new CronJob('*/10 * * * * *', function() {
      
      messageArray =  queryAndReformat(messageArray,regTokens);
       console.log("IS THIS OUT OF SYNC",messageArray)
	     
      messageArray.forEach(message => {
        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if(err) console.error(err);
            else  console.log("Response",response);
        });
        messageArray = []
        Message.update ({
          sent:true,
          },
          {
            where: {
              time : {
                $lte: new Date()
              },
            }
          }
        )
      });
  		
  }, function () {
    
  },
  true 
  
);

models.db.sync({})
.then(function(){
  app.listen(3001, function() {
  });
});


app.use(bodyParser.json());
app.use('/', routes);

app.use(function(err, req, res, next) {
  res.status(404);
  res.status(500).send(err);
});


module.exports = {
  app: app,
  queryAndReformat : queryAndReformat
};