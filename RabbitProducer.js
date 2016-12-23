var Promise = require('bluebird');
var amqp = require('amqplib/callback_api');
var channel;
var q = 'textmessages';
var ex = 'textmessagesexchange';
var key = 'textmessagekey';

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        channel = ch;
        channel.assertExchange(ex, 'direct', { durable: true });
        channel.assertQueue(q, { durable: true });
        channel.bindQueue(q, ex, key);
    });
});


function send_to_rabbitmq(data) {

    return new Promise(function(resolve, reject) {
        console.log(JSON.stringify(data));
        channel.publish(ex, key, new Buffer(JSON.stringify(data)));
        resolve('message published');
        console.log(" [x] Sent 'Hello World!'");
    })
}

module.exports = {
    send_to_rabbitmq: send_to_rabbitmq

}