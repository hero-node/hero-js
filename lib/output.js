function generateView(context) {
    var state = context.state;

    var __$hero$CurrentView;

    __$hero$CurrentView = {
        backgroundcolor: 'ffffff',
        version: (0),
        nav: ({ navigationBarHiddenH5: true }),
        views: ([])
    };
    var __$hero$CurrentView0;

    __$hero$CurrentView0 = {
        name: 'phone',
        type: 'phone',
        theme: 'green',
        placeHolder: '手机号码',
        __$hero_class: 'DRTextField_0',
        class: 'DRTextField',
        frame: ({ x: '15', r: '15', y: '115', h: '50' }),
        textFieldDidEditing: ({ name: 'phone' })
    };
    __$hero$CurrentView.views.push(__$hero$CurrentView0);
    var __$hero$CurrentView1;

    __$hero$CurrentView1 = {
        name: 'password',
        theme: 'green',
        placeHolder: '密码',
        __$hero_class: 'DRTextField_1',
        class: 'DRTextField',
        secure: (true),
        frame: ({ x: '15', r: '15', y: '178', h: '50' }),
        drSecure: ({ secure: true }),
        textFieldDidEditing: ({ name: 'password' })
    };
    __$hero$CurrentView.views.push(__$hero$CurrentView1);
    var __$hero$CurrentView2;

    __$hero$CurrentView2 = {
        name: 'loginBtn',
        DRStyle: 'B1',
        yOffset: 'password+50',
        title: '登录',
        __$hero_class: 'DRButton_2',
        class: 'DRButton',
        enable: (state.isLoginEnable),
        frame: ({ x: '15', r: '15', y: '0', h: '44' }),
        click: ({ click: 'login' })
    };
    __$hero$CurrentView.views.push(__$hero$CurrentView2);
    var __$hero$CurrentView3;

    __$hero$CurrentView3 = {
        text: 'Powered by Dianrong.com',
        alignment: 'center',
        __$hero_class: 'HeroLabel_3',
        class: 'HeroLabel',
        frame: ({ w: '1x', h: '50', b: '0' }),
        attribute: ({ 'color(0,10)': 'aaaaaa', 'color(10,13)': '00bc8d', 'size(0,23)': '14' })
    };
    __$hero$CurrentView.views.push(__$hero$CurrentView3);
    var __$hero$CurrentView4;

    __$hero$CurrentView4 = {
        name: 'toast',
        __$hero_class: 'HeroToast_4',
        class: 'HeroToast',
        corrnerRadius: (10),
        frame: ({ w: '300', h: '44' }),
        center: ({ x: '0.5x', y: '0.5x' })
    };
    __$hero$CurrentView.views.push(__$hero$CurrentView4);
    return __$hero$CurrentView;
}
generateView._template = {
    'key': 'HeroView_',
    'childrens': [
        {
            'key': 'DRTextField_0',
            'dynamic': false,
            'exist': '{1}'
        }, {
            'key': 'DRTextField_1',
            'dynamic': false,
            'exist': '{1}'
        }, {
            'key': 'DRButton_2',
            'dynamic': ['enable'],
            'exist': '{1}'
        }, {
            'key': 'HeroLabel_3',
            'dynamic': false,
            'exist': '{1}'
        }, {
            'key': 'HeroToast_4',
            'dynamic': false,
            'exist': '{1}'
        }
    ],
    'dynamic': false,
    'exist': '{1}'
};
generateView._viewName = 'HeroView_';
generateView._className = '__$hero_class';
module.exports = generateView;

// ////////////////
// WEBPACK FOOTER
// ./src/pages/login/view.hero.xml
// module id = 43
// module chunks = 3
