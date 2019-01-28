<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Usage**

- [HeroNode FE API](#heronode-api-for-10x)
  - [Getting Started](#getting-started)
    - [Install Hero.js](#install-herojs)
  - [Hero Components](#hero-components)
      - [hero-alert](#herov-alert)
        - [JSON](#json)
      - [hero-button](#hero-button)
        - [JSON](#json-1)
      - [hero-chat-msg-view](#hero-chat-msg-view)
        - [JSON](#json-2)
      - [hero-confirm](#hero-confirm)
        - [JSON](#json-3)
        - [EVENT](#event)
      - [hero-contact-view](#hero-contact-view)
        - [JSON](#json-4)
      - [hero-dialog](#hero-dialog)
        - [JSON](#json-5)
        - [EVENT](#event-1)
      - [hero-image-view](#hero-image-view)
        - [JSON](#json-6)
      - [hero-label](#hero-label)
        - [JSON](#json-7)
      - [hero-loading](#hero-loading)
        - [JSON](#json-8)
      - [hero-location-view](#hero-location-view)
        - [JSON](#json-9)
      - [hero-ocr-view](#hero-ocr-view)
        - [JSON](#json-10)
      - [hero-switch](#hero-switch)
        - [JSON](#json-11)
      - [hero-table-view](#hero-table-view)
        - [hero-table-cell](#hero-table-cell)
          - [JSON](#json-12)
        - [hero-table-section](#hero-table-section)
          - [JSON](#json-13)
          - [EVENT](#event-2)
      - [hero-text-filed](#hero-text-filed)
        - [JSON](#json-14)
        - [EVENT](#event-3)
      - [hero-toast](#hero-toast)
        - [JSON](#json-15)
      - [hero-toolbar-item](#hero-toolbar-item)
        - [JSON](#json-16)
 - [Script for the project](#script-for-the-project)
      - [Compiler.js](#compilerjs)
        - [Introduce](#introduce)
        - [Usage](#usage)
        - [Step](#step)
      - [Deploy.js](#deployjs)
        - [Introduce](#introduce-1)
        - [Usage](#usage-1)
        - [Step](#step-1)
      - [Go.js](#gojs)
        - [Introduce](#introduce-2)
        - [Usage](#usage-2)
        - [Step](#step-2)
 - [How to use it in a project](#how-to-use-it-in-a-project)
    - [The UI](#the-ui)
    - [The Life Cycle](#the-life-cycle)
    
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
 # HeroNode API for 1.0.x
 **Introduce: Hero was a framework to develop crossplatform app. Now it is a framework to develop Dapp**
 ## Getting Started
 * [Install the Hero.js](#install-herojs)
 ### Install Hero.js
 First you need to get hero.js into your project. This can be done using the following methods:
 - `git clone https://github.com/hero-node/hero-js.git`

 - `cd hero-js`

 - `npm install`

Then you need to run the projects:
 - `npm start`

 After that you can open the service at http://127.0.0.1:3000/projects/
<!-- The components' introduce -->
## Hero Components
 ***
 #### hero-alert
 ##### JSON
 `text` - The alert text
 ***
 
 #### hero-button
 ##### JSON
 `title` - The button title

 `disabled` - The button isDisabled
 
 `backgroundDisabledColor` - The button backgroundDisabledColor
 
 `titleColor` - The button titleColor
 
 `backgroundColor` - The button backgroundColor
 
 `size` - The button fontSize
 
 `cornerRadius` - The button borderRadius
 
 `image` - The button image

 ***
 
 #### hero-chat-msg-view
 ##### JSON
 `text` - The chat-msg-view text

 ***
 
 #### hero-confirm
 ##### JSON
 `text` - The confirm text
 
 ##### EVENT
 `open()` - The confirm window opened
 
 `close()` - The confirm window closed
 
 `tapOk()` - User clicked confirm(ok)
 
 `tapCancel()` - User clicked cancel

 ***
 
 #### hero-contact-view
 ##### JSON
 `show` - The contact-view isShow(*only mobile*)

 ***
 
 #### hero-dialog
 ##### JSON
 `text` - The dialog text
 
 ##### EVENT
 `open()` - The dialog window opened
 
 `close()` - The dialog window closed

 ***
 
 #### hero-image-view
 ##### JSON
 `json` - The image-view imageFile(path/base64)

 ***
 
 #### hero-label
 ##### JSON
 `text` - The label text
 
 `size` - The label fontSize
 
 `alignment` - The label textAlign
 
 `textColor` - The label textColor
 
 `weight` - The label fontWeight

 ***
 
 #### hero-loading
 ##### JSON
 `true` - show
 
 `false` -hide

 ***
 
 #### hero-location-view
 ##### JSON
 `fetch_coordinate` - The location-view fetch_coordinate

 ***
 
 #### hero-ocr-view
 ##### JSON
 `type` - The ocr-view type

 ***
 
 #### hero-switch
 ##### JSON
 `value` - The switch isChecked
 
 `click` - The switch click

 ***
 
 #### hero-table-view
 ##### hero-table-cell
 ###### JSON
 `height` - The cell height
 
 `textValue` - The cell textValue
 
 `detail` - The cell detail
 
 `title` - The cell title
 
 `bottomLine` - The cell bottomLine
 
 `size` - The cell size
 
 `color` - The cell color
 
 `image` - The cell image
 
 `accessoryType` - The cell rightButton
 
 `indentationWidth` - The cell titleXoffset
 
  ##### hero-table-section
  ###### JSON
 `sectionTitle` - The cell sectionTitle
 
 `rows` - The cell style
 
 ##### EVENT
 `textChange` - The textView change event

 ***
 
 #### hero-text-filed
 ##### JSON
 `size` - The text-filed size
 
 `textColor` - The text-filed textColor
 
 `clear` - Clear the text-filed
 
 `text` - The text-filed text
 
 `placeHolder` - The text-filed placeHolder
 
 `secure` - The text-filed secure
 
 `type` - The text-filed type
 
 `focus` - The text-filed focus
 
 `blur` - The text-filed blur
 
 ##### EVENT
 `textChange` - The text change event

 ***
 
 #### hero-toast
 ##### JSON
 `position` - The toast position
 
 `text` - The toast text

 ***
 
 #### hero-toolbar-item
 ##### JSON
 `title` - The toolbar title
 
 `image` - The toolbar image

 ***
 
 
 
 # Script for the project
 
 ### Compiler.js
 
#### Introduce
`This script is used to compile solidity.`

***

#### Usage

```
a.install -- web3 solc fs path
b.compile -- node compiler.js
```

#### Step 

```
a. Find in the project if a file in the '.sol' format exists.

b. If so, run this script

c. Generate the corresponding '.abi', '.js', '.json' files
```

***
    
### Deploy.js

#### Introduce
`This script is used to deploy solidity.`

***

#### Usage

```
a.install -- web3 fs path ethereumjs-tx
b.deploy -- node deploy.js
```

#### Step 

```
a. Find in the project if a file in the '.abi', '.json' format exists.
b. Sign with the private key
c. Deploy the contract by sending a transaction
d. Through the web3.eth.getTransactionReceipt() to return the contract deployment of address
d. Generates a contract address file and writes the contract address
```

***

### Go.js

#### Introduce
`Publish the project to geth and ipfs nodes.`

***

#### Usage

```
a.install -- shelljs/global http-proxy-middleware
b.publish -- node go.js
```

#### Step 

```
a. Whether to open ipfs nodes.
b. If not, run 'ipfs daemon'.
c. Whether to open Geth.
d. If not, run 'geth'.
d. Forward ports to '8080' and '8545'
```

***

# How to use it in a project

### The UI

```
Hero.ui = {
    version: -1,
    tintColor: 'bd3a53', //The font color
    // The navigation items' UI and Style
    nav: {
        title: "区块链-集五福", // nav title (string)
        titleColor: 'ffffff', // title color(omit '#')
        navigationBarHidden: false,// Whether the nav bar is displayed(bool)
        leftItems: [{title:'back'},{image:'fu'}]// Upper left item button (eg. Return to previous page)
    },
    // Hero UI item
    views: [
        eg. A button to submit the form
        {
            class:'HeroButton', // Use the Corresponding Hero Component
            ripple: true, //  Whether the effects of clicks is displayed(bool)
            title:'查看奖池',// button content (string)
            titleColor:'999999',// button content text color
            size:12, // fontSize
            // postion: {'w': width, 'h': height, 'l': left, 'r': right, 'b': bottom, 'y': top;} 'x': 100%('0.5x': 50%)
            frame:{r:'10',w:'80',y:'0.5x+32',h:'30'}, 
            // event: This can be handled here or Hero.on = function (data){if (data.click === 'submit'){
            //}}
            // click: {click: 'submit'}
            click:{command:'goto:'+path+'dalao.html'}
        }
    ]
}
```


### The Life Cycle

```
Hero.on() = function (data) {
    <!-- eg. -->
     if (data.click === 'submit') { 
        <!-- The event -->
    }
}
```

```
Hero.viewWillAppear() = function () {
    <!-- The 'viewWillAppear' event -->
}
```

```
Hero.viewWillDisAppear() = function () {
    <!-- The 'viewWillDisAppear' event -->
}
```

```
Hero.viewDidload() = function () {
    <!-- The 'viewDidload' event -->
}
```

