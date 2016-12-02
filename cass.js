var cassandra = require('cassandra-driver');
var Promise = require('bluebird');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'vehical_tracker' });

function put_in_cass() {

    return new Promise(function(resolve, reject) {
        const queries = [{
            query: 'INSERT INTO activity (home_id,datetime,code_used,event) VALUES (?,?,?,?)',
            params: ['H01474778', new Date(), '5674', 'alarm']
        }, {
            query: 'INSERT INTO activity (home_id,datetime,code_used,event) VALUES (?,?,?,?)',
            params: ['H01474779', new Date(), '5675', 'alarm']
        }, {
            query: 'INSERT INTO activity (home_id,datetime,code_used,event) VALUES (?,?,?,?)',
            params: ['H01474780', new Date(), '5676', 'alarm']
        }, {
            query: 'INSERT INTO activity (home_id,datetime,code_used,event) VALUES (?,?,?,?)',
            params: ['H01474781', new Date(), '5677', 'alarm']
        }];
        client.batch(queries, { prepare: true }, function(err,result) {
            if(err)
            	reject(err);
            else
            	resolve(result);
            
        });
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
