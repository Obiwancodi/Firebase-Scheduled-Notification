const express = require('express');
const Sequelize = require('sequelize');
const CronJob = require('cron').CronJob;
const bodyParser = require('body-parser');
const bluebird = require('bluebird');
const routes = require('./routes');
const models = require('./models');
const Message = models.Messages;
const gcm = require('node-gcm');
const meessageFnc = require('./messageFunctions')
const queryAndFormat = meessageFnc.queryAndFormat

const app = express();

const sender = new gcm.Sender('AIzaSyAzuutimSryG3GRkDWRJqArRr2NJbbY-M0');
const job = new CronJob('*/10 * * * * *', function() {
	    queryAndFormat()
      .then(messageArray => {
          messageArray.forEach(messageInfo => {
            sender.send(messageInfo['note'], { registrationTokens: messageInfo['regTokens'] }, function (err, response) {
                if(err) console.error(err);
                else  console.log("Response",response);  
        
            });
        
          });
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
        );
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
};
