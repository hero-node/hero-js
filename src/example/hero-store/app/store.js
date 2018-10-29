window.storeABI = [
  {
    constant: false,
    inputs: [
      {
        name: '_seller',
        type: 'address',
      },
      {
        name: 'id',
        type: 'bytes32',
      },
    ],
    name: 'adminRefundOrder',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: 'ids',
        type: 'bytes32[]',
      },
    ],
    name: 'batchLiquidationOrders',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: 'name',
        type: 'bytes32',
      },
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'startDate',
        type: 'uint256',
      },
      {
        name: 'auctionPeriod',
        type: 'uint256',
      },
      {
        name: 'revealPeriod',
        type: 'uint256',
      },
      {
        name: 'info',
        type: 'bytes32',
      },
    ],
    name: 'createAuctionCommodity',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: 'name',
        type: 'bytes32',
      },
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
      {
        name: 'info',
        type: 'bytes32',
      },
    ],
    name: 'createCommodity',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: '_seller',
        type: 'address',
      },
      {
        name: 'product',
        type: 'bytes32',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'createOrder',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'commission',
        type: 'uint256',
      },
      {
        name: 'payment',
        type: 'address',
      },
    ],
    name: 'createRetailer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
      {
        name: 'maximum',
        type: 'uint256',
      },
    ],
    name: 'createSeller',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: 'name',
        type: 'bytes32',
      },
    ],
    name: 'deleleCommodity',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: '_seller',
        type: 'address',
      },
      {
        name: 'name',
        type: 'bytes32',
      },
    ],
    name: 'finalizeAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
    name: 'forbiddenSeller',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: 'id',
        type: 'bytes32',
      },
    ],
    name: 'liquidationOrders',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'sealedBid',
        type: 'bytes32',
      },
      {
        name: 'payment',
        type: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'newBid',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: 'id',
        type: 'bytes32',
      },
    ],
    name: 'refundOrder',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: '_seller',
        type: 'address',
      },
      {
        name: 'id',
        type: 'bytes32',
      },
    ],
    name: 'safeguardingOrder',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'advertisement',
        type: 'bytes32',
      },
    ],
    name: 'setRetailerAdvertisement',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'info',
        type: 'bytes32',
      },
    ],
    name: 'setRetailerInfo',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: 'info',
        type: 'bytes32',
      },
    ],
    name: 'setSellerInfo',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_retailer',
        type: 'address',
      },
      {
        name: '_seller',
        type: 'address',
      },
      {
        name: 'name',
        type: 'bytes32',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_salt',
        type: 'bytes32',
      },
    ],
    name: 'unsealBid',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'entries',
    outputs: [
      {
        name: 'deed',
        type: 'address',
      },
      {
        name: 'startDate',
        type: 'uint256',
      },
      {
        name: 'auctionPeriod',
        type: 'uint256',
      },
      {
        name: 'revealPeriod',
        type: 'uint256',
      },
      {
        name: 'payment',
        type: 'address',
      },
      {
        name: 'minPrice',
        type: 'uint256',
      },
      {
        name: 'value',
        type: 'uint256',
      },
      {
        name: 'highestBid',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'retailer',
        type: 'address',
      },
      {
        name: 'seller',
        type: 'address',
      },
      {
        name: 'name',
        type: 'bytes32',
      },
    ],
    name: 'hash',
    outputs: [
      {
        name: '_hash',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'retailer',
        type: 'address',
      },
      {
        name: 'seller',
        type: 'address',
      },
      {
        name: 'name',
        type: 'bytes32',
      },
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
      },
      {
        name: 'salt',
        type: 'bytes32',
      },
    ],
    name: 'keccak256Bid',
    outputs: [
      {
        name: 'sealedBid',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'mall',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
      {
        name: 'commission',
        type: 'uint256',
      },
      {
        name: 'payment',
        type: 'address',
      },
      {
        name: 'info',
        type: 'bytes32',
      },
      {
        name: 'advertisement',
        type: 'bytes32',
      },
      {
        name: 'locked',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'sealedBids',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_hash',
        type: 'bytes32',
      },
    ],
    name: 'state',
    outputs: [
      {
        name: '_state',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

window.storeAddress = '0xFbfC8D722CaAc377A58794fD78d77Dbe2ed356B5';
window.ethProvider = 'http://127.0.0.1:7545';

// window.copyTextToClipboard = function(text){
//     var textArea = document.createElement("textarea")
//     textArea.style.position = 'fixed'
//     textArea.style.top = 0
//     textArea.style.left = 0
//     textArea.style.width = '2em'
//     textArea.style.height = '2em'
//     textArea.style.padding = 0
//     textArea.style.border = 'none'
//     textArea.style.outline = 'none'
//     textArea.style.boxShadow = 'none'
//     textArea.style.background = 'transparent'
//     textArea.value = text

//     document.body.appendChild(textArea)

//     textArea.select()

//     try {
//       var msg = document.execCommand('copy') ? '成功' : '失败'
//       Hero.datas({name:'toast',text:'已复制'});
//     } catch (err) {
//       Hero.datas({name:'toast',text:'复制失败'});
//     }
//     document.body.removeChild(textArea)
// }
