<html>

<head>
    <title>Token Incentives</title>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width,user-scalable=no">
    <link href="https://cdn.bootcss.com/semantic-ui/2.3.1/semantic.css" rel="stylesheet">

    <style>
        .ui.menu {
            border-radius: 0;
        }

        .ui.cards {
            margin-top: 50px;
        }

        .ui.cards .card {
            margin: 10px 40px;
        }

        .token-logo {
            margin-bottom: 20px;
        }

        .without-metamask {
            text-align: center;
        }

        .loading-view {
            margin-top: 0!important;
            border: none!important;
            height: 150px!important;
        }

        .loading-view .dimmer {
            background-color: rgba(239, 64, 64, 0.85);
        }

        .ui.centered.cards {
            justify-content: left;
        }

        .my-content {
            height: 50px;
            padding-left: 12px;
            border: none;
            border-top: 1px solid rgba(34, 36, 38, 0.1);
            background: none;
            margin: 0em;
            padding: 1em 1em;
            -webkit-box-shadow: none;
            box-shadow: none;
            font-size: 1em;
            border-radius: 0em;
        }

        .ui.segment {
            text-align: left;
        }

        .ui.cards > .card > .content p {
            margin: 10px 0;
        }

        @media (max-width:640px) {
            .ui.cards .card {
                margin: 25px 0;
            }
        }
    </style>
</head>

<body>
<div class="ui inverted menu" style="margin:0">
    <a href="/incentives" class="item active">Home</a>
</div>

<div class="ui negative message without-metamask" id="without-metamask" style="display:none">
        <a target="_blank" href="https://metamask.io/" class="header">You need to install MetaMask to use this feature</a>
</div>

<div class="ui segment loading-view" style="display:none">
  <div class="ui active dimmer">
    <div class="ui large text loader">Please do not close the browser or refresh the page until the transaction finished</div>
  </div>
  <p></p>
  <p></p>
  <p></p>
</div>

<div class="ui center aligned container">

    <div class="ui centered cards">

        <div class="card" id="heronode-plan-2">
            <div class="content">
            <img class="mini ui image token-logo" src="https://cdn.tangguo360.com//heronode/fav.png">
            <div class="header">Hero Node Incentives Plan 2</div>
        
            <div class="description">Hero Node is a cross-public-blockchain and cross-platform DApp development platform and solution</div>
            </div>
            <div class="content left aligned">
                Final deposit date: <span class="maxStartTime">2018-7-31</span>
             </div>
             <div class="content left aligned">
                Unlock date: <span class="minEndTime">2019-7-30</span>
             </div>
             <div class="content left aligned">
                Duration: <span class="term">364</span> Days
             </div>
             <div class="content left aligned">
                Investment profit: <span class="rate">15%</span>
             </div>
             <div class="content left aligned">
                Token deposited: <span class="depositedTokens"> -- </span> HER
             </div>
             <div class="ui green tiny progress">
                <div class="bar"></div>
            </div>
            <div class="extra content">
                <div class="ui buttons">
                    <div class="ui basic red button user-action disabled" data-action="deposit" data-index="2">Deposit</div>
                </div>
            </div>
        </div>

        <div class="card">
        <div class="content">
            <div class="header">Guide</div>    
                <div class="ui segment guide" style="border: 0px;box-shadow: none;">
                    <p>1. The tokens we use to pay the interest comes from the crowdsale refund program.</p>
                    <p>2. Make sure you've installed the <a target="_blank" href="https://metamask.io/"> metamask </a>  plugin in your browser.</p>
                    <p>3. Make sure the "deposit" button is available before you do the deposit.</p>
                    <p>4. The Deposit operation needs two transactions by metamask, so please DO NOT interrupt the process or refresh the page during the operation.</p>
                    <p>5. When the lockup plan reached the unlock date, the withdraw button should be available. From there on you can start the withdraw operation.</p>
                    <p>6. If you forget to withdraw, your tokens will also be sent back to your account.</p>
                </div>
            </div>
        </div>

        <div class="card" id="my-balance-1">
            <div class="content">
                <div class="header">My Balance</div>
             </div>
             <div style="position:  absolute;top: 78px;left: 0; right: 0">
                <div class="my-content left aligned">
                    Deposited Tokens: <span class="deposited"> -- </span> HER
                </div>
                <div class="my-content left aligned">
                    Rewards: <span class="interest"> -- </span> HER
                </div>
                <div class="my-content left aligned">
                    Total Tokens: About <span class="total"> -- </span> HER
                </div>
             </div>
        </div>

        <div class="card" id="heronode-plan-1">
            <div class="content">
            <img class="mini ui image token-logo" src="https://cdn.tangguo360.com//heronode/fav.png">
            <div class="header">Hero Node Incentives Plan</div>
        
            <div class="description">Hero Node is a cross-public-blockchain and cross-platform DApp development platform and solution</div>
            </div>
            <div class="content left aligned">
                Final deposit date: <span class="maxStartTime">2018-7-31</span>
             </div>
             <div class="content left aligned">
                Unlock date: <span class="minEndTime">2019-7-30</span>
             </div>
             <div class="content left aligned">
                Duration: <span class="term">364</span> Days
             </div>
             <div class="content left aligned">
                Investment profit: <span>30</span>% + <span class="rate" style="color:red">--</span>
             </div>
             <div class="content left aligned">
                Token deposited: <span class="depositedTokens"> -- </span> HER
             </div>
             <div class="ui green tiny progress">
                <div class="bar"></div>
            </div>
            <div class="extra content">
                <div class="ui buttons">
                    <div class="ui basic red button user-action disabled" data-action="deposit" data-index="1">Deposit</div>
                </div>
            </div>
        </div>

        <div class="card">
        <div class="content">
            <div class="header">Guide</div>    
                <div class="ui segment guide" style="border: 0px;box-shadow: none;">
                    <p>1. The tokens we use to pay the interest comes from the crowdsale refund program.</p>
                    <p style="color:red">2. The Floating rate is calculated by dividing all participating users into 30 million tokens.</p>
                    <p>3. Make sure you've installed the <a target="_blank" href="https://metamask.io/"> metamask </a>  plugin in your browser.</p>
                    <p>4. Make sure the "deposit" button is available before you do the deposit.</p>
                    <p>5. The Deposit operation needs two transactions by metamask, so please DO NOT interrupt the process or refresh the page during the operation.</p>
                    <p>6. When the lockup plan reached the unlock date, the withdraw button should be available. From there on you can start the withdraw operation.</p>
                    <p>7. If you forget to withdraw, your tokens will also be sent back to your account.</p>
                </div>
            </div>
        </div>

        <div class="card" id="my-balance">
            <div class="content">
                <div class="header">My Balance</div>
             </div>
             <div style="position:  absolute;top: 78px;left: 0; right: 0">
                <div class="my-content left aligned">
                    Deposited Tokens: <span class="deposited"> -- </span> HER
                </div>
                <div class="my-content left aligned">
                    Rewards: <span class="interest"> -- </span> HER
                </div>
                <div class="my-content left aligned">
                    Variable Bonus: About <span class="shared"> -- </span> HER
                </div>
                <div class="my-content left aligned">
                    Total Tokens: About <span class="total"> -- </span> HER
                </div>
             </div>
        </div>

    </div>
</div>

<div class="ui black inverted vertical footer segment" style="margin-top:156px">
  <div class="ui center aligned container">
      <h4 class="ui inverted teal header">Powered by Hero Node</h4>
    </div>
  </div>
</div>

<div class="ui small modal" id="deposit-modal">
  <div class="header">
    Deposit Token
  </div>
  <div class="content">
    <form class="ui form">
        <div class="field">
            <label>Your Deposit Token Value</label>
            <input type="text" placeholder="Deposit Value" id="depositValue">
        </div>
    </form>
  </div>
  <div class="actions">
    <div class="ui black deny button">
      Cancel
    </div>
    <div class="ui positive right labeled icon button confirm">
      Confirm
      <i class="checkmark icon"></i>
    </div>
  </div>
</div>

<script src="https://cdn.tangguo360.com/dapps/lib/web3.min-1.0es6.js"></script>

<script>

function checkMetamask() {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("https://infura.io/33USgHxvCp3UoDItBSRs"));
        document.getElementById("without-metamask").style.display = 'block';
    }
}

checkMetamask();

</script>

<script src="https://cdn.tangguo360.com/heronodecdn/jquery-3.2.1.min.js"></script>
<script src="https://cdn.bootcss.com/semantic-ui/2.3.1/semantic.js"></script>

<script>

const ABI = [{"constant":false,"inputs":[],"name":"ownerWithdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"ownerDeposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"userUpperLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"ownerWithdrawEth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"users","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contributions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getUserBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenLocked","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenBonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getUserLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"close","type":"bool"}],"name":"resumeTokenBank","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"updateToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"closeFlag","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minEndTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"limit","type":"uint128"}],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"accu","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_limit","type":"uint256"}],"name":"updateUserUpperLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"deposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_maxStartTime","type":"uint256"}],"name":"updateMaxStartTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_limit","type":"uint256"}],"name":"updateUserLowerLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenRate","type":"uint256"}],"name":"updateTokenRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_minEndTime","type":"uint256"}],"name":"updateMinEndTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"userLowerLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_token","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"target","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"target","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Refund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"target","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"isToken","type":"bool"}],"name":"WithdrawByOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
const TokenABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addrs","type":"address[]"},{"name":"amount","type":"uint256"}],"name":"airdropToAddresses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
const TokenAddress = "0x491c9a23db85623eed455a8efdd6aba9b911c5df";
var TokenContract;
var CurrentUserAddress;
var CurrentUserBalance = 0;
var solidRate = 0.3;
var solidBouns = 30000000;
var TokenPlanAddress1 = "0x9ea4e6846E46098eb3a678A7061a9A92227AF37A";
var TokenPlanAddress2 = "0x965f5615ee528ebbc8adcc41664b17712401a98d";
var TokenPlanContract1;
var TokenPlanContract2;
var currentIndex = 1;

var totalOriginBalance;
var totalBalance;
var totalRateValue;
var dynamicBalance;


async function fetchContractData(target, contractAddress, dync) {
    
    var parent = $(target);
    console.log(target, ' : ', contractAddress);
    var contract = new web3.eth.Contract(ABI, contractAddress);


    if (contractAddress == TokenPlanAddress1) {
        TokenPlanContract1 = contract;
    }
    if (contractAddress == TokenPlanAddress2) {
        TokenPlanContract2 = contract;
    }

    var maxStartTime = await contract.methods.maxStartTime().call();
    var maxStartDate = new Date(maxStartTime.toString() * 1000);
    parent.find(".maxStartTime").text(maxStartDate.toISOString().slice(0,10));
    

    var minEndTime = await contract.methods.minEndTime().call();
    var minEndDate = new Date(minEndTime.toString() * 1000);
    parent.find( ".minEndTime").text(minEndDate.toISOString().slice(0,10));

    var term = parseInt((minEndDate - maxStartDate) / (1000 * 60 * 60 * 24));
    parent.find(".term").text(term);

    var bonus = await contract.methods.tokenBonus().call();
    bonus = parseInt(bonus/10**18);

    var lockBonus = await contract.methods.tokenLocked().call();
    lockBonus = parseInt(lockBonus/10**18);

    var tokenRate = solidRate;
    
    if (dync) {
        var depositedTokens = parseInt(lockBonus / solidRate);
        parent.find( ".depositedTokens").text(depositedTokens);
        var dynamicRate = parseFloat(solidBouns / depositedTokens).toFixed(2);
        parent.find( ".rate").text(parseFloat(dynamicRate * 100)+ '%');

        var progress = bonus > 0 ? (lockBonus / bonus) * 100 : 100;
        parent.find(".progress").progress({ percent: progress });

    } else {
        tokenRate = await contract.methods.tokenRate().call();
        parent.find( ".rate").text(parseFloat(tokenRate)+ '%');
        tokenRate = parseFloat(tokenRate/100);
        var depositedTokens = parseInt(lockBonus / tokenRate);
        parent.find( ".depositedTokens").text(depositedTokens);

        var total = await contract.methods.total().call();
        var totalLimit = await contract.methods.totalLimit().call();

        var progress = (total / totalLimit) * 100;
        parent.find(".progress").progress({ percent: progress });
    }

    var accounts = await web3.eth.getAccounts();
    if (accounts[0] && accounts[0].length > 0) {
        if (dync) {
            let balance1 = await contract.methods.getUserBalance(accounts[0]).call();
            // current user balance
            balance1 = parseInt(balance1/10**18);
            totalBalance += balance1;

            const originBalance = parseInt(balance1 / (1 + tokenRate));
            totalOriginBalance += originBalance;
            $('#my-balance .deposited').text(originBalance);

            const rateValue = balance1 - originBalance;
            totalRateValue += rateValue;
            $('#my-balance .interest').text(rateValue);

            dynamicBalance = originBalance * dynamicRate;
            $('#my-balance .shared').text(dynamicBalance);

            $('#my-balance .total').text(balance1 + dynamicBalance);
        } else {
            let balance1 = await contract.methods.getUserBalance(accounts[0]).call();
            // current user balance
            balance1 = parseInt(balance1/10**18);
            totalBalance += balance1;

            const originBalance = parseInt(balance1 / (1 + tokenRate));
            totalOriginBalance += originBalance;
            $('#my-balance-1 .deposited').text(originBalance);

            const rateValue = balance1 - originBalance;
            totalRateValue += rateValue;
            $('#my-balance-1 .interest').text(rateValue);

            $('#my-balance-1 .total').text(balance1);
        }
        
    }
    

    var disabled = false;
    var isWithdraw = false;

    var now = new Date().getTime();
    if (progress >= 100) {
        disabled = true;
    }
    if (maxStartDate.getTime() < now) {
        disabled = true;
    }
    if (minEndDate.getTime() < now) {
        disabled = false;
        isWithdraw = true;
    }

    if (!disabled) {
        parent.find(".user-action").removeClass('disabled');
    }

    if (isWithdraw) {
        parent.find(".user-action").text('Withdraw');
        parent.find(".user-action").data('action', 'withdraw');
    }

    if (!web3.currentProvider.isMetaMask) {
        parent.find(".user-action").addClass('disabled');
    }
}

async function fetchAccountInfo() {
    if (web3.currentProvider.isMetaMask) {
        var tokenContract = new web3.eth.Contract(TokenABI, TokenAddress);
        var accounts = await web3.eth.getAccounts();
        TokenContract = tokenContract;
        TokenContract.options.address = TokenAddress;
        TokenContract.options.from = accounts[0];
        var currentAddress = accounts[0];
        var balance = await tokenContract.methods.balanceOf(currentAddress).call();
        balance = balance / 10 ** 18;
        CurrentUserBalance = balance;
        CurrentUserAddress = currentAddress;
    }
}

function startCheckTx(txid, callback) {
    var txInterval = setInterval(async function() { 
        var result = await web3.eth.getTransactionReceipt(txid);
        if (result) {
            callback(result.status == '0x1');
            clearInterval(txInterval);
        }
    }, 2000);
}

async function withdraw() {
    var planContract = getPlanContract();
    var accounts = await web3.eth.getAccounts();
    var option = { gas: 250000, gasPrice: web3.utils.toWei("41", "gwei"), from: accounts[0] };
    try {
        await planContract.methods.withdraw().send(option).on('transactionHash', function(txid) {
            $('.loading-view').show();
            startCheckTx(txid, function(success) {
                $('.loading-view').hide();
                if (success) {
                    alert('Congratulations! Withdraw success!');
                } else {
                    alert('Error encountered during contract execution, please try again or check your token balance');
                }
            });
        });
    } catch(err) {
        alert('Error:' + err);
    }
}

$('.user-action').click(function() {
    var action = $(this).data('action');
    var index = $(this).data('index');
    currentIndex = parseInt(index);
    if (action == 'withdraw') {
        withdraw();
    } else {
        var node = $(this).parents('.card');
        $('#deposit-modal').modal('show');
    }
});

$('#deposit-modal .confirm').click(async function() {
    var value = $('#depositValue').val();
    if (value.trim().length == 0) {
        alert('please input deposit value');
        return;
    }
    if (isNaN(parseFloat(value)) || !isFinite(value)) {
        alert('please input a number value');
        return;
    }
    value = value.trim() + "000000000000000000";
    var planAddress = getPlanAddress();
    var planContract = getPlanContract();
    var accounts = await web3.eth.getAccounts();
    var option = { gas: 250000, gasPrice: web3.utils.toWei("41", "gwei"), from: accounts[0] };
    var warningMessage = "Please do not close the browser or refresh the page until the next Metamask notification window popup, and then click \"submit\" button to authorize the second step";
    try {
        const txid = TokenContract.methods.approve(planAddress, value).send(option).on('transactionHash', function(txid){
            $('.loading-view .text').text(warningMessage);
            $('.loading-view').show();
            startCheckTx(txid, async function(success) {
                $('.loading-view').hide();
                if (success) {
                        warningMessage = "Please do not close the browser or refresh the page until the transaction finished"; 
                        await planContract.methods.deposit(value).send(option).on('transactionHash', function(dtxid){
                            $('.loading-view .text').text(warningMessage);
                            $('.loading-view').show();
                            startCheckTx(dtxid, function(success) {
                                $('.loading-view').hide();
                                if (success) {
                                    alert('Congratulations! Deposit success!');
                                    location.reload();
                                } else {
                                    alert('Error encountered during contract execution, please try again or check your token balance');
                                }
                            });
                        });
                        
                    } else {
                        alert('Error encountered during contract execution, please try again or check your token balance');
                    }
                });
            });
    } catch(err) {
        alert('Error' + err);
    }
});

function getPlanAddress() {
    if (currentIndex == 1) {
        return TokenPlanAddress1;
    } else {
        return TokenPlanAddress2;
    }
}

function getPlanContract() {
    if (currentIndex == 1) {
        return TokenPlanContract1;
    } else {
        return TokenPlanContract2;
    }
}

fetchAccountInfo();
fetchContractData('#heronode-plan-1', TokenPlanAddress1, true);
fetchContractData('#heronode-plan-2', TokenPlanAddress2, false);

</script>
</body>

</html>