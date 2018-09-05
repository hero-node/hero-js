window.titleColor = '666666';
window.valueColor = '666666';
window.infoColor = 'cccccc';
window.backgroundColor = 'f6f9fb';
window.maskColor = '212121';
window.tintColor = 'd7ba7e';
window.tintColorL = 'ebaa73';

window.lineView = {class:'UIView',backgroundColor:'eeeeee'}
window.msgButton = {
	class:'HeroButton',
	click:{},
	borderColor:'eeeeee'
}
window.backButton = {
	class:'UIView',
	subViews:[
		{
			class:'HeroImageView',
			frame:{w:'20',h:'20'},
			center:{x:'0.5x',y:'0.5x'},
			image:path+'/images/back.png'
		},
		{
			class:'HeroButton',
			frame:{w:'1x',h:'1x'},
			click:{command:'back'},
		},
	]
}
window.closeBar = {
	class:'UIView',
	frame:{w:'1x',h:'64'},
	border:{bottom:true},
	subViews:[
		{
			class:'HeroImageView',
			frame:{x:'16',y:'32',w:'20',h:'20'},
			image:path+'/images/close.png'
		},
		{
			class:'HeroButton',
			frame:{w:'44',h:'64'},
			click:{command:'dismiss'},
		},
        {
            class:'HeroLabel',
            name:'titleLabel',
            size:18,
            textColor:'333333',
            frame:{w:'1x',h:'47'},
            alignment:'center',
            text:'',
        },
		{
			class:'UIView',
			frame:{w:'1x',h:'1',b:'0'},
			backgroundColor:'eeeeee',
		},
	]
}
window.navBar = {
				class:'UIView',
				frame:{w:'1x',h:'64'},
				gradientBackgroundColor:['4f4f56','262a30'],
				subViews:[
					{
						jsClass:'backButton',
						frame:{x:'5',y:'20',w:'40',h:'44'}
					},
					{
						class:'HeroLabel',
						frame:{y:'20',w:'1x',h:'44'},
						name:'title',
						size:18,
						alignment:'center',
						textColor:'ffffff'
					}
				]
			}
window.bigButton1 = {class:'HeroButton',
    backgroundColor:tintColor,
    backgroundDisabledColor:'cccccc',
    titleDisabledColor:'ffffff',
    titleColor:'ffffff',
    cornerRadius:4,
}