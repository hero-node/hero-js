{
    "backgroundcolor": "ffffff",
    "version": 0,
    "nav": {
        "navigationBarHiddenH5": true
    },
    "views": [
        {
            "name": "phone",
            "type": "phone",
            "theme": "green",
            "placeHolder": "手机号码",
            "class": "DRTextField",
            "frame": {
                "x": "15",
                "r": "15",
                "y": "115",
                "h": "50"
            },
            "textFieldDidEditing": {
                "name": "phone"
            }
        }, {
            "name": "password",
            "theme": "green",
            "placeHolder": "密码",
            "textFieldDidEditing": "{ name: 'password' }",
            "class": "DRTextField",
            "secure": true,
            "frame": {
                "x": "15",
                "r": "15",
                "y": "178",
                "h": "50"
            },
            "drSecure": {
                "secure": false
            }
        }, {
            "text": "Powered by Dianrong.com",
            "alignment": "center",
            "class": "HeroLabel",
            "frame": {
                "w": "1x",
                "h": "50",
                "b": "0"
            },
            "attribute": {
                "color(0,10)": "aaaaaa",
                "color(10,13)": "00bc8d",
                "size(0,23)": "14"
            },
            "subViews": [
                {
                    "name": "loginBtn",
                    "dRStyle": "B1",
                    "yOffset": "password+50",
                    "title": "登录",
                    "class": "DRButton",
                    "enable": true,
                    "frame": {
                        "x": "15",
                        "r": "15",
                        "y": "0",
                        "h": "44"
                    },
                    "click": {
                        "click": "login"
                    }
                }
            ]
        }, {
            "text": "Powered by Dianrong.com",
            "alignment": "center",
            "class": "HeroLabel",
            "frame": {
                "w": "1x",
                "h": "50",
                "b": "0"
            },
            "attribute": {
                "color(0,10)": "aaaaaa",
                "color(10,13)": "00bc8d",
                "size(0,23)": "14"
            },
            "subViews": [
                {
                    "name": "loginBtn",
                    "dRStyle": "B1",
                    "yOffset": "password+50",
                    "title": "登录",
                    "class": "DRButton",
                    "enable": true,
                    "frame": {
                        "x": "15",
                        "r": "15",
                        "y": "0",
                        "h": "44"
                    },
                    "click": {
                        "click": "login"
                    }
                }
            ]
        }, {
            "text": "Powered by Dianrong.com",
            "alignment": "center",
            "class": "HeroLabel",
            "frame": {
                "w": "1x",
                "h": "50",
                "b": "0"
            },
            "attribute": {
                "color(0,10)": "aaaaaa",
                "color(10,13)": "00bc8d",
                "size(0,23)": "14"
            },
            "subViews": [
                {
                    "name": "loginBtn",
                    "dRStyle": "B1",
                    "yOffset": "password+50",
                    "title": "登录",
                    "class": "DRButton",
                    "enable": true,
                    "frame": {
                        "x": "15",
                        "r": "15",
                        "y": "0",
                        "h": "44"
                    },
                    "click": {
                        "click": "login"
                    }
                }
            ]
        }, {
            "name": "toast",
            "class": "HeroToast",
            "corrnerRadius": 10,
            "frame": {
                "w": "300",
                "h": "44"
            },
            "center": {
                "x": "0.5x",
                "y": "0.5x"
            }
        }
    ]
}
