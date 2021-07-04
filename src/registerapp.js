App = {

	web3Provider: null,
	contracts: {},

	init: async function() {

		return await App.initWeb3();
	},

	initWeb3: async function() {

		if(window.web3) {
			App.web3Provider = window.web3.currentProvider;
			console.log('Metamask Available');
		}
		else {
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
			console.log('Ganache Available');
		}

		web3 = new Web3(App.web3Provider);
		return App.initContract();
	},

	initContract: function() {

		$.getJSON('Bank.json',function(data){

			var bankArtifact = data;
			App.contracts.bank = TruffleContract(bankArtifact);
			App.contracts.bank.setProvider(App.web3Provider);
		});
			return App.bindEvents();
	},

	bindEvents: function() {

		$(document).on('click', '.btn-register', App.registerUser);
	},

	registerUser: function(event) {
		event.preventDefault();

		var bankInstance;
		var cname = document.getElementById('cname').value;
		var aadhaar = document.getElementById('aadhaar').value;
		var homeaddress = document.getElementById('homeaddress').value;
		var accountType = document.getElementById('accountType').value;
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;

		const user = parseInt(username);

		console.log(cname,aadhaar,homeaddress,accountType,username,password);
		

		web3.eth.getAccounts(function(error,accounts){

			if(error) {
				console.log(error);
			}

			var account=accounts[0];
			console.log(account);

			App.contracts.bank.deployed().then(function(instance){
				
				bankInstance=instance;
				return bankInstance.newUser(user, cname, aadhaar, homeaddress, accountType, password,{from:account});

			}).then(function(result){

				console.log(result);
				alert('Account Created Successfully');
				window.location.reload(); 
				
				//document.getElementById('email').innerHTML = '';
				//document.getElementById('mobile').innerHTML = '';
				//document.getElementById('pwd').innerHTML = '';

			}).catch(function(err){
				alert('Account Existed');
				window.location.reload(); 
				console.log(err.message);
			});

		});
	}

}

$(function() {
  $(window).load(function() {
    App.init();
  });
});