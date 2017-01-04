var Promise = require('bluebird');
var amqp = require('amqplib/callback_api');
var Promise = require('bluebird');
var channel;
var q = 'textmessages';
var ex = 'textmessagesexchange';
var key = 'textmessagekey';

amqp.connect('amqp://test:test@172.24.1.36', function(err, conn) {
    if (err) { console.log(err) }
    conn.createChannel(function(err, ch) {
        if (err) console.log(err);
        channel = ch;
        channel.assertExchange(ex, 'direct', { durable: true });
        channel.assertQueue(q, { durable: true });
        channel.bindQueue(q, ex, key);
    });
});


function send_to_rabbitmq(data) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            channel.publish(ex, key, Buffer.concat(data));
        }, 0)
        resolve('message published');

    });

}

module.exports = {
    send_to_rabbitmq: send_to_rabbitmq
}