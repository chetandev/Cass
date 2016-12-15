var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(
        client, [
            { topic: 'textmessages' }
        ]
    );


consumer.on('message', function (message) {
    console.log('msg arrived '+ JSON.stringify(message));
});



consumer.on('error', function (err) {
    console.log('error occured in kafka consumer '+ err);
});