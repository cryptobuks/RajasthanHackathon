var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var CarbonCurrency = artifacts.require("./CarbonCurrency.sol");
//var Account = artifacts.require("./Account.sol");

module.exports = function(deployer) {
    deployer.deploy(ConvertLib);
    deployer.link(ConvertLib, MetaCoin);
    deployer.deploy(CarbonCurrency);


};