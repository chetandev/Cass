var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var cassBl = require(__base + '/cass.js');
var kafkaBl = require(__base + '/KafkaProducer.js');
var rabbitBl = require(__base + '/RabbitProducer.js');
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


router.post('/rabbit/send/', function(req, res) {
    var data = [];
    req.on('data', function(chunk) { data.push(chunk); })
    req.on('end', function() {
        rabbitBl.send_to_rabbitmq(data)
            .then(function(result) {
                res.send(result);
            })
            .catch(function(err) {
                console.log(err)
                res.status(400).send(err);
            })
    })

});



module.exports = router;