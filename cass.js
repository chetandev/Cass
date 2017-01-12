var cassandra = require('cassandra-driver');
const distance = cassandra.types.distance;
var Promise = require('bluebird');



var client = new cassandra.Client({
    contactPoints: ['localhost'],
    keyspace: 'messagemicroservice',
    pooling: {
        coreConnectionsPerHost: {
            [distance.local]: 1,
            [distance.remote]: 1
        }
    }
});
const query = 'INSERT INTO textmessages (id,userid,address,msgbody,msgdate,msgid,msgtype) VALUES (?,?,?,?,?,?,?)';

function put_in_cass(obj) {

    return new Promise(function(resolve, reject) {
        var _queries = [];
        var _responseCodes = [];
        Promise.each(obj, function(validData) {
                var uuid = cassandra.types.Uuid.random();
                var params = [uuid, '1234', validData.name, validData.msg, validData.dateTime, validData.dvcMsgId, validData.msgType]
                _queries.push({ query: query, params: params })
                _responseCodes.push({
                    "dvcMsgId": validData.dvcMsgId,
                    "serMsgId": uuid
                })
            })
            .then(function(result) {
                client.batch(_queries, { prepare: true }, function(err, result) {
                    if (err) {
                        reject({ "errors": ["error while pushing in cassandra"], "status": 500, "messages": _responseCodes }); //internal server error 500
                    } else {

                        resolve({ "errors": [], "messages": _responseCodes });
                    }
                });
            }).catch(function(err) {
                reject({ "errors": [err.message], "status": 400, "messages": _responseCodes }); //bad request 400
            })
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

function get_total_count() {
    var count = 0;
    return new Promise(function(resolve, reject) {
        client.stream('SELECT * from textmessages')
            .on('readable', function() {
                // 'readable' is emitted as soon a row is received and parsed
                while (row = this.read()) {
                    count++;
                }
            })
            .on('end', function() {
                resolve(count);
            })
            .on('error', function(err) {
                reject(err);
            });
    })
}

module.exports = {
    put_in_cass: put_in_cass,
    get_from_cass: get_from_cass,
    get_total_count: get_total_count
}