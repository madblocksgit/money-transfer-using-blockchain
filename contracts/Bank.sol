pragma solidity >=0.4.18 <0.9.0;

contract Bank{

  struct Request{
    uint from;
    uint amount;
  }
  struct Transaction{
    uint sender;
    uint recipient;
    uint amount;
    string role;
  }
  struct User{

    string cname;
    string aadhaar;
    string homeaddress;
    string typeofAccount;
    string password;
    uint account_balance;
    uint created;
    uint request_count;
    uint transaction_count;
    Request [] requests; 
    Transaction [] transactions;
    
  }

  mapping(uint => User) public accounts;

  function newUser(uint account,string memory cname, string memory aadhaar,string memory homeaddress, string memory typeofAccount, string memory password)  public {

    if(accounts[account].created == 1){
      revert('Account Already Exists');
    }
    
    accounts[account].cname = cname;
    accounts[account].aadhaar = aadhaar;
    accounts[account].homeaddress=homeaddress;
    accounts[account].typeofAccount=typeofAccount;
    accounts[account].password = password;
    accounts[account].account_balance = 1000;
    accounts[account].created = 1;

  }

  function loginAccount(uint account,string memory password) view public returns (string memory) {

    if(accounts[account].created == 0){
      return "0";
    }

    string memory a = accounts[account].password;
    string memory b = password;
    string memory check = "0";
    if(keccak256(bytes(a)) == keccak256(bytes(b))){
      check = "1";
    }
    return check;
  }

  function viewAccount(uint account) view public returns (string memory,string memory,string memory,string memory,string memory, uint) {

    if(accounts[account].created == 0){
      revert('No Details AVailable');
    }

    if(accounts[account].created==1) {
      return(accounts[account].cname,accounts[account].aadhaar,accounts[account].homeaddress,accounts[account].typeofAccount,accounts[account].password,accounts[account].account_balance);
    }
  }

  

  function sendMoney(uint account,uint recipient,uint value) public {
    require((accounts[account].created == 1));
    require((accounts[recipient].created == 1)); 
    require(accounts[account].account_balance >= value);

    accounts[account].account_balance -= value;
    accounts[recipient].account_balance += value;

    accounts[account].transactions.push(Transaction(account,recipient,value,"Sent"));
    accounts[recipient].transactions.push(Transaction(account,recipient,value,"Received"));

    accounts[account].transaction_count += 1;
    accounts[recipient].transaction_count += 1;

  }

  function requestMoney(uint account,uint recipient,uint value) public {
    require((accounts[account].created == 1));
    require((accounts[recipient].created == 1));

 
    accounts[recipient].requests.push(Request(account,value));

    accounts[recipient].request_count += 1;

  } 
  function getBalance(uint account) view public returns(uint){
      return accounts[account].account_balance;
  }


  function getSender(uint account,uint index) view public returns (uint){
    return accounts[account].transactions[index].sender;
  }

  function getRecipient(uint account,uint index) view public returns (uint){
    return accounts[account].transactions[index].recipient;
  }

  function getAmount(uint account,uint index) view public returns (uint){
    return accounts[account].transactions[index].amount;
  }

  function getRole(uint account,uint index) view public returns (string memory){
    return accounts[account].transactions[index].role;
  }
   
  function getRequestOwner(uint account,uint index) view public returns (uint){
    return accounts[account].requests[index].from;
  }

  function getRequestAmount(uint account,uint index) view public returns (uint){
    return accounts[account].requests[index].amount;
  }

  

}