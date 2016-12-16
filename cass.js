var cassandra = require('cassandra-driver');
var Promise = require('bluebird');
var client = new cassandra.Client({ contactPoints: ['172.24.1.64','172.24.1.187'], keyspace: 'messagemicroservice' });

function put_in_cass(data) {

    return new Promise(function(resolve, reject) {

        const query = 'INSERT INTO textmessages (id,userid,address,msgbody,msgdate,msgid,msgtype) VALUES (?,?,?,?,?,?,?)';
        for (var i = 0; i < data.length; i++) { //loop to be improved later

            var params = [cassandra.types.Uuid.random(),'1234', data[i].address, data[i].body, data[i].date, data[i]._id, data[i].type]
            client.execute(query, params, { prepare: true }, function(err, result) {
                if (err)
                    reject(err);
                else
                    resolve(result);

            });
        }

    })

}



function get_from_cass() {
    return new Promise(function(resolve, reject) {
        client.execute("SELECT * from activity", function(err, result) {
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
