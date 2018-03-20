pragma solidity ^0.4.4;

   contract CarbonCurrency {
    mapping (address => uint256) balances;
    mapping (address => Usr ) Users;
   
    //users will be stored in address array.
   struct Usr {
    string [] details;
    }
    // events will get triggered when transfer of token takes place.    
   event Transfer(address indexed _from, address indexed _to, uint256 _value , string _typeOfCarbon); //transfer amount from to receiver
   event share(address indexed _from, address indexed _to, uint256 _value );
  
   function CarbonCurrency() {
        balances[msg.sender]= 200000;
   }
   
   function spendForpetrol(address receiver,string typeOfCarbon, uint amount)returns(bool sufficient) {
        if (balances[msg.sender] < amount ) return false; // checks balance is not 0.
        balances[msg.sender] -= amount*2310; // deducts  balance from Sender.
        balances[receiver] += amount*2310; // increments  balance of  receiver.
        Users[msg.sender].details.push(typeOfCarbon);
        Transfer(msg.sender, receiver, amount , typeOfCarbon); // event transfer gets called.
        return true;
    }

    function spendforLPG(address receiver,string typeOfCarbon, uint amount)returns(bool sufficient) {
        if (balances[msg.sender] < amount ) return false; // checks balance is not 0.
        balances[msg.sender] -= amount*4250; // deducts  balance from Sender.
        balances[receiver] += amount*4250; // increments  balance of  receiver.
        Users[msg.sender].details.push(typeOfCarbon);
        Transfer(msg.sender, receiver, amount , typeOfCarbon); // event transfer gets called.
        return true;
    }
    
    function spendforElectricity(address receiver,string typeOfCarbon, uint amount)returns(bool sufficient) {
        if (balances[msg.sender] < amount ) return false; // checks balance is not 0.
        balances[msg.sender] -= amount * 9; // deducts  balance from Sender.
        balances[receiver] += amount * 9; // increments  balance of  receiver.
        Users[msg.sender].details.push(typeOfCarbon);
        Transfer(msg.sender, receiver, amount , typeOfCarbon); // event transfer gets called.
        return true;
    }
    
    function shareCoins (address receiver , uint amount) returns (bool sufficient) {
        if (balances[msg.sender] < amount ) return false; // checks balance is not 0.
        balances[msg.sender] -= amount; // deducts  balance from Sender.
        balances[receiver] += amount; // increments  balance of  receiver.
        share(msg.sender, receiver, amount); // event transfer gets called.
        return true;
        
    }
    
   function getBalance(address addr) returns(uint ) {
        return balances[addr];  // returns balance of reciever.
   }
    
}