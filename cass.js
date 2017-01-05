var cassandra = require('cassandra-driver');
var Promise = require('bluebird');
var client = new cassandra.Client({ contactPoints: ['172.24.1.64', '172.24.1.187'], keyspace: 'messagemicroservice' });
const query = 'INSERT INTO textmessages (id,userid,address,msgbody,msgdate,msgid,msgtype) VALUES (?,?,?,?,?,?,?)';

function put_in_cass(data) {

    return new Promise(function(resolve, reject) {
        var queries = [];
        var obj = JSON.parse(data.join('')).messages;
        for (var i = 0; i < obj.length; i++) { //loop to be improved later

            var params = [cassandra.types.Uuid.random(), '1234', obj[i].address, obj[i].body, obj[i].date, obj[i]._id, obj[i].type]
            queries.push({ query: query, params: params })
                // client.execute(query, params, { prepare: true }, function(err, result) {
                //     if (err)
                //         reject(err);
                //     else
                //         resolve(result);
                // });
        }
        client.batch(queries, { prepare: true }, function(err) {
            if (err) console.log('error occured');
            console.log('Data updated on cluster');
        });
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