var express = require('express');
var router = express.Router();
var cassBl = require(__base + '/cass.js');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/cass/put/', function(req, res, next) {
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

router.get('/cass/read/', function(req, res, next) {
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



module.exports = router;
