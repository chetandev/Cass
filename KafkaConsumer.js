var Promise = require('bluebird');
var cassBl = require(__base + '/cass.js');
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client('localhost:2181'),
    consumer = new Consumer(
        client, [
            { topic: 'textmessages' }
        ]
    );


consumer.on('message', function(message) {
    console.log('msg arrived ' + message.value);
    //put data in cassandra 
    cassBl.put_in_cass(JSON.parse(message.value))
        .then(function(result) {

            console.log(result);
        })
        .catch(function(err) {
            console.log('error occured while writing in cassandra:' + err)
        })
});



consumer.on('error', function(err) {
    console.log('error occured in kafka consumer ' + err);
});
