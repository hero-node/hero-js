window.otcABI = [
  {
    constant: false,
    inputs: [],
    name: 'ownerWithdrawEth',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_type',
        type: 'uint256',
      },
      {
        name: '_token',
        type: 'address',
      },
      {
        name: 'amountToken',
        type: 'uint256',
      },
      {
        name: 'amountETH',
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
        name: '_token',
        type: 'address',
      },
    ],
    name: 'removeToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'orderID',
        type: 'bytes32',
      },
    ],
    name: 'cancelOrder',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
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
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'orders',
    outputs: [
      {
        name: 'orderID',
        type: 'bytes32',
      },
      {
        name: 'tradeType',
        type: 'uint256',
      },
      {
        name: 'amountToken',
        type: 'uint256',
      },
      {
        name: 'amountETH',
        type: 'uint256',
      },
      {
        name: 'orderOwner',
        type: 'address',
      },
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'status',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'addr2orderID',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_token',
        type: 'address',
      },
    ],
    name: 'addToken',
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
        type: 'uint256',
      },
    ],
    name: 'orderIDs',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'orderID',
        type: 'bytes32',
      },
    ],
    name: 'trade',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
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
    name: 'tokens',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
    ],
    name: 'ownerWithdrawToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_type',
        type: 'uint256',
      },
      {
        indexed: true,
        name: '_token',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amountToken',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amountETH',
        type: 'uint256',
      },
    ],
    name: 'CreateOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'orderID',
        type: 'bytes32',
      },
    ],
    name: 'Trade',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'target',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'token',
        type: 'address',
      },
    ],
    name: 'WithdrawByOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'orderID',
        type: 'bytes32',
      },
    ],
    name: 'CacelOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipRenounced',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
];

window.otcAddress = '0x9071e067cef783cd31addfc7c9c9760ff88b2ab1';
