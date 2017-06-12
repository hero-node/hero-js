module.exports = function generateView(context) {
    var __$hero$CurrentView;
    if (hasHeroView) {
        __$hero$CurrentView = {
            version: "0",
            backgroundcolor: "ffffff",
            nav: "navigationBarHiddenH5=true;"
        };
        __$hero$CurrentView.views = [];
    }
    var __$hero$CurrentView0;
    if (__$hero$CurrentView) {
        if (showTelephone) {
            __$hero$CurrentView0 = {
                name: "phone",
                type: "phone",
                theme: "green",
                placeholder: "手机号码",
                textfielddidediting: "{ name: 'phone' }"
            };
            __$hero$CurrentView0.size = 14;
            __$hero$CurrentView0.frame = {
                x: '15',
                r: '15',
                y: '115',
                h: '50'
            };
            __$hero$CurrentView.views.push(__$hero$CurrentView0);
        }
    }
    var __$hero$CurrentView1;
    if (__$hero$CurrentView) {
        __$hero$CurrentView1 = {
            frame: "{ w: '1x', h: '1x' }",
            name: "payView",
            hidden: "true",
            backgroundcolor: "000000aa"
        };
        __$hero$CurrentView1.subViews = [];
        __$hero$CurrentView.views.push(__$hero$CurrentView1);
    }
    var __$hero$CurrentView1_0;
    if (__$hero$CurrentView1) {
        __$hero$CurrentView1_0 = {
            frame: "{ r: '5', y: '7', w: '12', h: '12' }",
            image: "/images/close_gray.png"
        };
        __$hero$CurrentView1.subViews.push(__$hero$CurrentView1_0);
    }
    var __$hero$CurrentView2;
    if (__$hero$CurrentView) {
        __$hero$CurrentView2 = {
            name: "password",
            theme: "green",
            secure: "true",
            placeholder: "密码",
            frame: "{ x: '15', r: '15', y: '178', h: '50' }",
            drsecure: "{ secure: true }",
            textfielddidediting: "{ name: 'password' }"
        };
        __$hero$CurrentView.views.push(__$hero$CurrentView2);
    }
    var __$hero$CurrentView3;
    if (__$hero$CurrentView) {
        __$hero$CurrentView3 = {
            name: "loginBtn",
            drstyle: "B1",
            enable: "false",
            frame: "{ x: '15', r: '15', y: '0', h: '44' }",
            yoffset: "password+50",
            title: "登录",
            click: "{ click: 'login' }"
        };
        __$hero$CurrentView.views.push(__$hero$CurrentView3);
    }
    var __$hero$CurrentView4;
    if (__$hero$CurrentView) {
        [0, 1, 2].forEach(function(item, index) {
            __$hero$CurrentView4 = {
                frame: "{ w: '1x', h: '50', b: '0' }",
                text: "Powered by Dianrong.com"
            };
            __$hero$CurrentView.views.push(__$hero$CurrentView4);
        });
    }
    var __$hero$CurrentView5;
    if (__$hero$CurrentView) {
        labels.forEach(function(item) {
            __$hero$CurrentView5 = {
                frame: "{ w: '1x', h: '50', b: '0' }"
            };
            __$hero$CurrentView5.text = item;
            __$hero$CurrentView.views.push(__$hero$CurrentView5);
        });
    }
    var __$hero$CurrentView6;
    if (__$hero$CurrentView) {
        __$hero$CurrentView6 = {
            name: "toast",
            corrnerradius: "10",
            frame: "{ w: '300', h: '44' }",
            center: "{ x: '0.5x', y: '0.5x' }"
        };
        __$hero$CurrentView.views.push(__$hero$CurrentView6);
    };
    return __$hero$CurrentView;
}
code module.exports = function generateView(context) {
    var __$hero$CurrentView;
    if (hasHeroView) {
        __$hero$CurrentView = {
            version: "0",
            backgroundcolor: "ffffff",
            nav: "navigationBarHiddenH5=true;"
        };
        __$hero$CurrentView.views = [];
    }
    var __$hero$CurrentView0;
    if (__$hero$CurrentView) {
        if (showTelephone) {
            __$hero$CurrentView0 = {
                name: "phone",
                type: "phone",
                theme: "green",
                placeholder: "手机号码",
                textfielddidediting: "{ name: 'phone' }"
            };
            __$hero$CurrentView0.size = 14;
            __$hero$CurrentView0.frame = {
                x: '15',
                r: '15',
                y: '115',
                h: '50'
            };
            __$hero$CurrentView.views.push(__$hero$CurrentView0);
        }
    }
    var __$hero$CurrentView1;
    if (__$hero$CurrentView) {
        __$hero$CurrentView1 = {
            frame: "{ w: '1x', h: '1x' }",
            name: "payView",
            hidden: "true",
            backgroundcolor: "000000aa"
        };
        __$hero$CurrentView1.subViews = [];
        __$hero$CurrentView.views.push(__$hero$CurrentView1);
    }
    var __$hero$CurrentView1_0;
    if (__$hero$CurrentView1) {
        __$hero$CurrentView1_0 = {
            frame: "{ r: '5', y: '7', w: '12', h: '12' }",
            image: "/images/close_gray.png"
        };
        __$hero$CurrentView1.subViews.push(__$hero$CurrentView1_0);
    }
    var __$hero$CurrentView2;
    if (__$hero$CurrentView) {
        __$hero$CurrentView2 = {
            name: "password",
            theme: "green",
            secure: "true",
            placeholder: "密码",
            frame: "{ x: '15', r: '15', y: '178', h: '50' }",
            drsecure: "{ secure: true }",
            textfielddidediting: "{ name: 'password' }"
        };
        __$hero$CurrentView.views.push(__$hero$CurrentView2);
    }
    var __$hero$CurrentView3;
    if (__$hero$CurrentView) {
        __$hero$CurrentView3 = {
            name: "loginBtn",
            drstyle: "B1",
            enable: "false",
            frame: "{ x: '15', r: '15', y: '0', h: '44' }",
            yoffset: "password+50",
            title: "登录",
            click: "{ click: 'login' }"
        };
        __$hero$CurrentView.views.push(__$hero$CurrentView3);
    }
    var __$hero$CurrentView4;
    if (__$hero$CurrentView) {
        [0, 1, 2].forEach(function(item, index) {
            __$hero$CurrentView4 = {
                frame: "{ w: '1x', h: '50', b: '0' }",
                text: "Powered by Dianrong.com"
            };
            __$hero$CurrentView.views.push(__$hero$CurrentView4);
        });
    }
    var __$hero$CurrentView5;
    if (__$hero$CurrentView) {
        labels.forEach(function(item) {
            __$hero$CurrentView5 = {
                frame: "{ w: '1x', h: '50', b: '0' }"
            };
            __$hero$CurrentView5.text = item;
            __$hero$CurrentView.views.push(__$hero$CurrentView5);
        });
    }
    var __$hero$CurrentView6;
    if (__$hero$CurrentView) {
        __$hero$CurrentView6 = {
            name: "toast",
            corrnerradius: "10",
            frame: "{ w: '300', h: '44' }",
            center: "{ x: '0.5x', y: '0.5x' }"
        };
        __$hero$CurrentView.views.push(__$hero$CurrentView6);
    };
    return __$hero$CurrentView;
}
