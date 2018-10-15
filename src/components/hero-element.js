export default class HeroElement extends HTMLElement {
  constructor() {
    super();
    this._on();
  }

  static get customName() {
    return this.name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .substring(1);
  }
  _on(json) {
    this._json = Object.assign(this._json || {}, json);
    if (!this.shadowDom) {
      this.shadowDom = this.attachShadow({ mode: 'open' });

      let templateHtml = '';
      if (this.template) {
        templateHtml = this.template(json || {});
      }
      this.shadowDom.innerHTML = this.wrapperTemplate(templateHtml);
      this.init && this.init(json || {});
    }
    this.in(json || {});
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._on(JSON.parse(newValue));
  }

  static get observedAttributes() {
    return ['json'];
  }

  setController(controller) {
    if (!this.$) {
      this.$ = {};
    }
    var i, child;
    if (!this.$.heroContent) {
      this.$.heroContent = this.shadowDom.querySelector('#heroContent');
    }
    this.controller = controller;

    if (this.$.heroContent) {
      // for (i = 0; i < this.$.heroContent.children.length; i++) {
      //   child = this.$.heroContent.children[i];
      //   if (child.setController) {
      //     child.controller = controller;
      //   }
      // }

      this.shadowDom.querySelectorAll('#heroContent *').forEach(function(ele) {
        if (ele.setController) {
          ele.controller = controller;
        }
      });
    }
  }

  getParentSize(node) {
    var p = node.parentElement;
    if (p) {
      if (
        p.getBoundingClientRect().width > 0 &&
        p.getBoundingClientRect().height > 0
      ) {
        return {
          w: p.getBoundingClientRect().width,
          h: p.getBoundingClientRect().height,
        };
      } else if (p.style.width.substr(p.style.width.length - 2, 2) == 'px') {
        return {
          w:
            parseFloat(p.style.width) != 0
              ? parseFloat(p.style.width)
              : window.innerWidth,
          h:
            parseFloat(p.style.height) != 0
              ? parseFloat(p.style.height)
              : window.innerHeight,
        };
      } else {
        return this.getParentSize(p);
      }
    }
    return { w: window.innerWidth, h: window.innerHeight };
  }
  calcStr(x, p) {
    let xInt, x1, x2;
    if (x.split('+').length > 1) {
      x1 = x.split('+')[0];
      x2 = x.split('+')[1];
      xInt =
        (x1.charAt(x1.length - 1) === 'x'
          ? parseFloat(x1) * p
          : parseFloat(x1)) +
        (x2.charAt(x2.length - 1) === 'x'
          ? parseFloat(x2) * p
          : parseFloat(x2));
    } else if (x.split('-').length > 1) {
      x1 = x.split('-')[0] || '0';
      x2 = x.split('-')[1];
      xInt =
        (x1.charAt(x1.length - 1) === 'x'
          ? parseFloat(x1) * p
          : parseFloat(x1)) -
        (x2.charAt(x2.length - 1) === 'x'
          ? parseFloat(x2) * p
          : parseFloat(x2));
    } else {
      xInt = x.charAt(x.length - 1) === 'x' ? parseFloat(x) * p : parseFloat(x);
    }
    return xInt;
  }
  in(json) {
    if (!json || Object.keys(json).length === 0) {
      return;
    }
    this._in(json);
    this.on && this.on(json);

    if (json && json.ripple) {
      var mobile = (/iphone|ipad|ipod|android|blackberry|mini|palm/i.test(navigator.userAgent.toLowerCase()));

      if (mobile) {
        var that = this;
        this.$.heroContent.addEventListener(
          'touchstart',
          function(e) {
            // Remove any old one
            var effectHolder = this.shadowDom.querySelector('#ripple');
            effectHolder && effectHolder.remove();

            var boundingRect = this.$.heroContent.getBoundingClientRect();
            // Setup
            var posX = boundingRect.left,
              posY = boundingRect.top,
              buttonWidth = boundingRect.width,
              buttonHeight = boundingRect.height;

            // Add the element
            effectHolder = document.createElement('div');
            effectHolder.id = 'ripple';
            effectHolder.className = 'ripple';
            this.$.heroContent.append(effectHolder);

            // Make it round!
            if (buttonWidth < buttonHeight) {
              buttonHeight = buttonWidth;
            } else {
              buttonWidth = buttonHeight;
            }
            var touchPositon = e.touches[0];
            var x = 0,
              y = 0;
            if (touchPositon) {
              var x =
                (touchPositon.pageX || touchPositon.clientX) -
                posX -
                buttonWidth / 2;
              var y =
                (touchPositon.pageY || touchPositon.clientY) -
                posY -
                buttonHeight / 2;
            }
            // Get the center of the element

            var effectWave = document.createElement('div');
            // Add the ripples CSS and start the animation
            effectWave.style.cssText =
              'width: ' +
              buttonWidth +
              'px;height: ' +
              buttonHeight +
              'px;top:' +
              y +
              'px;left: ' +
              x +
              'px';
            effectWave.classList.add('rippleWave');
            if (json.backgroundColor === 'fff' || json.backgroundColor === 'ffffff') {
              effectWave.classList.add('rippleWaveDark');
            }else{
              effectWave.classList.add('rippleWaveLight');
            }

            effectHolder.append(effectWave);
          }.bind(this));
        }else{
          this.$.heroContent.addEventListener(
          'mousedown',
          function(e) {
            // Remove any old one
            var effectHolder = this.shadowDom.querySelector('#ripple');
            effectHolder && effectHolder.remove();

            var boundingRect = this.$.heroContent.getBoundingClientRect();
            // Setup
            var posX = boundingRect.left,
              posY = boundingRect.top,
              buttonWidth = boundingRect.width,
              buttonHeight = boundingRect.height;

            // Add the element
            effectHolder = document.createElement('div');
            effectHolder.id = 'ripple';
            effectHolder.className = 'ripple';
            this.$.heroContent.append(effectHolder);

            // Make it round!
            if (buttonWidth < buttonHeight) {
              buttonHeight = buttonWidth;
            } else {
              buttonWidth = buttonHeight;
            }
            var touchPositon = e;
            var x = 0,
              y = 0;
            if (touchPositon) {
              var x =
                (touchPositon.pageX || touchPositon.clientX) -
                posX -
                buttonWidth / 2;
              var y =
                (touchPositon.pageY || touchPositon.clientY) -
                posY -
                buttonHeight / 2;
            }
            // Get the center of the element

            var effectWave = document.createElement('div');
            // Add the ripples CSS and start the animation
            effectWave.style.cssText =
              'width: ' +
              buttonWidth +
              'px;height: ' +
              buttonHeight +
              'px;top:' +
              y +
              'px;left: ' +
              x +
              'px';
            effectWave.classList.add('rippleWave');
            if (json.backgroundColor === 'fff' || json.backgroundColor === 'ffffff') {
              effectWave.classList.add('rippleWaveDark');
            }else{
              effectWave.classList.add('rippleWaveLight');
            }

            effectHolder.append(effectWave);
          }.bind(this));
        };
    }
  }
  _in(json) {
    this._json = Object.assign(this._json || {}, json);
    if (!this.$) {
      this.$ = {};
    }
    if (!this.$.heroContent) {
      this.$.heroContent = this.shadowDom.querySelector('#heroContent');
    }
    if (typeof json === 'string') {
      this.json = eval('(' + decodeURIComponent(json) + ')');
      return;
    }

    var x, y, w, h, r, b, frame;

    if (json !== undefined) {
      if (!this.json) {
        this.json = json;
      } else if (window.APP) {
        window.APP.merge(this.json, json);
      }
      if (json.name) {
        this.id = json.name;
      }
      if (json.frame) {
        if (!json.frame.p) {
          json.frame.p = this.getParentSize(this);
        }
        frame = json.frame;
        x = frame.x ? frame.x : frame.l;
        y = frame.y ? frame.y : frame.t;
        w = frame.w;
        h = frame.h;
        r = frame.r;
        b = frame.b;
        var xInt, yInt, wInt, hInt;
        if (x) {
          xInt = this.calcStr(x, json.frame.p.w);
        }
        if (y) {
          yInt = this.calcStr(y, json.frame.p.h);
        }
        if (w) {
          wInt = this.calcStr(w, json.frame.p.w);
        }
        if (h) {
          hInt = this.calcStr(h, json.frame.p.h);
        }
        if (r) {
          if (!x) {
            xInt = frame.p.w - (wInt + this.calcStr(r, json.frame.p.w));
          } else {
            wInt = frame.p.w - (xInt + this.calcStr(r, json.frame.p.w));
          }
        }
        if (b) {
          if (!y) {
            yInt = frame.p.h - (hInt + this.calcStr(b, json.frame.p.h));
          } else {
            hInt = frame.p.h - (yInt + this.calcStr(b, json.frame.p.h));
          }
        }
        this.$.heroContent.style.left = xInt + 'px';
        this.$.heroContent.style.top = yInt + 'px';

        this.$.heroContent.style.width = wInt + 'px';
        this.$.heroContent.style.height = hInt + 'px';

        this.height = hInt;
        var refName, offset, top, heroContent;

        if (this.json.yOffset) {
          refName = this.json.yOffset.split(/\+/)[0];
          offset = parseFloat(this.json.yOffset.split(/\+/)[1]);
          top = this.controller.findViewByname(
            refName,
            this.controller.heroContent
          );
          top =
            top || this.controller.findViewByname(refName, this.parentElement);
          if (top) {
            heroContent = top.$.heroContent;
            if (heroContent.style.top && heroContent.style.top !== 'auto') {
              h = heroContent.style.height
                ? parseFloat(heroContent.style.height)
                : 0;
              var ctop = parseFloat(heroContent.style.top) + h + offset;
              this.$.heroContent.style.top = ctop + 'px';
              this.top = ctop;
              this.json.frame.y = ctop + '';
              yInt = ctop;
            }
            if (!top.heroLayoutListenners) {
              top.heroLayoutListenners = [];
            }
            if (!window.APP.contain(top.heroLayoutListenners, this)) {
              top.heroLayoutListenners.push(this);
            }
          }
        }
        if (this.json.xOffset) {
          refName = this.json.xOffset.split(/\+/)[0];
          offset = parseFloat(this.json.xOffset.split(/\+/)[1]);
          top = this.controller.findViewByname(
            refName,
            this.controller.heroContent
          );
          top =
            top || this.controller.findViewByname(refName, this.parentElement);
          if (top) {
            heroContent = top.$.heroContent;
            if (heroContent.style.left && heroContent.style.left !== 'auto') {
              w = heroContent.style.width
                ? parseFloat(heroContent.style.width)
                : 0;
              ctop = parseFloat(heroContent.style.left) + w + offset;
              this.$.heroContent.style.left = ctop + 'px';
              this.left = ctop;
              this.json.frame.x = ctop + '';
              xInt = ctop;
            }
            if (!top.heroLayoutListenners) {
              top.heroLayoutListenners = [];
            }
            if (!window.APP.contain(top.heroLayoutListenners, this)) {
              top.heroLayoutListenners.push(this);
            }
          }
        }
        if (this.json.contentSizeElement) {
          if (this.$.heroContent.style.display != 'none' && this.parent) {
            this.parent.json.frame.h = yInt + hInt + '';
            this.parent.json.frame.w = xInt + wInt + '';
            frame = this.parent.json.frame;
            this.parent.oon({ frame: frame });
          }
        }
        if (this.json.contentSizeElementY) {
          if (this.$.heroContent.style.display != 'none' && this.parent) {
            this.parent.json.frame.h =
              parseFloat(this.$.heroContent.style.top) +
              parseFloat(this.$.heroContent.style.height) +
              '';
            frame = this.parent.json.frame;
            this.parent.oon({ frame: frame });
          }
        }
        if (this.heroLayoutListenners) {
          for (var i = 0; i < this.heroLayoutListenners.length; i++) {
            var o = this.heroLayoutListenners[i];
            o.oon({ frame: o.json.frame, yOffset: o.json.yOffset });
          }
        }
      }
      if (this.json.center) {
        frame = this.json.frame || {};
        if (!this.json.frame || !this.json.frame.p) {
          frame.p = { w: window.screen.width, h: window.screen.height };
        }
        w = this.$.heroContent.style.width;
        h = this.$.heroContent.style.height;
        x = this.json.center.x;
        y = this.json.center.y;
        if (x) {
          wInt = parseFloat(w);
          xInt =
            x.charAt(x.length - 1) === 'x'
              ? parseFloat(x) * frame.p.w
              : parseFloat(x);
          this.$.heroContent.style.left = xInt - wInt / 2 + 'px';
        }
        if (y) {
          hInt = parseFloat(h);
          yInt =
            y.charAt(y.length - 1) === 'x'
              ? parseFloat(y) * frame.p.h
              : parseFloat(y);
          this.$.heroContent.style.top = yInt - hInt / 2 + 'px';
        }
      }
      if (json.alpha) {
        this.$.heroContent.style.opacity = json.alpha;
      }
      if (json.backgroundColor) {
        this.$.heroContent.style.background = window.APP.str2Color(
          json.backgroundColor
        );
      }
      if (json.tinyColor) {
        this.$.heroContent.style.color = '#' + json.tinyColor;
      }
      if (json.hasOwnProperty('hidden')) {
        if (json.hidden) {
          if (this.json.contentSizeElementY) {
            this.parent.json.frame.h =
              parseFloat(this.$.heroContent.style.top) + '';
            frame = this.parent.json.frame;
            this.parent.oon({ frame: frame });
          }
          this.$.heroContent.style.display = 'none';
        } else {
          if (this.json.contentSizeElementY) {
            this.parent.json.frame.h =
              parseFloat(this.$.heroContent.style.top) +
              parseFloat(this.$.heroContent.style.height) +
              '';
            frame = this.parent.json.frame;
            this.parent.oon({ frame: frame });
          }
          this.$.heroContent.style.display = 'block';
        }
      }
      if (json.hasOwnProperty('h5_hidden')) {
        if (json.h5_hidden) {
          this.$.heroContent.style.display = 'none';
        } else {
          this.$.heroContent.style.display = 'block';
        }
      }
      if (json.borderWidth) {
        this.$.heroContent.style.borderStyle = 'solid';
        this.$.heroContent.style.borderWidth = json.borderWidth + 'px';
      }
      if (json.cornerRadius) {
        this.$.heroContent.style.borderRadius = json.cornerRadius + 'px';
      }
      if (json.borderColor) {
        this.$.heroContent.style.border =
          (json.borderWidth ? json.borderWidth : 1) +
          'px solid #' +
          json.borderColor;
      }
      if (json.zIndex) {
        this.$.heroContent.style.zIndex = json.zIndex;
      }
      if (json.dashBorder) {
        var dash = json.dashBorder;
        var color = dash.color;
        if (dash.left) {
          this.$.heroContent.style.borderLeftColor = '#' + color;
          this.$.heroContent.style.borderLeftStyle = 'dashed';
          this.$.heroContent.style.borderLeftWidth = '1px';
        }
        if (dash.right) {
          this.$.heroContent.style.borderRightColor = '#' + color;
          this.$.heroContent.style.borderRightStyle = 'dashed';
          this.$.heroContent.style.borderRightWidth = '1px';
        }
        if (dash.bottom) {
          this.$.heroContent.style.borderBottomColor = '#' + color;
          this.$.heroContent.style.borderBottomStyle = 'dashed';
          this.$.heroContent.style.borderBottomWidth = '1px';
        }
        if (dash.top) {
          this.$.heroContent.style.borderTopColor = '#' + color;
          this.$.heroContent.style.borderTopStyle = 'dashed';
          this.$.heroContent.style.borderTopWidth = '1px';
        }
      }
      if (json.raised) {
        this.$.heroContent.style.overflow = 'visible';
        this.$.heroContent.style.boxShadow = '0px 20px 20px #eeeeee';
      }
      if (json.gradientBackgroundColor) {
        var colors = json.gradientBackgroundColor;
        this.$.heroContent.style.background =
          '-webkit-linear-gradient(top,#' + colors[0] + ',#' + colors[1] + ')';
      }
      // if (json.gesture) {
      // 	var gesture = json.gesture;
      // 	var i, event;
      // 	for (i = 0; i < gesture.length; i++) {
      // 		var ges = gesture[i];
      // 		if (ges.name === 'swip') {
      // 			this.$.heroContent.addEventListener('touchmove',function(event){
      // 				event = event || window.event;
      // 				switch(event.type){
      // 				case 'touchmove':
      // 					event.touches[0].clientX;
      // 				}

      // 			}, false);

      // 		}
      // 	}
      // }
      if (json.subViews) {
        while (this.$.heroContent.lastChild) {
          this.$.heroContent.removeChild(this.$.heroContent.lastChild);
        }
        var views = json.subViews;
        for (var num in views) {
          var viewObject = views[num];
          var view = document.createElement(
            window.APP.camelCase2bar(viewObject.class || viewObject.res)
          );
          this.$.heroContent.appendChild(view);
          view.controller = this.controller;
          view.parent = this;
          view.in(viewObject);
        }
      }
      if (json.hasOwnProperty('enable')) {
        this.$.heroContent.style.pointerEvents = json.enable ? '' : 'none';
      }
    }
  }

  updateAttr(element, name, value) {
    element.setAttribute(name, value);
    if (name === 'disabled' && !value) {
      element.removeAttribute(name);
    }
  }

  updateContent(element, text) {
    element.textContent = text;
  }

  wrapperTemplate(html) {
    return `
      <style>
        /* MAD-RIPPLE EFFECT */
        .ripple{
          position: absolute;
          top:0; left:0; bottom:0; right:0;
          overflow: hidden;
          -webkit-transform: translateZ(0); /* to contain zoomed ripple */
          transform: translateZ(0);
          border-radius: inherit; /* inherit from parent (rounded buttons etc) */
          pointer-events: none; /* allow user interaction */
                  animation: ripple-shadow 0.4s forwards;
          -webkit-animation: ripple-shadow 0.4s forwards;
        }
        .rippleWave{
          backface-visibility: hidden;
          position: absolute;
          border-radius: 50%;
          transform: scale(0.7); -webkit-transform: scale(0.7);
          opacity: 0.45;
                  animation: ripple 2s forwards;
          -webkit-animation: ripple 2s forwards;
        }
        .rippleWaveLight{
          background: rgba(255,255,255, 1);
        }
        .rippleWaveDark{
          background: rgba(200,200,200, 1);
        }
        @keyframes ripple {
          to {transform: scale(24); opacity:0;}
        }
        @-webkit-keyframes ripple {
          to {-webkit-transform: scale(24); opacity:0;}
        }
      </style>
      <div id="heroContent" style="position:absolute">${html}</div>
    `;
  }
}
