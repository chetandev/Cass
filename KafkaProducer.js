var Promise = require('bluebird');
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
   // HighLevelProducer = kafka.HighLevelProducer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client('172.24.36:2181,172.24.1.189:2181','nodeproducer'),
    producer = new Producer(client,{partitionerType: 2});
    //producerHighLevel = new HighLevelProducer(client);

producer.on('ready', function() {
    console.log('producer is runnign ')

});

producer.on('error', function(err) {
    console.log('error in producer ' + err);

});

//need to parse user id for the partitioning 
// function send_to_kafka_by_partition(data,partition) {

//     return new Promise(function(resolve, reject) {
//         console.log('data: '+JSON.stringify(data))
//         console.log('partition :'+partition);
//         payloads = [
//             { topic: 'textmessages', messages:JSON.stringify(data),partition:partition}
//         ];
//         producer.send(payloads, function(err, data) {
//             console.log(data);
//             resolve(data);
//         });

//     })
// }

function send_to_kafka(data) {

    return new Promise(function(resolve, reject) {
        //var km = new KeyedMessage('key', 'message');
        console.log('data: '+JSON.stringify(data))

        payloads = [
            { topic: 'textmessages', messages:JSON.stringify(data)}
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


