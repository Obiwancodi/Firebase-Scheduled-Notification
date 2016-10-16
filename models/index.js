const Sequelize = require('sequelize');
const db = new Sequelize('YOUR_DATABASE_URI_HERE');
db.logging = false;

const Messages = db.define('messages', {
	token : {
		type : Sequelize.TEXT,
		allowNull: false
	},
	title : {
		type : Sequelize.STRING, 
		defaultValue:"Task Name"
	},

	content : {
		type: Sequelize.TEXT,
		defaultValue:"Task Content"
	},

	time : {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	icon : {
		type: Sequelize.BLOB,
		defaultValue: new Buffer((__dirname +"/images/ic_launcher.png").toString('base64'))
	},
	sent: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
}, {
	getterMethods : {
		changeFormat : function() {
				 const obj =  {
			      body : this.content,
			      title : this.title,
			      icon : this.icon
			    
			  	};
			return obj
		}	
	}
});

module.exports = {
    Messages: Messages,
    db: db
};