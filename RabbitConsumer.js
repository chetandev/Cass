var amqp = require('amqplib/callback_api');
var cassBl = require(__base + '/cass.js');

amqp.connect('amqp://172.24.1.189', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'textmessages';
        ch.assertQueue(q, { durable: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

        ch.consume(q, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());

            cassBl.put_in_cass(JSON.parse(msg.content.toString()).messages)
                .then(function(result) {
                    console.log(result);
                })
                .catch(function(err) {
                    console.log('error occured while writing in cassandra:' + err)
                })
            ch.ack(msg);
        }, { noAck: false });

    });
});