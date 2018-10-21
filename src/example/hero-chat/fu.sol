pragma solidity ^0.4.18;

contract GoodFortune {

    address public owner;
    struct Lucky {
        uint btc;
        uint eth;
        uint eos;
        uint qtum;
        uint hnc;
    }

    struct Sponsor {
        address spo;
        string msg;
        uint amount;
    }

    mapping (address => Lucky) public happyNewYear;
    Sponsor[] public sponsors;
    address[] public awareders;
    uint public ticketPrice;
    uint public reward;

    event PayEvent(address payer, uint amount);
    event AwaredEvent(address payer, uint amount);
    event SponsorEvent(address payer, uint amount, string massage);
    event SentLuckyEvent(address sender, address reciver, uint luckyType);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function GoodFortune() public {
        owner = msg.sender;
        ticketPrice = 10**16;
        reward = 5*10**17;
    }

    function clearBalance() onlyOwner public {
        msg.sender.transfer(this.balance);
    }

    function () payable public {
        payHelp(msg.sender);
    }

    function payHelp(address add) payable public {
        require(msg.value >= ticketPrice);
        require(msg.value % ticketPrice == 0);
        require(msg.value / ticketPrice < 6);
        var amount = msg.value;
        var num = amount / ticketPrice;
        for (uint p = 0; p < num; p++) {
            getLucky(add, p);
        }
        PayEvent(add, msg.value);
    }

    function sponsor(string massage) payable public {
        sponsorHelp(msg.sender, massage);
    }

    function sponsorHelp(address add, string massage) payable public {
        Sponsor memory spo = Sponsor({spo:add,amount:msg.value,msg:massage});
        sponsors.push(spo);
        SponsorEvent(add, msg.value, massage);
    }

    function getLucky(address add, uint index) private {
        uint random = (uint(block.blockhash(block.number-1)) - uint(add)) - index;
        Lucky storage lucky = happyNewYear[add];
        if (random % 43 == 0) {
            lucky.hnc++;
        } else {
            lucky.btc++;
        }
        if (random % 17 == 0) {
            lucky.qtum++;
        } else {
            lucky.btc++;
        }
        if (random % 5 == 0) {
            lucky.eos++;
        } else {
            lucky.btc++;
        }
        if (random % 3 == 0) {
            lucky.eth++;
        } else {
            lucky.btc++;
        }
        if (random % 2 == 0) {
            lucky.btc++;
        } else {
            lucky.eth++;
        }
    }
    function sentLucky(address reciver, uint luckyType) public {
        require(luckyType >= 0 && luckyType <= 4);
        Lucky storage lucky = happyNewYear[msg.sender];
        Lucky storage luckyReciver = happyNewYear[reciver];
        if (luckyType == 0) {
            require(lucky.btc > 0);
            lucky.btc--;
            luckyReciver.btc++;
        } else if (luckyType == 1) {
            require(lucky.eth > 0);
            lucky.eth--;
            luckyReciver.eth++;
        } else if (luckyType == 2) {
            require(lucky.eos > 0);
            lucky.eos--;
            luckyReciver.eos++;
        } else if (luckyType == 3) {
            require(lucky.qtum > 0);
            lucky.qtum--;
            luckyReciver.qtum++;
        } else if (luckyType == 4) {
            require(lucky.hnc > 0);
            lucky.hnc--;
            luckyReciver.hnc++;
        } else {
            require(false);
        }
        SentLuckyEvent(msg.sender, reciver, luckyType);
    }

    function synthesize() public {
        synthesizeHelp(msg.sender);
    }

    function synthesizeHelp(address add) public {
        Lucky storage lucky = happyNewYear[add];
        require(lucky.btc > 0 && lucky.eth > 0 && lucky.eos > 0 && lucky.qtum > 0 && lucky.hnc > 0);
        require(this.balance >= reward);
        lucky.btc--;
        lucky.eth--;
        lucky.eos--;
        lucky.qtum--;
        lucky.hnc--;
        add.transfer(reward);
        awareders.push(add);
        AwaredEvent(add, reward); 
    }

    function changeOwner(address _newOwner) onlyOwner public {
        if (_newOwner != address(0)) {
            owner = _newOwner;
        }
    }
}