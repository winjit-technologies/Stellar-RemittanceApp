'use strict';

var StellarSdk = require('stellar-sdk')
var request = require('request');

var testNetwork = "https://horizon-testnet.stellar.org";
var liveNetwork = "https://horizon.stellar.org";
var friendbot = "https://horizon-testnet.stellar.org/friendbot";
var server = new StellarSdk.Server(liveNetwork);
var keys = false;

exports.CreateNewAccount = function(req, res) {   
    keys = StellarSdk.Keypair.random();   
    if(keys)
    {       
       /*request.get({
          url: 'https://horizon-testnet.stellar.org/friendbot',
          qs: { addr: keys.publicKey() },
          json: true
        }, function(error, response, body) {
          if (error || response.statusCode !== 200) {
            res.status(500).json({      
                "Result": [{   
                   "Error": "Error while transferring lumens",                                     
                }]
            });
          }
          else {*/
            res.status(200).json({      
                "Result": [{   
                   "publicKey": keys.publicKey(),
                   "secretKey":keys.secret()                         
                }]
            });
         /* }
        });*/                            
    }  
};
