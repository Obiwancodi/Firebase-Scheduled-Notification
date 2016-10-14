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

let messageArray = [];
let regTokens;
const queryAndFormat = function() {
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

        messageArray.push(note);
        console.log("hello",messageArray)
      });
    
  });
};


const sender = new gcm.Sender('AIzaSyAzuutimSryG3GRkDWRJqArRr2NJbbY-M0');
const job = new CronJob('*/10 * * * * *', function() {
	    queryAndFormat();
      messageArray.forEach(message => {
           console.log(message)
        let note = JSON.stringify(message.params.notification);
           
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
  res.status(500)
});


module.exports =  {
  app: app,
  queryAndFormat: queryAndFormat
};
