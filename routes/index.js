var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var cassBl = require(__base + '/cass.js');
var kafkaBl = require(__base + '/KafkaProducer.js');
var validationBl = require(__base + '/BL/validations.js');
//var rabbitBl = require(__base + '/RabbitProducer.js');
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.post('/cass/put/',
    validationBl.validateHeaders,
    function(req, res) {
        var data = [];
        req.on('data', function(chunk) { data.push(chunk) })
        req.on('end', function() {
            var obj = JSON.parse(data.join('')).messages;
            validationBl.bodyValidation(obj)
                .then(function(data) {
                    cassBl.put_in_cass(data.valid)
                        .then(function(result) {
                            if (data.partial) {
                                var obj = { "status": 2, "errors": result.errors, "success": result.messages, "failed": data.inValid }
                                res.status(202).send(obj);
                            } else {
                                var obj = { "status": 1, "errors": result.errors, "success": result.messages, "failed": data.inValid }
                                res.status(200).send(obj);
                            }
                        })
                        .catch(function(err) {
                            if (err.status == 500) {
                                var obj = { "status": 0, "errors": err.errors, "success": err.messages, "failed": data.inValid }
                                res.status(500).send(obj);
                            }
                            if (err.status == 400) {
                                var obj = { "status": 0, "errors": err.errors, "success": err.messages, "failed": data.inValid }
                                res.status(400).send(obj);
                            }
                        })
                })
        })
    });

router.get('/cass/count', function(req, res) {
    cassBl.get_total_count()
        .then(function(result) {
            res.json(result);

        })
        .catch(function(err) {

            res.status(400).send(err);

        })
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