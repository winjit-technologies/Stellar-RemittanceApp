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

exports.AccountDetails = function (req, res) {    
    var accountId = req.body.accountId;
    if (accountId) {
        server.loadAccount(accountId).catch(function(error) {
            return res.status(500).json({      
                 "Result": [{
                     "Error": "Account not active"                    
                 }]
             })   
           }).then(function(account) {                  
             if(!account)
             {
                 res.status(500).json({      
                     "Result": [{
                         "Error": "Account not active"                        
                     }]
                 })    
             }
             else{
                 console.log('account is');
                 console.log(account);    
                 res.status(200).json({      
                     "Result": [{
                         "Response": account                        
                     }]
                 }) 
             }            
         });
    }
    else {
        res.status(500).json({
            "Result": [{
                "Error": "Account Id is required"
            }]
        })
    }
}


exports.SendPayment = function (req, res) {    
    var srcAcct = req.body.srcAcct;
    var destAcct = req.body.destAcct;
    var srcSeed = req.body.srcSeed;
    var amount = req.body.amount;

    if(!srcAcct)
    {
        return res.status(500).json({      
            "Result": [{           
                "Error": "Source account public key required"               
            }]
        })  
    }
     if(!destAcct)
    {
        return res.status(500).json({      
            "Result": [{           
                "Error": "Destination account public key required"               
            }]
        })  
    } 
     if(!srcSeed)
    {
        return res.status(500).json({      
            "Result": [{           
                "Error": "Source account seed required"               
            }]
        }) 
    }
    if(!amount)
    {
        return res.status(500).json({      
            "Result": [{           
                "Error": "Amount to be sent required"               
            }]
        }) 
    }

    //check if source and destination account id's are valid

    //check if the account is active
    
    server.loadAccount(destAcct)
        .catch(StellarSdk.NotFoundError, function (error) {
            return res.status(500).json({      
                "Result": [{           
                    "Error": "Destination Account not active"               
                }]
            }) 
        })
        .then(function (account) {
            return server.loadAccount(srcAcct);
        })
        .catch(StellarSdk.NotFoundError, function (error) {
            return res.status(500).json({      
                "Result": [{           
                    "Error": "Source Account not active "               
                }]
            })            
        })
        .then(function (srcAcct) {
            //StellarSdk.Network.useTestNetwork();
            StellarSdk.Network.usePublicNetwork();

            var transaction = new StellarSdk.TransactionBuilder(srcAcct)
                .addOperation(StellarSdk.Operation.payment({
                    destination: destAcct,
                    asset: StellarSdk.Asset.native(),
                    amount: amount
                }))
                .build();

            transaction.sign(StellarSdk.Keypair.fromSecret(srcSeed));
            return server.submitTransaction(transaction);
        })
        .then(function (result) {
            return res.status(200).json({      
                "Result": [{
                    "Status":"Payment Successful",           
                    "Response": result              
                }]
            }) 
        })
        .catch(function (error) {
            return res.status(500).json({      
                "Result": [{           
                    "Error": "Error while Processing Payment"              
                }]
            })  
        });
}


exports.TransactionHistory = function (req, res) {   
    var accountId = req.body.accountId;
    if (accountId) {
        server.transactions()
        .forAccount(accountId)
        .call()
            .then(function (page) {
                //console.log('Page 1: ');
                res.status(200).json({
                    "Result": [{
                        "Response": page.records
                    }]
                })
                console.log(page.records);
               // return page.next();
            })          
            .catch(function (err) {
                res.status(500).json({
                    "Result": [{
                        "Error": "Account does not exst or is not active"
                    }]
                })
            }); 
}
else{
    res.status(500).json({
        "Result": [{
            "Error": "Account Id is required"
        }]
    })
}
}