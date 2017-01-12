var isvalid = require('isvalid');
var Promise = require('bluebird');


function obj() {
    this.isvalidJson = function(inputData) {
        return new Promise(function(resolve, reject) {
            isvalid(inputData, this.schema,
                function(err, validData) {
                    if (err)
                        reject(err)
                    resolve(validData)
                })
        }.bind(this));
    };

    this.schema = {
        type: Object,
        unknownKeys: 'deny',
        schema: {
            "dvcMsgId": {
                type: String,
                required: true,
                allowNull: false,
                errors: {
                    type: 'device id  must be a string.',
                    required: 'device id is required.',
                    allowNull: 'device id can not be null'
                }
            },
            "msg": {
                type: String,
                required: true,
                allowNull: false,
                errors: {
                    type: 'message must be a string.',
                    required: 'message is required.',
                    allowNull: 'message can not be null'
                }
            },
            "name": {
                type: String,
                required: true,
                allowNull: false,
                errors: {
                    type: 'name must be a string.',
                    required: 'name is required.',
                    allowNull: 'name can not be null'
                }
            },
            "phoneNo": {
                type: String,
                required: true,
                allowNull: false,
                errors: {
                    type: 'phoneNo must be a string.',
                    required: 'phoneNo is required.',
                    allowNull: 'phoneNo can not be null'
                }
            },
            "convId": {
                type: Number,
                errors: {
                    type: 'message must be a integer.',
                }
            },
            "dateTime": {
                type: Number,
                required: true,
                allowNull: false,
                errors: {
                    type: 'message must be a number.',
                    required: 'number is required.',
                    allowNull: 'number can not be null'
                }
            },
            "msgType": {
                type: String,
                required: true,
                allowNull: false,
                errors: {
                    type: 'msgType must be a string.',
                    required: 'msgType is required.',
                    allowNull: 'msgType can not be null'
                }
            },
            "appType": {
                type: String,
                required: true,
                allowNull: false,
                errors: {
                    type: 'appType must be a string.',
                    required: 'appType is required.',
                    allowNull: 'appType can not be null'
                }
            },
            "operation": {
                type: String,
                required: true,
                allowNull: false,
                enum: ["add", "delete"],
                errors: {
                    type: 'operation must be a string.',
                    required: 'operation is required.',
                    allowNull: 'operation can not be null',
                    enum: "provide valid operation"
                }
            }
        },

        'custom': function(data, schema, fn) {
            console.log(data)
            if (!data.dvcMsgId) {
                return fn(new Error('please pass valid dvcMsgId'));
            }
            if (!data.msg) {
                return fn(new Error('please pass valid msg'));
            }
            if (!data.name) {
                return fn(new Error('please pass valid name'));
            }
            if (!data.phoneNo) {
                return fn(new Error('please pass valid phoneNo'));
            }
            if (!data.dateTime) {
                return fn(new Error('please pass valid dateTime'));
            }
            if (!data.msgType) {
                return fn(new Error('please pass valid msgType'));
            }
            if (!data.appType) {
                return fn(new Error('please pass valid appType'));
            }
            if (!data.operation) {
                return fn(new Error('please pass valid operation'));
            }
            fn(null, data);
        }

    }

    //this is used to validate headers 
    this.validateHeaders = function(req, res, next) {

            if (req.headers['x-device-key']) {
                next();
            } else {
                res.status(400).send({ "errors": ["Device Key Header Missing"] })
            }

        }
        //function to validate data
        //input array of message objects 
        //output array of error messages
    this.bodyValidation = function(obj) {
        return new Promise(function(resolve, reject) {
            var _inValiddata = [];
            var _validData = [];
            var _partialUpdate = false;
            Promise.each(obj, function(item) {
                validations(item)
                    .then(function(validData) {
                        _validData.push(validData);
                    }).catch(function(err) {
                        _partialUpdate = true;
                        _inValiddata.push(err)
                    })
            }).then(function() {
                resolve({ "valid": _validData, "inValid": _inValiddata, "partial": _partialUpdate })
            })
        });
    }



    //this is the internal function to check errors in body object 
    var validations = function(data) {
        return new Promise(function(resolve, reject) {

            if (!data.hasOwnProperty("dvcMsgId") || !data.dvcMsgId) {
                reject({
                    "dvcMsgId": "0",
                    "code": "TEJAM0402",
                    "error": "dvcMsgId not provided"
                })
            }

            if (!data.hasOwnProperty("phoneNo") || !data.phoneNo) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0403",
                    "error": "Please pass valid phoneNo"
                })
            }


            if (!data.hasOwnProperty("msg") || !data.msg) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0404",
                    "error": "Please pass valid text message"
                })
            }

            if (!data.hasOwnProperty("name") || !data.name) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0405",
                    "error": "Please pass valid name"
                })
            }

            if (!data.hasOwnProperty("dateTime") || !data.dateTime) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0406",
                    "error": "Please pass valid dateTime"
                })
            }
            if (!data.hasOwnProperty("msgType") || !data.msgType) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0407",
                    "error": "Please pass valid msgType"
                })
            }

            if (!data.hasOwnProperty("appType") || !data.appType) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0408",
                    "error": "Please pass valid appType"
                })
            }

            if (!data.hasOwnProperty("operation") || !data.operation) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0409",
                    "error": "Please pass valid operation"
                })
            }

            //check for numbers 
            if (data.convId && isNaN(data.convId)) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0410",
                    "error": "convId should be a integer"
                })
            }

            if (isNaN(data.dateTime)) {
                reject({
                    "dvcMsgId": data.dvcMsgId,
                    "code": "TEJAM0411",
                    "error": "dateTime should be a timestamp"
                })
            }
            resolve(data);
        })
    }
}

module.exports = new obj();