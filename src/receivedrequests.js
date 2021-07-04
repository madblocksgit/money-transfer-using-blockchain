App = {
    loading: false,
    web3Provider: null,
    contracts: {},

    load: async () => {

      await App.initWeb3();
      await App.initContract();
      await App.checkLogin();
      //await App.getList();
    },

    initWeb3:  async () => {

      if(window.web3) {
        App.web3Provider = window.web3.currentProvider;
        console.log('Metamask Available');
      }
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        console.log('Ganache Available');
      }

      web3 = new Web3(App.web3Provider);
    },

    initContract:  async () => {

      $.getJSON('Bank.json',function(data){

        var bankArtifact = data;
        App.contracts.bank = TruffleContract(bankArtifact);
        App.contracts.bank.setProvider(App.web3Provider);
      });
      
    },

    checkLogin:  async () => {

      value = parseInt(localStorage.login);
      console.log(value);

      if(value == 0)
      {
        alert('You are not logged in !!')
        window.location.href = "login.html"
      }
      return App.bindEvents();
    },

    bindEvents: function() {

      $(document).on('click', '.btn-showrequests', App.showRequests);
      $(document).on('click', '.btn-checkBalance', App.getBalance);
    }, 

    getBalance:function(event) {

    event.preventDefault();

    const u = localStorage.account;
    const user = parseInt(u);
    console.log(user);

    var bankInstance;

    web3.eth.getAccounts(function(error,accounts){

      if(error) {
        console.log(error);
      }

      var account=accounts[0];
      console.log(account);

      App.contracts.bank.deployed().then(function(instance){
        
        bankInstance=instance;
        return bankInstance.getBalance(user,{from:account});

      }).then(function(result){

        const balance=(result.toNumber());
        $('#bal').html(balance);

        var delayInMilliseconds = 3000; 

        setTimeout(function() {
          $('#bal').html('*****');
         }, delayInMilliseconds);
      }).catch(function(err){
        console.log(err.message);
      });

    });
   },

   showRequests:function(event) {
    event.preventDefault();

    var count;
    const user = parseInt(localStorage.account);

    var bankInstance;

    web3.eth.getAccounts(function(error,accounts){

      if(error) {
        console.log(error);
      }

      var account=accounts[0];
      console.log(account);

      App.contracts.bank.deployed().then(function(instance){
        
        bankInstance=instance;
        return bankInstance.accounts(user,{from:account});

      }).then(function(result){

        //console.log(result);
        
        var count = result[7].toNumber();
        console.log(count);
        var makeup;
        var t = "";
        //let k1;
        //let m1;
        for(let i=0;i<count;i++) {
          var k1;
          var m1;
          App.contracts.bank.deployed().then(function(instance){
              bankInstance=instance;
              return bankInstance.getRequestOwner(user,i,{from:account});
            }).then(function(result1){
              const k=(result1['c'][0]);
              k1=parseInt(k);
              console.log(k1);
             
              App.contracts.bank.deployed().then(function(instance){
                bankInstance=instance;
                return bankInstance.getRequestAmount(user,i,{from:account});
              }).then(function(result2){
                const m=(result2['c'][0]);
                m1=parseInt(m);
                console.log(m1);
                 t="";
                 t+="<tr>"
                 t+="<td>"+k1+"</td>";
                 t+="<td>"+m1+"</td></tr>";
                 console.log(t);
                 document.getElementById('list').innerHTML +=t;
                 const button=document.getElementById('madhu1');
                 button.disabled=true;
              }).catch(function(err){
                console.log(err.message);
              });
            }).catch(function(err){
              console.log(err.message);
            });
        }
        console.log(t);
        
      }).catch(function(err){
        console.log(err.message);
      });
    });
    

          
        }  
       
      /*}).catch(function(err){
        console.log(err.message);
      });*/

    //});
  }

    /*getList: async () =>{
      const user = parseInt(localStorage.account)
      const task = await App.appVariable.accounts(user)

      const count = task[3].toNumber()
      console.log(count)
      for(var i = 0;i < count;i++)
      {
        const from = await App.appVariable.getRequestOwner(user,i)
        const amount = await App.appVariable.getRequestAmount(user,i)
        const f = from.toNumber()
        const a = amount.toNumber()
        var makeup = "<tr> <td>" +f+"</td><td>"+a+"</td> <tr>";
        $('#list').append(makeup)
      }  
    },*/

    
    


$(() => {
  $(window).load(() => {
    App.load()
  })
})