module.exports = function generateView(context) {
    var __$hero$CurrentView;
    __$hero$CurrentView = {
        backgroundcolor: "ffffff",
        class: "HeroView",
        version: (0),
        nav: ({navigationBarHiddenH5: true}),
        views: ([])
    };
    var __$hero$CurrentView0;
    __$hero$CurrentView0 = {
        name: "phone",
        type: "phone",
        theme: "green",
        placeHolder: "手机号码",
        class: "DRTextField",
        frame: ({x: '15', r: '15', y: '115', h: '50'}),
        text - field - did - editing: ({name: 'phone'}),
        subViews: ([])
    };
    var __$hero$CurrentView0_0;
    __$hero$CurrentView0_0 = {
        name: "password",
        theme: "green",
        placeHolder: "密码",
        textFieldDidEditing: "{ name: 'password' }",
        class: "DRTextField",
        secure: (true),
        frame: ({x: '15', r: '15', y: '178', h: '50'}),
        dr - secure: ({secure: true}),
        subViews: ([])
    };
    var __$hero$CurrentView0_0_0;
    __$hero$CurrentView0_0_0 = {
        name: "loginBtn",
        dRStyle: "B1",
        yOffset: "password+50",
        title: "登录",
        class: "DRButton",
        enable: (false),
        frame: ({x: '15', r: '15', y: '0', h: '44'}),
        click: ({click: 'login'}),
        subViews: ([])
    };
    var __$hero$CurrentView0_0_0_0;
    labels.forEach(function(item) {
        __$hero$CurrentView0_0_0_0 = {
            text: "Powered by Dianrong.com",
            alignment: "center",
            class: "HeroLabel",
            frame: ({w: '1x', h: '50', b: '0'}),
            attribute: ({'color(0,10)': 'aaaaaa', 'color(10,13)': '00bc8d', 'size(0,23)': '14'}),
            subViews: ([])
        };
        var __$hero$CurrentView0_0_0_0_0;
        __$hero$CurrentView0_0_0_0_0 = {
            name: "toast",
            class: "HeroToast",
            corrner - radius: (10),
            frame: ({w: '300', h: '44'}),
            center: ({x: '0.5x', y: '0.5x'})
        };
        __$hero$CurrentView0_0_0_0.subViews.push(__$hero$CurrentView0_0_0_0_0);
        __$hero$CurrentView0_0_0.subViews.push(__$hero$CurrentView0_0_0_0);
    });
    __$hero$CurrentView0_0.subViews.push(__$hero$CurrentView0_0_0);
    __$hero$CurrentView0.subViews.push(__$hero$CurrentView0_0);
    __$hero$CurrentView.views.push(__$hero$CurrentView0);;
    return __$hero$CurrentView;
}
module.exports = function generateView(context) {
    var __$hero$CurrentView;
    __$hero$CurrentView = {
        backgroundcolor: "ffffff",
        class: "HeroView",
        version: (0),
        nav: ({navigationBarHiddenH5: true}),
        views: ([])
    };
    var __$hero$CurrentView0;
    __$hero$CurrentView0 = {
        name: "phone",
        type: "phone",
        theme: "green",
        placeHolder: "手机号码",
        class: "DRTextField",
        frame: ({x: '15', r: '15', y: '115', h: '50'}),
        text - field - did - editing: ({name: 'phone'}),
        subViews: ([])
    };
    var __$hero$CurrentView0_0;
    __$hero$CurrentView0_0 = {
        name: "password",
        theme: "green",
        placeHolder: "密码",
        textFieldDidEditing: "{ name: 'password' }",
        class: "DRTextField",
        secure: (true),
        frame: ({x: '15', r: '15', y: '178', h: '50'}),
        dr - secure: ({secure: true}),
        subViews: ([])
    };
    var __$hero$CurrentView0_0_0;
    __$hero$CurrentView0_0_0 = {
        name: "loginBtn",
        dRStyle: "B1",
        yOffset: "password+50",
        title: "登录",
        class: "DRButton",
        enable: (false),
        frame: ({x: '15', r: '15', y: '0', h: '44'}),
        click: ({click: 'login'}),
        subViews: ([])
    };
    var __$hero$CurrentView0_0_0_0;
    labels.forEach(function(item) {
        __$hero$CurrentView0_0_0_0 = {
            text: "Powered by Dianrong.com",
            alignment: "center",
            class: "HeroLabel",
            frame: ({w: '1x', h: '50', b: '0'}),
            attribute: ({'color(0,10)': 'aaaaaa', 'color(10,13)': '00bc8d', 'size(0,23)': '14'}),
            subViews: ([])
        };
        var __$hero$CurrentView0_0_0_0_0;
        __$hero$CurrentView0_0_0_0_0 = {
            name: "toast",
            class: "HeroToast",
            corrner - radius: (10),
            frame: ({w: '300', h: '44'}),
            center: ({x: '0.5x', y: '0.5x'})
        };
        __$hero$CurrentView0_0_0_0.subViews.push(__$hero$CurrentView0_0_0_0_0);
        __$hero$CurrentView0_0_0.subViews.push(__$hero$CurrentView0_0_0_0);
    });
    __$hero$CurrentView0_0.subViews.push(__$hero$CurrentView0_0_0);
    __$hero$CurrentView0.subViews.push(__$hero$CurrentView0_0);
    __$hero$CurrentView.views.push(__$hero$CurrentView0);;
