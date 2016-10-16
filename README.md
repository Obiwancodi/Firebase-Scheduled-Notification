# Firebase-Scheduled-Notification SDK Add On For Android 
 
As of today, Firebase does not provide scheduled notifications for Android via its SDK. This project seeks to solve that problem.

**Installation** 

Git clone https://github.com/Obiwancodi/Firebase-Scheduled-Notification.git

npm install --save

npm start

**Running Tests**

npm test

**How it works**

The Android device token, title of the notification, the notification body, and the time the notification is to be received by the user is sent to the server from the Android device in JSON format.  I used an Android async http library to send the JSON data to the server. 

http://loopj.com/android-async-http/

The server receives the JSON data and stores the data in a Sequelize database.  Every ten seconds the database is queried and gathers the unsent messages whose scheduled time has been reached. The messages are formatted into FCM format and sent to the correct Android device.  Firebase Messaging Service class on the Android device processes the notification information and sends the notification to the device.

https://github.com/firebase/quickstart-android/blob/master/messaging/app/src/main/java/com/google/firebase/quickstart/fcm/MyFirebaseMessagingService.java

**Technologies Used and Why**

Node-gcm https://www.npmjs.com/package/node-gcm

> Allowed ease of use for FCM

Node, Sequelize and Express Stack

> Excellent for handling async tasks (I did not want to use blocking tasks because that might prevent messages from being delivered on time).

Cron https://www.npmjs.com/package/cron

 > Used cron as a reliable way to schedule database queries 

Mocha and Chai

 > Used for async testing 

This project is open source and I look forward to future collaboration.

