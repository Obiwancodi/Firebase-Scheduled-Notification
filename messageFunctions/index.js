const Sequelize = require('sequelize');
const bluebird = require('bluebird');
const models = require('../models');
const gcm = require('node-gcm');
const Message = models.Messages;

const queryAndFormat = function() {
    let messageInfo = {}
    return  Message.findAll({
        where : {
          time : {
            $lte: new Date()
          },
          sent:false
        }
      })
    .then(pendingMessages => {
      
        let array = pendingMessages.map(message => {
        
            messageInfo['regTokens'] = [message.dataValues.token];
            message = message.changeFormat;
            messageInfo['note'] = new gcm.Message({
                notification: {
                title: message.title,
                icon: message.icon,
                body: message.body
                }
            });
            return messageInfo
        });
        return array  
    }); 
};

const updateSentMessages = function() {
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
};

module.exports ={
  queryAndFormat : queryAndFormat,
  updateSentMessages : updateSentMessages 
}; 