function HeroView_(element, view) {
    view.version = '0';
    view.backgroundcolor = 'ffffff';
    view.nav = 'navigationBarHiddenH5=true;';
    return view;
}
function DRTextField_0(element, view) {
    view.name = 'phone';
    view.type = 'phone';
    view.theme = 'green';
    view.placeholder = '手机号码';
    view.frame = '{ x: \'15\', r: \'15\', y: \'115\', h: \'50\' }';
    view.textfielddidediting = '{ name: \'phone\' }';
    return view;
}
function UIView_1(element, view) {
    view.frame = '{ w: \'1x\', h: \'1x\' }';
    view.name = 'payView';
    view.hidden = 'true';
    view.backgroundcolor = '000000aa';
    return view;
}
function HeroImageView_1_0(element, view) {
    view.frame = '{ r: \'5\', y: \'7\', w: \'12\', h: \'12\' }';
    view.image = '/images/close_gray.png';
    return view;
}
function DRTextField_2(element, view) {
    view.name = 'password';
    view.theme = 'green';
    view.secure = 'true';
    view.placeholder = '密码';
    view.frame = '{ x: \'15\', r: \'15\', y: \'178\', h: \'50\' }';
    view.drsecure = '{ secure: true }';
    view.textfielddidediting = '{ name: \'password\' }';
    return view;
}
function DRButton_3(element, view) {
    view.name = 'loginBtn';
    view.drstyle = 'B1';
    view.enable = 'false';
    view.frame = '{ x: \'15\', r: \'15\', y: \'0\', h: \'44\' }';
    view.yoffset = 'password+50';
    view.title = '登录';
    view.click = '{ click: \'login\' }';
    return view;
}
function HeroLabel_4(element, view) {
    view.frame = '{ w: \'1x\', h: \'50\', b: \'0\' }';
    view.text = 'Powered by Dianrong.com';
    return view;
}
function HeroLabel_5(element, view) {
    view.frame = '{ w: \'1x\', h: \'50\', b: \'0\' }';
    view.text = '${item}';
    return view;
}
function HeroToast_6(element, view) {
    view.name = 'toast';
    view.corrnerradius = '10';
    view.frame = '{ w: \'300\', h: \'44\' }';
    view.center = '{ x: \'0.5x\', y: \'0.5x\' }';
    return view;
}

var _treeObject = {
    '0': {
        'key': 'DRTextField_0',
        'expressions': {
            'if': 'showTelephone'
        }
    },
    '1': {
        'key': 'UIView_1',
        'expressions': {}
    },
    '2': {
        'key': 'DRTextField_2',
        'expressions': {}
    },
    '3': {
        'key': 'DRButton_3',
        'expressions': {}
    },
    '4': {
        'key': 'HeroLabel_4',
        'expressions': {
            'for': '(item, index) in [0, 1, 2]'
        }
    },
    '5': {
        'key': 'HeroLabel_5',
        'expressions': {
            'for': '(item, index) in labels'
        }
    },
    '6': {
        'key': 'HeroToast_6',
        'expressions': {}
    },
    '': {
        'key': 'HeroView_',
        'expressions': {
            'if': 'hasHeroView'
        }
    },
    '1_0': {
        'key': 'HeroImageView_1_0',
        'expressions': {}
    }
};
var KEYS = [
    '',
    '0',
    '1',
    '1_0',
    '2',
    '3',
    '4',
    '5',
    '6'
];

function exractVariables(expression) {
    return ['hasHeroView'];
}
function treeObject() {
    var idx, len, expressions;

    for (idx = 0, len = KEYS.length; idx < len; idx++) {
        expressions = treeObject[KEYS[idx]].expressions;
        if (expressions.for) {

        }
        if (expressions.if) {

        }
    }
}
function generateViews(context) {
    var idx, len, expressions;

    for (idx = 0, len = KEYS.length; idx < len; idx++) {
        expressions = treeObject[KEYS[idx]].expressions;
        if (expressions.if) {

        }
    }
}
function getViews(element) {

    if (!element) {
        return null;
    }
    var condition = element.condition;

    if (!condition()) {
        return null;
    }
    var view = mappings[element].call(null, element, {});

    var children = element.children;

    if (children) {
        view.subViews = [];
    }
    var idx,
        len,
        _subViews;

    for (idx = 0, len = children.length; idx < len; idx++) {
        _subViews = getViews(children[idx]);

        if (_subViews) {
            view.subViews.push(_subViews);
        }
    }
}
