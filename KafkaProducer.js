var Promise = require('bluebird');
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client(),
    producer = new Producer(client);

producer.on('ready', function() {
    console.log('producer is runnign ')

});

producer.on('error', function(err) {
    console.log('error in producer ' + err);

});

//need to parse user id for the partitioning 
function send_to_kafka(data) {

    return new Promise(function(resolve, reject) {
        var km = new KeyedMessage('key', 'message');
        console.log('data: '+JSON.stringify([data,km]))
        payloads = [
            { topic: 'textmessages', messages: [data, km] }
        ];
        producer.send(payloads, function(err, data) {
            console.log(data);
            resolve(data);
        });

    })
}

module.exports = {
    send_to_kafka: send_to_kafka
}


