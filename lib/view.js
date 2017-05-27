import { PATH as path } from '../../constant/index';

var getDefaultUIViews = function () {
  
    return {
        version: 0,
        backgroundColor: 'ffffff',
        nav: {
            navigationBarHiddenH5: true
        },
        views: [
            {
                class: 'DRTextField',
                type: 'phone',
                theme: 'green',
                frame: { x: '15', r: '15', y: '115', h: '50' },
                placeHolder: '手机号码',
                name: 'phone',
                textFieldDidEditing: { name: 'phone' }
            },
            {
                class: 'DRTextField',
                theme: 'green',
                frame: { x: '15', r: '15', y: '178', h: '50' },
                placeHolder: '密码',
                secure: true,
                name: 'password',
                drSecure: { 'secure': true }, // 带小眼睛
                textFieldDidEditing: { name: 'password' }
            },
            {
                class: 'DRButton',
                name: 'loginBtn',
                DRStyle: 'B1',
                enable: false,
                frame: { x: '15', r: '15', y: '0', h: '44' },
                yOffset: 'password+50',
                title: '登录',
                click: { click: 'login' }
            },
            {
                class: 'HeroLabel',
                frame: { w: '1x', h: '50', b: '0' },
                text: 'Powered by Dianrong.com',
                alignment: 'center',
                attribute: {
                    'color(0,10)': 'aaaaaa',
                    'color(10,13)': '00bc8d',
                    'size(0,23)': '14'
                }
            },
            {
                class: 'HeroToast',
                name: 'toast',
                corrnerRadius: 10,
                frame: { w: '300', h: '44' },
                center: { x: '0.5x', y: '0.5x' }
            }
        ]
    };
};

export default getDefaultUIViews;
