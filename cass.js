var cassandra = require('cassandra-driver');
const distance = cassandra.types.distance;
var Promise = require('bluebird');
var async = require('async');

var client = new cassandra.Client({
    contactPoints: ['172.24.1.64', '172.24.1.187'],
    keyspace: 'messagemicroservice',
    pooling: {
        coreConnectionsPerHost: {
            [distance.local]: 1,
            [distance.remote]: 1
        }
    }
});
const query = 'INSERT INTO textmessages (id,userid,address,msgbody,msgdate,msgid,msgtype) VALUES (?,?,?,?,?,?,?)';

function put_in_cass(data) {

    return new Promise(function(resolve, reject) {

        //setImmediate(function() {
        var queries = [];
        var obj = JSON.parse(data.join('')).messages;
        //var length = obj.length;
        // for (var i = 0; i < length; i++) { //loop to be improved later

        //     var params = [cassandra.types.Uuid.random(), '1234', obj[i].address, obj[i].body, obj[i].date, obj[i]._id, obj[i].type]
        //     queries.push({ query: query, params: params })
        // }

        // async.each(obj, function(item, callback) {
        //     var params = [cassandra.types.Uuid.random(), '1234', item.address, item.body, item.date, item._id, item.type]
        //     queries.push({ query: query, params: params })
        //     callback();
        // }, function(err) {
        //     client.batch(queries, { prepare: true }, function(err, result) {
        //         if (err) {
        //             console.log('error occured');
        //             reject(err);
        //         }
        //         resolve(result);
        //     });
        // });

        Promise.each(obj, function(item) {
                var params = [cassandra.types.Uuid.random(), '1234', item.address, item.body, item.date, item._id, item.type]
                queries.push({ query: query, params: params })
                    //return queries;
            })
            .then(function() {
                client.batch(queries, { prepare: true }, function(err, result) {
                    if (err) {
                        console.log('error occured');
                        reject(err);
                    }
                    resolve(result);
                });
            });

        // });
    })
}

function get_from_cass() {
    return new Promise(function(resolve, reject) {
        client.execute("SELECT * from textmessages", function(err, result) {
            if (!err) {
                if (result.rows.length > 0) {
                    var user = result.rows[0];
                    console.log(result);
                    resolve(result);
                } else {
                    console.log("No results");
                    reject(err)
                }
            }

        })
    })
}

module.exports = {
    put_in_cass: put_in_cass,
    get_from_cass: get_from_cass
}