var express = require('express');
var router = express.Router();
var cassBl = require(__base + '/cass.js');
var kafkaBl = require(__base + '/KafkaProducer.js');
var consumer = require(__base + '/KafkaConsumer.js');
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/cass/put/', function(req, res) {
    return new Promise(function(resolve, reject) {
        cassBl.put_in_cass()
            .then(function(result) {
                console.log(result);
                res.json("items added successfully ");
            })
            .catch(function(err) {

                console.log(err);
                res.status(400).send(err);
            })
    });
});

router.get('/cass/read/', function(req, res) {
    return new Promise(function(resolve, reject) {
        cassBl.get_from_cass()
            .then(function(result) {
                res.json(result);
            })
            .catch(function(err) {

                res.status(400).send(err);
            })
    });
});


// router.post('/kafka/send/part/:part', function(req, res) {
    
//     return new Promise(function(resolve, reject) {
//         var partition = req.params.part;
//         //console.log(req.body)
//         kafkaBl.send_to_kafka_by_partition(req.body,partition)
//             .then(function(result) {
//                 res.json(result);
//             })
//             .catch(function(err) {
//                 console.log(err)
//                 res.status(400).send(err);
//             })
//     });
// });


router.post('/kafka/send/', function(req, res) {
    
    return new Promise(function(resolve, reject) {
        //console.log(req.body)
        kafkaBl.send_to_kafka(req.body)
            .then(function(result) {
                res.json(result);
            })
            .catch(function(err) {
                console.log(err)
                res.status(400).send(err);
            })
    });
});


module.exports = router;
