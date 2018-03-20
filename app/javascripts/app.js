// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/css/bootstrap.css";

// Import libraries we need.
import {
    default as Web3
} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import CarbonCurrency_artifacts from '../../build/contracts/CarbonCurrency.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var CarbonCurrency = contract(CarbonCurrency_artifacts);
// var Account = contract(account_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
    start: function() {
        var self = this;
        // Bootstrap the MetaCoin abstraction for Use.
        //MetaCoin.setProvider(web3.currentProvider);
        CarbonCurrency.setProvider(web3.currentProvider);

        // Get the initial account balance so it can be displayed.
        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            accounts = accs;
            account = accounts[0];


            self.refreshBalance();
           
        
            // self.setStatus();
        });
    },

    setStatus: function(message) {
        var status = document.getElementById("status");
        status.innerHTML = message;
    },

    refreshBalance: function() {
        var self = this;

        var meta;

        CarbonCurrency.deployed().then(function(instance) {
            meta = instance;
            return meta.getBalance.call(account, {
                from: account
            });
        }).then(function(value) {
            var balance_element = document.getElementById("balance");
            balance_element.innerHTML = value.valueOf();
        }).catch(function(e) {
            console.log(e);
            // self.setStatus("Error getting balance; see log.");
        });
    },
    
    ShareCoins: function() {
        var self = this;
        var receiver = document.getElementById("sendCoinReceiver").value;
        console.log("Coinreciever:------>" + receiver);

        var amount = parseInt(document.getElementById("CoinAmount").value);
        console.log("amount",amount)
        this.setStatus("Initiating transaction... (please wait)");

        var rapid;
        CarbonCurrency.deployed().then(function(instance) {
            rapid = instance;
            return rapid.shareCoins(receiver, amount,{
                from: account
            });
        }).then(function(value) {

            self.setStatus("Transaction complete!");
            self.refreshBalance();

        }).catch(function(e) {
            console.log(e);
            self.setStatus("Error Approving transaction due to insufficient Balance");
        });
    },

    checkBalance: function() {
        var self = this;
        var rapid;
        CarbonCurrency.deployed().then(function(instance) {
            rapid = instance;
            var coinAddress = document.getElementById("coinReceiver").value;

            console.log("Coin Address: " + coinAddress);
            return rapid.getBalance.call(coinAddress, {
                from: account
            });
        }).then(function(value) {
            var balance_element = document.getElementById("checkBalance");
            balance_element.innerHTML = value.valueOf();
        }).catch(function(e) {
            console.log(e);
            self.setStatus("Error getting balance; see log.");
        });
    },
    
    payforGas:function(){
    var self = this;
    var receiver = document.getElementById("sendCoinReceiver").value;
    var typeOfCarbon=(document.getElementById("typeOfCarbon").value);
    var amount = (document.getElementById("CoinAmount").value);
    this.setStatus("Initiating transaction... (please wait)");
    var rapid;
    CarbonCurrency.deployed().then(function(instance) {
        rapid = instance;
        return rapid.spendforLPG(receiver, typeOfCarbon, amount,{
            from: account
        });
    }).then(function(value) {

        self.setStatus("Transaction complete!");

    }).catch(function(e) {
        console.log(e);
        self.setStatus("Error Approving transaction due to insufficient Balance");
    });
    },

    payforPetrol:function(){
    var self = this;
    var receiver = document.getElementById("senderAddress").value;
    var typeOfCarbon=(document.getElementById("sourceOfCarbon").value);
    var amount = (document.getElementById("paybleAmount").value);
    this.setStatus("Initiating transaction... (please wait)");
    var rapid;
    CarbonCurrency.deployed().then(function(instance) {
        rapid = instance;
        return rapid.spendforLPG(receiver, typeOfCarbon, amount,{
            from: account
        });
    }).then(function(value) {

        self.setStatus("Transaction complete!");

    }).catch(function(e) {
        console.log(e);
        self.setStatus("Error Approving transaction due to insufficient Balance");
    });
    },

    payforElectricity:function(){
        var self = this;
        var receiver = document.getElementById("Address").value;
        var typeOfCarbon=(document.getElementById("carbonSpending").value);
        var amount = (document.getElementById("spendingAmount").value);
        this.setStatus("Initiating transaction... (please wait)");
        var rapid;
        CarbonCurrency.deployed().then(function(instance) {
            rapid = instance;
            return rapid.spendforElectricity(receiver, typeOfCarbon, amount,{
                from: account
            });
        }).then(function(value) {
    
            self.setStatus("Transaction complete!");
    
        }).catch(function(e) {
            console.log(e);
            self.setStatus("Error Approving transaction due to insufficient Balance");
        });
        },
        
    carbonCalculation:function(){
        var modeofTransport = document.getElementById("vehicle").value;
        var person = document.getElementById("perhead").value;
        var average = document.getElementById("vehicleAverage").value;
        var distance = document.getElementById("distance").value;
        var carbonEmmission;
        if(modeofTransport == "bike" && person =="2"){
        carbonEmmission = distance/average;
        carbonEmmission * 2310;
        console.log("carbon coin to be paid",carbonEmmission);
        return carbonEmmission;
        }
        else if (modeofTransport == "car" && person =="4"){
        carbonEmmission = distance/average;    
        carbonEmmission * 2.33;
        console.log("carbon coin to be paid",carbonEmmission);
        return carbonEmmission;
        }
        else{
            console.log("given information is not appropriate");
        }
    },
    houseCarbonCalculation : function(){
        var perDay = document.getElementById("perMonth").value;
        var perHead = document.getElementById("people");
        var carbonCalculationFor = document.getElementById("calculationFor");
        var emmission;
        if (carbonCalculationFor =="Gas"){
            emmission = perDay / perHead;
            emmission * 42.5;
            console.log("emmission for gas",emmission);
            return emmission; 
        }
        else{
            emmission = perDay / perHead;
            emmission * 0.9;
            console.log("emmission for gas",emmission);
            return emmission; 
            
        }        
    }
}

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
            // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    App.start();
});