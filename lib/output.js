function generateView(context) {
    if (hasHeroView) {
        var __$hero$CurrentView = {}; 

        __$hero$CurrentView.version = '0';
        __$hero$CurrentView.backgroundcolor = 'ffffff';
        __$hero$CurrentView.nav = 'navigationBarHiddenH5=true;';
        __$hero$CurrentView.views = [];
    } if (showTelephone) {
        var __$hero$CurrentView0 = {};

        __$hero$CurrentView0.name = 'phone';
        __$hero$CurrentView0.type = 'phone';
        __$hero$CurrentView0.theme = 'green';
        __$hero$CurrentView0.placeholder = '手机号码';
        __$hero$CurrentView0.frame = '{ x: \'15\', r: \'15\', y: \'115\', h: \'50\' }';
        __$hero$CurrentView0.textfielddidediting = '{ name: \'phone\' }';
        __$hero$CurrentView.views.push(__$hero$CurrentView0);
    }
    var __$hero$CurrentView1 = {}; 

    __$hero$CurrentView1.frame = '{ w: \'1x\', h: \'1x\' }';
    __$hero$CurrentView1.name = 'payView';
    __$hero$CurrentView1.hidden = 'true';
    __$hero$CurrentView1.backgroundcolor = '000000aa';
    __$hero$CurrentView1.subViews = [];
    __$hero$CurrentView.views.push(__$hero$CurrentView1);
    var __$hero$CurrentView1_0 = {};

    __$hero$CurrentView1_0.frame = '{ r: \'5\', y: \'7\', w: \'12\', h: \'12\' }';
    __$hero$CurrentView1_0.image = '/images/close_gray.png';
    __$hero$CurrentView1.subViews.push(__$hero$CurrentView1_0);
    var __$hero$CurrentView2 = {};

    __$hero$CurrentView2.name = 'password';
    __$hero$CurrentView2.theme = 'green';
    __$hero$CurrentView2.secure = 'true';
    __$hero$CurrentView2.placeholder = '密码';
    __$hero$CurrentView2.frame = '{ x: \'15\', r: \'15\', y: \'178\', h: \'50\' }';
    __$hero$CurrentView2.drsecure = '{ secure: true }';
    __$hero$CurrentView2.textfielddidediting = '{ name: \'password\' }';
    __$hero$CurrentView.views.push(__$hero$CurrentView2);
    var __$hero$CurrentView3 = {};

    __$hero$CurrentView3.name = 'loginBtn';
    __$hero$CurrentView3.drstyle = 'B1';
    __$hero$CurrentView3.enable = 'false';
    __$hero$CurrentView3.frame = '{ x: \'15\', r: \'15\', y: \'0\', h: \'44\' }';
    __$hero$CurrentView3.yoffset = 'password+50';
    __$hero$CurrentView3.title = '登录';
    __$hero$CurrentView3.click = '{ click: \'login\' }';
    __$hero$CurrentView.views.push(__$hero$CurrentView3);
    [0, 1, 2].forEach(function (item, index) {
        var __$hero$CurrentView4 = {};

        __$hero$CurrentView4.frame = '{ w: \'1x\', h: \'50\', b: \'0\' }';
        __$hero$CurrentView4.text = 'Powered by Dianrong.com';
        __$hero$CurrentView.views.push(__$hero$CurrentView4); 
    });
    labels.forEach(function (item, index) {
        var __$hero$CurrentView5 = {}; 

        __$hero$CurrentView5.frame = '{ w: \'1x\', h: \'50\', b: \'0\' }';
        __$hero$CurrentView5.text = '${item}';
        __$hero$CurrentView.views.push(__$hero$CurrentView5); 
    });
    var __$hero$CurrentView6 = {}; 

    __$hero$CurrentView6.name = 'toast';
    __$hero$CurrentView6.corrnerradius = '10';
    __$hero$CurrentView6.frame = '{ w: \'300\', h: \'44\' }';
    __$hero$CurrentView6.center = '{ x: \'0.5x\', y: \'0.5x\' }';
    __$hero$CurrentView.views.push(__$hero$CurrentView6);
    return __$hero$CurrentView; 
}
