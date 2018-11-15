'use strict';

String.prototype.endWith = function(str) {
  if (str == null || str == '' || this.length == 0 || str.length > this.length)
    return false;
  if (this.substring(this.length - str.length) == str) return true;
  else return false;
};
String.prototype.startWith = function(str) {
  if (str == null || str == '' || this.length == 0 || str.length > this.length)
    return false;
  if (this.substr(0, str.length) == str) return true;
  else return false;
};

// run a callback when HTMLImports are ready or immediately if
// this api is not available.
function whenImportsReady(cb) {
  if (window.HTMLImports) {
    window.HTMLImports.whenReady(cb);
  } else {
    cb();
  }
}

/**
 * Convenience method for importing an HTML document imperatively.
 *
 * This method creates a new `<link rel="import">` element with
 * the provided URL and appends it to the document to start loading.
 * In the `onload` callback, the `import` property of the `link`
 * element will contain the imported document contents.
 *
 * @memberof Polymer
 * @param {string} href URL to document to load.
 * @param {?function(!Event):void=} onload Callback to notify when an import successfully
 *   loaded.
 * @param {?function(!ErrorEvent):void=} onerror Callback to notify when an import
 *   unsuccessfully loaded.
 * @param {boolean=} optAsync True if the import should be loaded `async`.
 *   Defaults to `false`.
 * @return {!HTMLLinkElement} The link element for the URL to be loaded.
 */
window.importHref = function(href, onload, onerror, optAsync) {
  let link /** @type {HTMLLinkElement} */ = document.head.querySelector(
    'link[href="' + href + '"][import-href]'
  );
  if (!link) {
    link = /** @type {HTMLLinkElement} */ (document.createElement('link'));
    link.rel = 'import';
    link.href = href;
    link.setAttribute('import-href', '');
  }
  // always ensure link has `async` attribute if user specified one,
  // even if it was previously not async. This is considered less confusing.
  if (optAsync) {
    link.setAttribute('async', '');
  }
  // NOTE: the link may now be in 3 states: (1) pending insertion,
  // (2) inflight, (3) already loaded. In each case, we need to add
  // event listeners to process callbacks.
  let cleanup = function() {
    link.removeEventListener('load', loadListener);
    link.removeEventListener('error', errorListener);
  };
  let loadListener = function(event) {
    cleanup();
    // In case of a successful load, cache the load event on the link so
    // that it can be used to short-circuit this method in the future when
    // it is called with the same href param.
    link.__dynamicImportLoaded = true;
    if (onload) {
      whenImportsReady(() => {
        onload(event);
      });
    }
  };
  let errorListener = function(event) {
    cleanup();
    // In case of an error, remove the link from the document so that it
    // will be automatically created again the next time `importHref` is
    // called.
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    if (onerror) {
      whenImportsReady(() => {
        onerror(event);
      });
    }
  };
  link.addEventListener('load', loadListener);
  link.addEventListener('error', errorListener);
  if (link.parentNode == null) {
    document.head.appendChild(link);
    // if the link already loaded, dispatch a fake load event
    // so that listeners are called and get a proper event argument.
  } else if (link.__dynamicImportLoaded) {
    link.dispatchEvent(new Event('load'));
  }
  return link;
};

(function CSSAnimation() {
  /*
        webkitAnimationName => Safari/Chrome
        MozAnimationName => Mozilla Firefox
        OAnimationName => Opera
        animationName => compliant browsers (inc. IE10)
     */
  var supported = false;
  var prefixes = ['webkit', 'Moz', 'O', ''];
  var limit = prefixes.length;
  var doc = document.documentElement.style;
  var prefix, start, end;

  while (limit--) {
    // If the compliant browser check (in this case an empty string value) then we need to check against different string (animationName and not prefix + AnimationName)
    if (!prefixes[limit]) {
      // If not undefined then we've found a successful match
      if (doc['animationName'] !== undefined) {
        prefix = prefixes[limit];
        start = 'animationstart';
        end = 'animationend';
        supported = true;
        break;
      }
    }
    // Other brower prefixes to be checked
    else {
      // If not undefined then we've found a successful match
      if (doc[prefixes[limit] + 'AnimationName'] !== undefined) {
        prefix = prefixes[limit];

        switch (limit) {
          case 0:
            //  webkitAnimationStart && webkitAnimationEnd
            start = prefix.toLowerCase() + 'AnimationStart';
            end = prefix.toLowerCase() + 'AnimationEnd';
            supported = true;
            break;

          case 1:
            // animationstart && animationend
            start = 'animationstart';
            end = 'animationend';
            supported = true;
            break;

          case 2:
            // oanimationstart && oanimationend
            start = prefix.toLowerCase() + 'animationstart';
            end = prefix.toLowerCase() + 'animationend';
            supported = true;
            break;
        }

        break;
      }
    }
  }

  window.AnimationSupport = {
    supported: supported,
    prefix: prefix,
    start: start,
    end: end,
  };
})();

class HeroElement extends HTMLElement {
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
      var mobile = /iphone|ipad|ipod|android|blackberry|mini|palm/i.test(
        navigator.userAgent.toLowerCase()
      );

      if (mobile) {
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
            if (
              json.backgroundColor === 'fff' ||
              json.backgroundColor === 'ffffff'
            ) {
              effectWave.classList.add('rippleWaveDark');
            } else {
              effectWave.classList.add('rippleWaveLight');
            }

            effectHolder.append(effectWave);
          }.bind(this)
        );
      } else {
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
            if (
              json.backgroundColor === 'fff' ||
              json.backgroundColor === 'ffffff'
            ) {
              effectWave.classList.add('rippleWaveDark');
            } else {
              effectWave.classList.add('rippleWaveLight');
            }

            effectHolder.append(effectWave);
          }.bind(this)
        );
      }
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
            this.parent.in({ frame: frame });
          }
        }
        if (this.json.contentSizeElementY) {
          if (this.$.heroContent.style.display != 'none' && this.parent) {
            this.parent.json.frame.h =
              parseFloat(this.$.heroContent.style.top) +
              parseFloat(this.$.heroContent.style.height) +
              '';
            frame = this.parent.json.frame;
            this.parent.in({ frame: frame });
          }
        }
        if (this.heroLayoutListenners) {
          for (var i = 0; i < this.heroLayoutListenners.length; i++) {
            var o = this.heroLayoutListenners[i];
            o.in({ frame: o.json.frame, yOffset: o.json.yOffset });
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
            this.parent.in({ frame: frame });
          }
          this.$.heroContent.style.display = 'none';
        } else {
          if (this.json.contentSizeElementY) {
            this.parent.json.frame.h =
              parseFloat(this.$.heroContent.style.top) +
              parseFloat(this.$.heroContent.style.height) +
              '';
            frame = this.parent.json.frame;
            this.parent.in({ frame: frame });
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
      //  var gesture = json.gesture;
      //  var i, event;
      //  for (i = 0; i < gesture.length; i++) {
      //    var ges = gesture[i];
      //    if (ges.name === 'swip') {
      //      this.$.heroContent.addEventListener('touchmove',function(event){
      //        event = event || window.event;
      //        switch(event.type){
      //        case 'touchmove':
      //          event.touches[0].clientX;
      //        }

      //      }, false);

      //    }
      //  }
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
      <div id="heroContent" style="position:absolute;overflow:hidden;">${html}</div>
    `;
  }
}

class HeroPages extends HeroElement {
  init() {
    this.$ = {
      pages: this.shadowDom.querySelector('#pageContainer'),
    };
  }
  template() {
    return `
			<style>
			#heroContent {
				height: 100%;
				width: 100%;
			}
			.pt-page-current.pt-page {
				visibility: visible;
				z-index: 1;
			}
			.pt-page::-webkit-scrollbar{
				display:none;
			}
			.pt-page {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				visibility: hidden;
				overflow: scroll;
				-webkit-backface-visibility: hidden;
				-moz-backface-visibility: hidden;
				backface-visibility: hidden;
				-webkit-transform: translate3d(0, 0, 0);
				-moz-transform: translate3d(0, 0, 0);
				transform: translate3d(0, 0, 0);
				-webkit-transform-style: preserve-3d;
				-moz-transform-style: preserve-3d;
				transform-style: preserve-3d;
			}
			/* animation sets */

			/* move from / to  */
			
			.pt-page-moveToLeft {
				-webkit-animation: moveToLeft .6s ease both;
				animation: moveToLeft .6s ease both;
			}
			
			.pt-page-moveFromLeft {
				-webkit-animation: moveFromLeft .6s ease both;
				animation: moveFromLeft .6s ease both;
			}
			
			.pt-page-moveToRight {
				-webkit-animation: moveToRight .6s ease both;
				animation: moveToRight .6s ease both;
			}
			
			.pt-page-moveFromRight {
				-webkit-animation: moveFromRight .6s ease both;
				animation: moveFromRight .6s ease both;
			}
			
			.pt-page-moveToTop {
				-webkit-animation: moveToTop .6s ease both;
				animation: moveToTop .6s ease both;
			}
			
			.pt-page-moveFromTop {
				-webkit-animation: moveFromTop .6s ease both;
				animation: moveFromTop .6s ease both;
			}
			
			.pt-page-moveToBottom {
				-webkit-animation: moveToBottom .6s ease both;
				animation: moveToBottom .6s ease both;
			}
			
			.pt-page-moveFromBottom {
				-webkit-animation: moveFromBottom .6s ease both;
				animation: moveFromBottom .6s ease both;
			}
			
			/* fade */
			
			.pt-page-fade {
				-webkit-animation: fade .7s ease both;
				animation: fade .7s ease both;
			}
			
			/* move from / to and fade */
			
			.pt-page-moveToLeftFade {
				-webkit-animation: moveToLeftFade .7s ease both;
				animation: moveToLeftFade .7s ease both;
			}
			
			.pt-page-moveFromLeftFade {
				-webkit-animation: moveFromLeftFade .7s ease both;
				animation: moveFromLeftFade .7s ease both;
			}
			
			.pt-page-moveToRightFade {
				-webkit-animation: moveToRightFade .7s ease both;
				animation: moveToRightFade .7s ease both;
			}
			
			.pt-page-moveFromRightFade {
				-webkit-animation: moveFromRightFade .7s ease both;
				animation: moveFromRightFade .7s ease both;
			}
			
			.pt-page-moveToTopFade {
				-webkit-animation: moveToTopFade .7s ease both;
				animation: moveToTopFade .7s ease both;
			}
			
			.pt-page-moveFromTopFade {
				-webkit-animation: moveFromTopFade .7s ease both;
				animation: moveFromTopFade .7s ease both;
			}
			
			.pt-page-moveToBottomFade {
				-webkit-animation: moveToBottomFade .7s ease both;
				animation: moveToBottomFade .7s ease both;
			}
			
			.pt-page-moveFromBottomFade {
				-webkit-animation: moveFromBottomFade .7s ease both;
				animation: moveFromBottomFade .7s ease both;
			}
			
			/* move to with different easing */
			
			.pt-page-moveToLeftEasing {
				-webkit-animation: moveToLeft .7s ease-in-out both;
				animation: moveToLeft .7s ease-in-out both;
			}
			.pt-page-moveToRightEasing {
				-webkit-animation: moveToRight .7s ease-in-out both;
				animation: moveToRight .7s ease-in-out both;
			}
			.pt-page-moveToTopEasing {
				-webkit-animation: moveToTop .7s ease-in-out both;
				animation: moveToTop .7s ease-in-out both;
			}
			.pt-page-moveToBottomEasing {
				-webkit-animation: moveToBottom .7s ease-in-out both;
				animation: moveToBottom .7s ease-in-out both;
			}
			
			/********************************* keyframes **************************************/
			
			/* move from / to  */
			
			@-webkit-keyframes moveToLeft {
				from { }
				to { -webkit-transform: translateX(-100%); }
			}
			@keyframes moveToLeft {
				from { }
				to { -webkit-transform: translateX(-100%); transform: translateX(-100%); }
			}
			
			@-webkit-keyframes moveFromLeft {
				from { -webkit-transform: translateX(-100%); }
			}
			@keyframes moveFromLeft {
				from { -webkit-transform: translateX(-100%); transform: translateX(-100%); }
			}
			
			@-webkit-keyframes moveToRight { 
				from { }
				to { -webkit-transform: translateX(100%); }
			}
			@keyframes moveToRight { 
				from { }
				to { -webkit-transform: translateX(100%); transform: translateX(100%); }
			}
			
			@-webkit-keyframes moveFromRight {
				from { -webkit-transform: translateX(100%); }
			}
			@keyframes moveFromRight {
				from { -webkit-transform: translateX(100%); transform: translateX(100%); }
			}
			
			@-webkit-keyframes moveToTop {
				from { }
				to { -webkit-transform: translateY(-100%); }
			}
			@keyframes moveToTop {
				from { }
				to { -webkit-transform: translateY(-100%); transform: translateY(-100%); }
			}
			
			@-webkit-keyframes moveFromTop {
				from { -webkit-transform: translateY(-100%); }
			}
			@keyframes moveFromTop {
				from { -webkit-transform: translateY(-100%); transform: translateY(-100%); }
			}
			
			@-webkit-keyframes moveToBottom {
				from { }
				to { -webkit-transform: translateY(100%); }
			}
			@keyframes moveToBottom {
				from { }
				to { -webkit-transform: translateY(100%); transform: translateY(100%); }
			}
			
			@-webkit-keyframes moveFromBottom {
				from { -webkit-transform: translateY(100%); }
			}
			@keyframes moveFromBottom {
				from { -webkit-transform: translateY(100%); transform: translateY(100%); }
			}
			
			/* fade */
			
			@-webkit-keyframes fade {
				from { }
				to { opacity: 0.3; }
			}
			@keyframes fade {
				from { }
				to { opacity: 0.3; }
			}
			
			/* move from / to and fade */
			
			@-webkit-keyframes moveToLeftFade {
				from { }
				to { opacity: 0.3; -webkit-transform: translateX(-100%); }
			}
			@keyframes moveToLeftFade {
				from { }
				to { opacity: 0.3; -webkit-transform: translateX(-100%); transform: translateX(-100%); }
			}
			
			@-webkit-keyframes moveFromLeftFade {
				from { opacity: 0.3; -webkit-transform: translateX(-100%); }
			}
			@keyframes moveFromLeftFade {
				from { opacity: 0.3; -webkit-transform: translateX(-100%); transform: translateX(-100%); }
			}
			
			@-webkit-keyframes moveToRightFade {
				from { }
				to { opacity: 0.3; -webkit-transform: translateX(100%); }
			}
			@keyframes moveToRightFade {
				from { }
				to { opacity: 0.3; -webkit-transform: translateX(100%); transform: translateX(100%); }
			}
			
			@-webkit-keyframes moveFromRightFade {
				from { opacity: 0.3; -webkit-transform: translateX(100%); }
			}
			@keyframes moveFromRightFade {
				from { opacity: 0.3; -webkit-transform: translateX(100%); transform: translateX(100%); }
			}
			
			@-webkit-keyframes moveToTopFade {
				from { }
				to { opacity: 0.3; -webkit-transform: translateY(-100%); }
			}
			@keyframes moveToTopFade {
				from { }
				to { opacity: 0.3; -webkit-transform: translateY(-100%); transform: translateY(-100%); }
			}
			
			@-webkit-keyframes moveFromTopFade {
				from { opacity: 0.3; -webkit-transform: translateY(-100%); }
			}
			@keyframes moveFromTopFade {
				from { opacity: 0.3; -webkit-transform: translateY(-100%); transform: translateY(-100%); }
			}
			
			@-webkit-keyframes moveToBottomFade {
				from { }
				to { opacity: 0.3; -webkit-transform: translateY(100%); }
			}
			@keyframes moveToBottomFade {
				from { }
				to { opacity: 0.3; -webkit-transform: translateY(100%); transform: translateY(100%); }
			}
			
			@-webkit-keyframes moveFromBottomFade {
				from { opacity: 0.3; -webkit-transform: translateY(100%); }
			}
			@keyframes moveFromBottomFade {
				from { opacity: 0.3; -webkit-transform: translateY(100%); transform: translateY(100%); }
			}
			
			/* scale and fade */
			
			.pt-page-scaleDown {
				-webkit-animation: scaleDown .7s ease both;
				animation: scaleDown .7s ease both;
			}
			
			.pt-page-scaleUp {
				-webkit-animation: scaleUp .7s ease both;
				animation: scaleUp .7s ease both;
			}
			
			.pt-page-scaleUpDown {
				-webkit-animation: scaleUpDown .5s ease both;
				animation: scaleUpDown .5s ease both;
			}
			
			.pt-page-scaleDownUp {
				-webkit-animation: scaleDownUp .5s ease both;
				animation: scaleDownUp .5s ease both;
			}
			
			.pt-page-scaleDownCenter {
				-webkit-animation: scaleDownCenter .4s ease-in both;
				animation: scaleDownCenter .4s ease-in both;
			}
			
			.pt-page-scaleUpCenter {
				-webkit-animation: scaleUpCenter .4s ease-out both;
				animation: scaleUpCenter .4s ease-out both;
			}
			
			/********************************* keyframes **************************************/
			
			/* scale and fade */
			
			@-webkit-keyframes scaleDown {
				from { }
				to { opacity: 0; -webkit-transform: scale(.8); }
			}
			@keyframes scaleDown {
				from { }
				to { opacity: 0; -webkit-transform: scale(.8); transform: scale(.8); }
			}
			
			@-webkit-keyframes scaleUp {
				from { opacity: 0; -webkit-transform: scale(.8); }
			}
			@keyframes scaleUp {
				from { opacity: 0; -webkit-transform: scale(.8); transform: scale(.8); }
			}
			
			@-webkit-keyframes scaleUpDown {
				from { opacity: 0; -webkit-transform: scale(1.2); }
			}
			@keyframes scaleUpDown {
				from { opacity: 0; -webkit-transform: scale(1.2); transform: scale(1.2); }
			}
			
			@-webkit-keyframes scaleDownUp {
				from { }
				to { opacity: 0; -webkit-transform: scale(1.2); }
			}
			@keyframes scaleDownUp {
				from { }
				to { opacity: 0; -webkit-transform: scale(1.2); transform: scale(1.2); }
			}
			
			@-webkit-keyframes scaleDownCenter {
				from { }
				to { opacity: 0; -webkit-transform: scale(.7); }
			}
			@keyframes scaleDownCenter {
				from { }
				to { opacity: 0; -webkit-transform: scale(.7); transform: scale(.7); }
			}
			
			@-webkit-keyframes scaleUpCenter {
				from { opacity: 0; -webkit-transform: scale(.7); }
			}
			@keyframes scaleUpCenter {
				from { opacity: 0; -webkit-transform: scale(.7); transform: scale(.7); }
			}
			
			/* rotate sides first and scale */
			
			.pt-page-rotateRightSideFirst {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateRightSideFirst .8s both ease-in;
				animation: rotateRightSideFirst .8s both ease-in;
			}
			.pt-page-rotateLeftSideFirst {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateLeftSideFirst .8s both ease-in;
				animation: rotateLeftSideFirst .8s both ease-in;
			}
			.pt-page-rotateTopSideFirst {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateTopSideFirst .8s both ease-in;
				animation: rotateTopSideFirst .8s both ease-in;
			}
			.pt-page-rotateBottomSideFirst {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateBottomSideFirst .8s both ease-in;
				animation: rotateBottomSideFirst .8s both ease-in;
			}
			
			/* flip */
			
			.pt-page-flipOutRight {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: flipOutRight .5s both ease-in;
				animation: flipOutRight .5s both ease-in;
			}
			.pt-page-flipInLeft {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: flipInLeft .5s both ease-out;
				animation: flipInLeft .5s both ease-out;
			}
			.pt-page-flipOutLeft {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: flipOutLeft .5s both ease-in;
				animation: flipOutLeft .5s both ease-in;
			}
			.pt-page-flipInRight {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: flipInRight .5s both ease-out;
				animation: flipInRight .5s both ease-out;
			}
			.pt-page-flipOutTop {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: flipOutTop .5s both ease-in;
				animation: flipOutTop .5s both ease-in;
			}
			.pt-page-flipInBottom {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: flipInBottom .5s both ease-out;
				animation: flipInBottom .5s both ease-out;
			}
			.pt-page-flipOutBottom {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: flipOutBottom .5s both ease-in;
				animation: flipOutBottom .5s both ease-in;
			}
			.pt-page-flipInTop {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: flipInTop .5s both ease-out;
				animation: flipInTop .5s both ease-out;
			}
			
			/* rotate fall */
			
			.pt-page-rotateFall {
				-webkit-transform-origin: 0% 0%;
				transform-origin: 0% 0%;
				-webkit-animation: rotateFall 1s both ease-in;
				animation: rotateFall 1s both ease-in;
			}
			
			/* rotate newspaper */
			.pt-page-rotateOutNewspaper {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: rotateOutNewspaper .5s both ease-in;
				animation: rotateOutNewspaper .5s both ease-in;
			}
			.pt-page-rotateInNewspaper {
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
				-webkit-animation: rotateInNewspaper .5s both ease-out;
				animation: rotateInNewspaper .5s both ease-out;
			}
			
			/* push */
			.pt-page-rotatePushLeft {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotatePushLeft .8s both ease;
				animation: rotatePushLeft .8s both ease;
			}
			.pt-page-rotatePushRight {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotatePushRight .8s both ease;
				animation: rotatePushRight .8s both ease;
			}
			.pt-page-rotatePushTop {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotatePushTop .8s both ease;
				animation: rotatePushTop .8s both ease;
			}
			.pt-page-rotatePushBottom {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotatePushBottom .8s both ease;
				animation: rotatePushBottom .8s both ease;
			}
			
			/* pull */
			.pt-page-rotatePullRight {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotatePullRight .5s both ease;
				animation: rotatePullRight .5s both ease;
			}
			.pt-page-rotatePullLeft {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotatePullLeft .5s both ease;
				animation: rotatePullLeft .5s both ease;
			}
			.pt-page-rotatePullTop {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotatePullTop .5s both ease;
				animation: rotatePullTop .5s both ease;
			}
			.pt-page-rotatePullBottom {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotatePullBottom .5s both ease;
				animation: rotatePullBottom .5s both ease;
			}
			
			/* fold */
			.pt-page-rotateFoldRight {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateFoldRight .7s both ease;
				animation: rotateFoldRight .7s both ease;
			}
			.pt-page-rotateFoldLeft {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateFoldLeft .7s both ease;
				animation: rotateFoldLeft .7s both ease;
			}
			.pt-page-rotateFoldTop {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateFoldTop .7s both ease;
				animation: rotateFoldTop .7s both ease;
			}
			.pt-page-rotateFoldBottom {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateFoldBottom .7s both ease;
				animation: rotateFoldBottom .7s both ease;
			}
			
			/* unfold */
			.pt-page-rotateUnfoldLeft {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateUnfoldLeft .7s both ease;
				animation: rotateUnfoldLeft .7s both ease;
			}
			.pt-page-rotateUnfoldRight {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateUnfoldRight .7s both ease;
				animation: rotateUnfoldRight .7s both ease;
			}
			.pt-page-rotateUnfoldTop {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateUnfoldTop .7s both ease;
				animation: rotateUnfoldTop .7s both ease;
			}
			.pt-page-rotateUnfoldBottom {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateUnfoldBottom .7s both ease;
				animation: rotateUnfoldBottom .7s both ease;
			}
			
			/* room walls */
			.pt-page-rotateRoomLeftOut {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateRoomLeftOut .8s both ease;
				animation: rotateRoomLeftOut .8s both ease;
			}
			.pt-page-rotateRoomLeftIn {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateRoomLeftIn .8s both ease;
				animation: rotateRoomLeftIn .8s both ease;
			}
			.pt-page-rotateRoomRightOut {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateRoomRightOut .8s both ease;
				animation: rotateRoomRightOut .8s both ease;
			}
			.pt-page-rotateRoomRightIn {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateRoomRightIn .8s both ease;
				animation: rotateRoomRightIn .8s both ease;
			}
			.pt-page-rotateRoomTopOut {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateRoomTopOut .8s both ease;
				animation: rotateRoomTopOut .8s both ease;
			}
			.pt-page-rotateRoomTopIn {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateRoomTopIn .8s both ease;
				animation: rotateRoomTopIn .8s both ease;
			}
			.pt-page-rotateRoomBottomOut {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateRoomBottomOut .8s both ease;
				animation: rotateRoomBottomOut .8s both ease;
			}
			.pt-page-rotateRoomBottomIn {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateRoomBottomIn .8s both ease;
				animation: rotateRoomBottomIn .8s both ease;
			}
			
			/* cube */
			.pt-page-rotateCubeLeftOut {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateCubeLeftOut .6s both ease-in;
				animation: rotateCubeLeftOut .6s both ease-in;
			}
			.pt-page-rotateCubeLeftIn {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateCubeLeftIn .6s both ease-in;
				animation: rotateCubeLeftIn .6s both ease-in;
			}
			.pt-page-rotateCubeRightOut {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateCubeRightOut .6s both ease-in;
				animation: rotateCubeRightOut .6s both ease-in;
			}
			.pt-page-rotateCubeRightIn {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateCubeRightIn .6s both ease-in;
				animation: rotateCubeRightIn .6s both ease-in;
			}
			.pt-page-rotateCubeTopOut {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateCubeTopOut .6s both ease-in;
				animation: rotateCubeTopOut .6s both ease-in;
			}
			.pt-page-rotateCubeTopIn {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateCubeTopIn .6s both ease-in;
				animation: rotateCubeTopIn .6s both ease-in;
			}
			.pt-page-rotateCubeBottomOut {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateCubeBottomOut .6s both ease-in;
				animation: rotateCubeBottomOut .6s both ease-in;
			}
			.pt-page-rotateCubeBottomIn {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateCubeBottomIn .6s both ease-in;
				animation: rotateCubeBottomIn .6s both ease-in;
			}
			
			/* carousel */
			.pt-page-rotateCarouselLeftOut {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateCarouselLeftOut .8s both ease;
				animation: rotateCarouselLeftOut .8s both ease;
			}
			.pt-page-rotateCarouselLeftIn {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateCarouselLeftIn .8s both ease;
				animation: rotateCarouselLeftIn .8s both ease;
			}
			.pt-page-rotateCarouselRightOut {
				-webkit-transform-origin: 0% 50%;
				transform-origin: 0% 50%;
				-webkit-animation: rotateCarouselRightOut .8s both ease;
				animation: rotateCarouselRightOut .8s both ease;
			}
			.pt-page-rotateCarouselRightIn {
				-webkit-transform-origin: 100% 50%;
				transform-origin: 100% 50%;
				-webkit-animation: rotateCarouselRightIn .8s both ease;
				animation: rotateCarouselRightIn .8s both ease;
			}
			.pt-page-rotateCarouselTopOut {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateCarouselTopOut .8s both ease;
				animation: rotateCarouselTopOut .8s both ease;
			}
			.pt-page-rotateCarouselTopIn {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateCarouselTopIn .8s both ease;
				animation: rotateCarouselTopIn .8s both ease;
			}
			.pt-page-rotateCarouselBottomOut {
				-webkit-transform-origin: 50% 0%;
				transform-origin: 50% 0%;
				-webkit-animation: rotateCarouselBottomOut .8s both ease;
				animation: rotateCarouselBottomOut .8s both ease;
			}
			.pt-page-rotateCarouselBottomIn {
				-webkit-transform-origin: 50% 100%;
				transform-origin: 50% 100%;
				-webkit-animation: rotateCarouselBottomIn .8s both ease;
				animation: rotateCarouselBottomIn .8s both ease;
			}
			
			/* sides */
			.pt-page-rotateSidesOut {
				-webkit-transform-origin: -50% 50%;
				transform-origin: -50% 50%;
				-webkit-animation: rotateSidesOut .5s both ease-in;
				animation: rotateSidesOut .5s both ease-in;
			}
			.pt-page-rotateSidesIn {
				-webkit-transform-origin: 150% 50%;
				transform-origin: 150% 50%;
				-webkit-animation: rotateSidesIn .5s both ease-out;
				animation: rotateSidesIn .5s both ease-out;
			}
			
			/* slide */
			.pt-page-rotateSlideOut {
				-webkit-animation: rotateSlideOut 1s both ease;
				animation: rotateSlideOut 1s both ease;
			}
			.pt-page-rotateSlideIn {
				-webkit-animation: rotateSlideIn 1s both ease;
				animation: rotateSlideIn 1s both ease;
			}
			
			/********************************* keyframes **************************************/
			
			/* rotate sides first and scale */
			
			@-webkit-keyframes rotateRightSideFirst {
				0% { }
				40% { -webkit-transform: rotateY(15deg); opacity: .8; -webkit-animation-timing-function: ease-out; }
				100% { -webkit-transform: scale(0.8) translateZ(-200px); opacity:0; }
			}
			@keyframes rotateRightSideFirst {
				0% { }
				40% { -webkit-transform: rotateY(15deg); transform: rotateY(15deg); opacity: .8; -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; }
				100% { -webkit-transform: scale(0.8) translateZ(-200px); transform: scale(0.8) translateZ(-200px); opacity:0; }
			}
			
			@-webkit-keyframes rotateLeftSideFirst {
				0% { }
				40% { -webkit-transform: rotateY(-15deg); opacity: .8; -webkit-animation-timing-function: ease-out; }
				100% { -webkit-transform: scale(0.8) translateZ(-200px); opacity:0; }
			}
			@keyframes rotateLeftSideFirst {
				0% { }
				40% { -webkit-transform: rotateY(-15deg); transform: rotateY(-15deg); opacity: .8; -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; }
				100% { -webkit-transform: scale(0.8) translateZ(-200px); transform: scale(0.8) translateZ(-200px); opacity:0; }
			}
			
			@-webkit-keyframes rotateTopSideFirst {
				0% { }
				40% { -webkit-transform: rotateX(15deg); opacity: .8; -webkit-animation-timing-function: ease-out; }
				100% { -webkit-transform: scale(0.8) translateZ(-200px); opacity:0; }
			}
			@keyframes rotateTopSideFirst {
				0% { }
				40% { -webkit-transform: rotateX(15deg); transform: rotateX(15deg); opacity: .8; -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; }
				100% { -webkit-transform: scale(0.8) translateZ(-200px); transform: scale(0.8) translateZ(-200px); opacity:0; }
			}
			
			@-webkit-keyframes rotateBottomSideFirst {
				0% { }
				40% { -webkit-transform: rotateX(-15deg); opacity: .8; -webkit-animation-timing-function: ease-out; }
				100% { -webkit-transform: scale(0.8) translateZ(-200px); opacity:0; }
			}
			@keyframes rotateBottomSideFirst {
				0% { }
				40% { -webkit-transform: rotateX(-15deg); transform: rotateX(-15deg); opacity: .8; -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; }
				100% { -webkit-transform: scale(0.8) translateZ(-200px); transform: scale(0.8) translateZ(-200px); opacity:0; }
			}
			
			/* flip */
			
			@-webkit-keyframes flipOutRight {
				from { }
				to { -webkit-transform: translateZ(-1000px) rotateY(90deg); opacity: 0.2; }
			}
			@keyframes flipOutRight {
				from { }
				to { -webkit-transform: translateZ(-1000px) rotateY(90deg); transform: translateZ(-1000px) rotateY(90deg); opacity: 0.2; }
			}
			
			@-webkit-keyframes flipInLeft {
				from { -webkit-transform: translateZ(-1000px) rotateY(-90deg); opacity: 0.2; }
			}
			@keyframes flipInLeft {
				from { -webkit-transform: translateZ(-1000px) rotateY(-90deg); transform: translateZ(-1000px) rotateY(-90deg); opacity: 0.2; }
			}
			
			@-webkit-keyframes flipOutLeft {
				from { }
				to { -webkit-transform: translateZ(-1000px) rotateY(-90deg); opacity: 0.2; }
			}
			@keyframes flipOutLeft {
				from { }
				to { -webkit-transform: translateZ(-1000px) rotateY(-90deg); transform: translateZ(-1000px) rotateY(-90deg); opacity: 0.2; }
			}
			
			@-webkit-keyframes flipInRight {
				from { -webkit-transform: translateZ(-1000px) rotateY(90deg); opacity: 0.2; }
			}
			@keyframes flipInRight {
				from { -webkit-transform: translateZ(-1000px) rotateY(90deg); transform: translateZ(-1000px) rotateY(90deg); opacity: 0.2; }
			}
			
			@-webkit-keyframes flipOutTop {
				from { }
				to { -webkit-transform: translateZ(-1000px) rotateX(90deg); opacity: 0.2; }
			}
			@keyframes flipOutTop {
				from { }
				to { -webkit-transform: translateZ(-1000px) rotateX(90deg); transform: translateZ(-1000px) rotateX(90deg); opacity: 0.2; }
			}
			
			@-webkit-keyframes flipInBottom {
				from { -webkit-transform: translateZ(-1000px) rotateX(-90deg); opacity: 0.2; }
			}
			@keyframes flipInBottom {
				from { -webkit-transform: translateZ(-1000px) rotateX(-90deg); transform: translateZ(-1000px) rotateX(-90deg); opacity: 0.2; }
			}
			
			@-webkit-keyframes flipOutBottom {
				from { }
				to { -webkit-transform: translateZ(-1000px) rotateX(-90deg); opacity: 0.2; }
			}
			@keyframes flipOutBottom {
				from { }
				to { -webkit-transform: translateZ(-1000px) rotateX(-90deg); transform: translateZ(-1000px) rotateX(-90deg); opacity: 0.2; }
			}
			
			@-webkit-keyframes flipInTop {
				from { -webkit-transform: translateZ(-1000px) rotateX(90deg); opacity: 0.2; }
			}
			@keyframes flipInTop {
				from { -webkit-transform: translateZ(-1000px) rotateX(90deg); transform: translateZ(-1000px) rotateX(90deg); opacity: 0.2; }
			}
			
			/* fall */
			
			@-webkit-keyframes rotateFall {
				0% { -webkit-transform: rotateZ(0deg); }
				20% { -webkit-transform: rotateZ(10deg); -webkit-animation-timing-function: ease-out; }
				40% { -webkit-transform: rotateZ(17deg); }
				60% { -webkit-transform: rotateZ(16deg); }
				100% { -webkit-transform: translateY(100%) rotateZ(17deg); }
			}
			@keyframes rotateFall {
				0% { -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); }
				20% { -webkit-transform: rotateZ(10deg); transform: rotateZ(10deg); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; }
				40% { -webkit-transform: rotateZ(17deg); transform: rotateZ(17deg); }
				60% { -webkit-transform: rotateZ(16deg); transform: rotateZ(16deg); }
				100% { -webkit-transform: translateY(100%) rotateZ(17deg); transform: translateY(100%) rotateZ(17deg); }
			}
			
			/* newspaper */
			
			@-webkit-keyframes rotateOutNewspaper {
				from { }
				to { -webkit-transform: translateZ(-3000px) rotateZ(360deg); opacity: 0; }
			}
			@keyframes rotateOutNewspaper {
				from { }
				to { -webkit-transform: translateZ(-3000px) rotateZ(360deg); transform: translateZ(-3000px) rotateZ(360deg); opacity: 0; }
			}
			
			@-webkit-keyframes rotateInNewspaper {
				from { -webkit-transform: translateZ(-3000px) rotateZ(-360deg); opacity: 0; }
			}
			@keyframes rotateInNewspaper {
				from { -webkit-transform: translateZ(-3000px) rotateZ(-360deg); transform: translateZ(-3000px) rotateZ(-360deg); opacity: 0; }
			}
			
			/* push */
			
			@-webkit-keyframes rotatePushLeft {
				from { }
				to { opacity: 0; -webkit-transform: rotateY(90deg); }
			}
			@keyframes rotatePushLeft {
				from { }
				to { opacity: 0; -webkit-transform: rotateY(90deg); transform: rotateY(90deg); }
			}
			
			@-webkit-keyframes rotatePushRight {
				from { }
				to { opacity: 0; -webkit-transform: rotateY(-90deg); }
			}
			@keyframes rotatePushRight {
				from { }
				to { opacity: 0; -webkit-transform: rotateY(-90deg); transform: rotateY(-90deg); }
			}
			
			@-webkit-keyframes rotatePushTop {
				from { }
				to { opacity: 0; -webkit-transform: rotateX(-90deg); }
			}
			@keyframes rotatePushTop {
				from { }
				to { opacity: 0; -webkit-transform: rotateX(-90deg); transform: rotateX(-90deg); }
			}
			
			@-webkit-keyframes rotatePushBottom {
				from { }
				to { opacity: 0; -webkit-transform: rotateX(90deg); }
			}
			@keyframes rotatePushBottom {
				from { }
				to { opacity: 0; -webkit-transform: rotateX(90deg); transform: rotateX(90deg); }
			}
			
			/* pull */
			
			@-webkit-keyframes rotatePullRight {
				from { opacity: 0; -webkit-transform: rotateY(-90deg); }
			}
			@keyframes rotatePullRight {
				from { opacity: 0; -webkit-transform: rotateY(-90deg); transform: rotateY(-90deg); }
			}
			
			@-webkit-keyframes rotatePullLeft {
				from { opacity: 0; -webkit-transform: rotateY(90deg); }
			}
			@keyframes rotatePullLeft {
				from { opacity: 0; -webkit-transform: rotateY(90deg); transform: rotateY(90deg); }
			}
			
			@-webkit-keyframes rotatePullTop {
				from { opacity: 0; -webkit-transform: rotateX(-90deg); }
			}
			@keyframes rotatePullTop {
				from { opacity: 0; -webkit-transform: rotateX(-90deg); transform: rotateX(-90deg); }
			}
			
			@-webkit-keyframes rotatePullBottom {
				from { opacity: 0; -webkit-transform: rotateX(90deg); }
			}
			@keyframes rotatePullBottom {
				from { opacity: 0; -webkit-transform: rotateX(90deg); transform: rotateX(90deg); }
			}
			
			/* fold */
			
			@-webkit-keyframes rotateFoldRight {
				from { }
				to { opacity: 0; -webkit-transform: translateX(100%) rotateY(90deg); }
			}
			@keyframes rotateFoldRight {
				from { }
				to { opacity: 0; -webkit-transform: translateX(100%) rotateY(90deg); transform: translateX(100%) rotateY(90deg); }
			}
			
			@-webkit-keyframes rotateFoldLeft {
				from { }
				to { opacity: 0; -webkit-transform: translateX(-100%) rotateY(-90deg); }
			}
			@keyframes rotateFoldLeft {
				from { }
				to { opacity: 0; -webkit-transform: translateX(-100%) rotateY(-90deg); transform: translateX(-100%) rotateY(-90deg); }
			}
			
			@-webkit-keyframes rotateFoldTop {
				from { }
				to { opacity: 0; -webkit-transform: translateY(-100%) rotateX(90deg); }
			}
			@keyframes rotateFoldTop {
				from { }
				to { opacity: 0; -webkit-transform: translateY(-100%) rotateX(90deg); transform: translateY(-100%) rotateX(90deg); }
			}
			
			@-webkit-keyframes rotateFoldBottom {
				from { }
				to { opacity: 0; -webkit-transform: translateY(100%) rotateX(-90deg); }
			}
			@keyframes rotateFoldBottom {
				from { }
				to { opacity: 0; -webkit-transform: translateY(100%) rotateX(-90deg); transform: translateY(100%) rotateX(-90deg); }
			}
			
			/* unfold */
			
			@-webkit-keyframes rotateUnfoldLeft {
				from { opacity: 0; -webkit-transform: translateX(-100%) rotateY(-90deg); }
			}
			@keyframes rotateUnfoldLeft {
				from { opacity: 0; -webkit-transform: translateX(-100%) rotateY(-90deg); transform: translateX(-100%) rotateY(-90deg); }
			}
			
			@-webkit-keyframes rotateUnfoldRight {
				from { opacity: 0; -webkit-transform: translateX(100%) rotateY(90deg); }
			}
			@keyframes rotateUnfoldRight {
				from { opacity: 0; -webkit-transform: translateX(100%) rotateY(90deg); transform: translateX(100%) rotateY(90deg); }
			}
			
			@-webkit-keyframes rotateUnfoldTop {
				from { opacity: 0; -webkit-transform: translateY(-100%) rotateX(90deg); }
			}
			@keyframes rotateUnfoldTop {
				from { opacity: 0; -webkit-transform: translateY(-100%) rotateX(90deg); transform: translateY(-100%) rotateX(90deg); }
			}
			
			@-webkit-keyframes rotateUnfoldBottom {
				from { opacity: 0; -webkit-transform: translateY(100%) rotateX(-90deg); }
			}
			@keyframes rotateUnfoldBottom {
				from { opacity: 0; -webkit-transform: translateY(100%) rotateX(-90deg); transform: translateY(100%) rotateX(-90deg); }
			}
			
			/* room walls */
			
			@-webkit-keyframes rotateRoomLeftOut {
				from { }
				to { opacity: .3; -webkit-transform: translateX(-100%) rotateY(90deg); }
			}
			@keyframes rotateRoomLeftOut {
				from { }
				to { opacity: .3; -webkit-transform: translateX(-100%) rotateY(90deg); transform: translateX(-100%) rotateY(90deg); }
			}
			
			@-webkit-keyframes rotateRoomLeftIn {
				from { opacity: .3; -webkit-transform: translateX(100%) rotateY(-90deg); }
			}
			@keyframes rotateRoomLeftIn {
				from { opacity: .3; -webkit-transform: translateX(100%) rotateY(-90deg); transform: translateX(100%) rotateY(-90deg); }
			}
			
			@-webkit-keyframes rotateRoomRightOut {
				from { }
				to { opacity: .3; -webkit-transform: translateX(100%) rotateY(-90deg); }
			}
			@keyframes rotateRoomRightOut {
				from { }
				to { opacity: .3; -webkit-transform: translateX(100%) rotateY(-90deg); transform: translateX(100%) rotateY(-90deg); }
			}
			
			@-webkit-keyframes rotateRoomRightIn {
				from { opacity: .3; -webkit-transform: translateX(-100%) rotateY(90deg); }
			}
			@keyframes rotateRoomRightIn {
				from { opacity: .3; -webkit-transform: translateX(-100%) rotateY(90deg); transform: translateX(-100%) rotateY(90deg); }
			}
			
			@-webkit-keyframes rotateRoomTopOut {
				from { }
				to { opacity: .3; -webkit-transform: translateY(-100%) rotateX(-90deg); }
			}
			@keyframes rotateRoomTopOut {
				from { }
				to { opacity: .3; -webkit-transform: translateY(-100%) rotateX(-90deg); transform: translateY(-100%) rotateX(-90deg); }
			}
			
			@-webkit-keyframes rotateRoomTopIn {
				from { opacity: .3; -webkit-transform: translateY(100%) rotateX(90deg); }
			}
			@keyframes rotateRoomTopIn {
				from { opacity: .3; -webkit-transform: translateY(100%) rotateX(90deg); transform: translateY(100%) rotateX(90deg); }
			}
			
			@-webkit-keyframes rotateRoomBottomOut {
				from { }
				to { opacity: .3; -webkit-transform: translateY(100%) rotateX(90deg); }
			}
			@keyframes rotateRoomBottomOut {
				from { }
				to { opacity: .3; -webkit-transform: translateY(100%) rotateX(90deg); transform: translateY(100%) rotateX(90deg); }
			}
			
			@-webkit-keyframes rotateRoomBottomIn {
				from { opacity: .3; -webkit-transform: translateY(-100%) rotateX(-90deg); }
			}
			@keyframes rotateRoomBottomIn {
				from { opacity: .3; -webkit-transform: translateY(-100%) rotateX(-90deg); transform: translateY(-100%) rotateX(-90deg); }
			}
			
			/* cube */
			
			@-webkit-keyframes rotateCubeLeftOut {
				0% { }
				50% { -webkit-animation-timing-function: ease-out;  -webkit-transform: translateX(-50%) translateZ(-200px) rotateY(-45deg); }
				100% { opacity: .3; -webkit-transform: translateX(-100%) rotateY(-90deg); }
			}
			@keyframes rotateCubeLeftOut {
				0% { }
				50% { -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out;  -webkit-transform: translateX(-50%) translateZ(-200px) rotateY(-45deg);  transform: translateX(-50%) translateZ(-200px) rotateY(-45deg); }
				100% { opacity: .3; -webkit-transform: translateX(-100%) rotateY(-90deg); transform: translateX(-100%) rotateY(-90deg); }
			}
			
			@-webkit-keyframes rotateCubeLeftIn {
				0% { opacity: .3; -webkit-transform: translateX(100%) rotateY(90deg); }
				50% { -webkit-animation-timing-function: ease-out;  -webkit-transform: translateX(50%) translateZ(-200px) rotateY(45deg); }
			}
			@keyframes rotateCubeLeftIn {
				0% { opacity: .3; -webkit-transform: translateX(100%) rotateY(90deg); transform: translateX(100%) rotateY(90deg); }
				50% { -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out;  -webkit-transform: translateX(50%) translateZ(-200px) rotateY(45deg);  transform: translateX(50%) translateZ(-200px) rotateY(45deg); }
			}
			
			@-webkit-keyframes rotateCubeRightOut {
				0% { }
				50% { -webkit-animation-timing-function: ease-out; -webkit-transform: translateX(50%) translateZ(-200px) rotateY(45deg); }
				100% { opacity: .3; -webkit-transform: translateX(100%) rotateY(90deg); }
			}
			@keyframes rotateCubeRightOut {
				0% { }
				50% { -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; -webkit-transform: translateX(50%) translateZ(-200px) rotateY(45deg); transform: translateX(50%) translateZ(-200px) rotateY(45deg); }
				100% { opacity: .3; -webkit-transform: translateX(100%) rotateY(90deg); transform: translateX(100%) rotateY(90deg); }
			}
			
			@-webkit-keyframes rotateCubeRightIn {
				0% { opacity: .3; -webkit-transform: translateX(-100%) rotateY(-90deg); }
				50% { -webkit-animation-timing-function: ease-out; -webkit-transform: translateX(-50%) translateZ(-200px) rotateY(-45deg); }
			}
			@keyframes rotateCubeRightIn {
				0% { opacity: .3; -webkit-transform: translateX(-100%) rotateY(-90deg); transform: translateX(-100%) rotateY(-90deg); }
				50% { -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; -webkit-transform: translateX(-50%) translateZ(-200px) rotateY(-45deg); transform: translateX(-50%) translateZ(-200px) rotateY(-45deg); }
			}
			
			@-webkit-keyframes rotateCubeTopOut {
				0% { }
				50% { -webkit-animation-timing-function: ease-out; -webkit-transform: translateY(-50%) translateZ(-200px) rotateX(45deg); }
				100% { opacity: .3; -webkit-transform: translateY(-100%) rotateX(90deg); }
			}
			@keyframes rotateCubeTopOut {
				0% {}
				50% { -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; -webkit-transform: translateY(-50%) translateZ(-200px) rotateX(45deg); transform: translateY(-50%) translateZ(-200px) rotateX(45deg); }
				100% { opacity: .3; -webkit-transform: translateY(-100%) rotateX(90deg); transform: translateY(-100%) rotateX(90deg); }
			}
			
			@-webkit-keyframes rotateCubeTopIn {
				0% { opacity: .3; -webkit-transform: translateY(100%) rotateX(-90deg); }
				50% { -webkit-animation-timing-function: ease-out; -webkit-transform: translateY(50%) translateZ(-200px) rotateX(-45deg); }
			}
			@keyframes rotateCubeTopIn {
				0% { opacity: .3; -webkit-transform: translateY(100%) rotateX(-90deg); transform: translateY(100%) rotateX(-90deg); }
				50% { -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; -webkit-transform: translateY(50%) translateZ(-200px) rotateX(-45deg); transform: translateY(50%) translateZ(-200px) rotateX(-45deg); }
			}
			
			@-webkit-keyframes rotateCubeBottomOut {
				0% { }
				50% { -webkit-animation-timing-function: ease-out; -webkit-transform: translateY(50%) translateZ(-200px) rotateX(-45deg); }
				100% { opacity: .3; -webkit-transform: translateY(100%) rotateX(-90deg); }
			}
			@keyframes rotateCubeBottomOut {
				0% { }
				50% { -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; -webkit-transform: translateY(50%) translateZ(-200px) rotateX(-45deg); transform: translateY(50%) translateZ(-200px) rotateX(-45deg); }
				100% { opacity: .3; -webkit-transform: translateY(100%) rotateX(-90deg); transform: translateY(100%) rotateX(-90deg); }
			}
			
			@-webkit-keyframes rotateCubeBottomIn {
				0% { opacity: .3; -webkit-transform: translateY(-100%) rotateX(90deg); }
				50% { -webkit-animation-timing-function: ease-out; -webkit-transform: translateY(-50%) translateZ(-200px) rotateX(45deg); }
			}
			@keyframes rotateCubeBottomIn {
				0% { opacity: .3; -webkit-transform: translateY(-100%) rotateX(90deg); transform: translateY(-100%) rotateX(90deg); }
				50% { -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; -webkit-transform: translateY(-50%) translateZ(-200px) rotateX(45deg); transform: translateY(-50%) translateZ(-200px) rotateX(45deg); }
			}
			
			/* carousel */
			
			@-webkit-keyframes rotateCarouselLeftOut {
				from { }
				to { opacity: .3; -webkit-transform: translateX(-150%) scale(.4) rotateY(-65deg); }
			}
			@keyframes rotateCarouselLeftOut {
				from { }
				to { opacity: .3; -webkit-transform: translateX(-150%) scale(.4) rotateY(-65deg); transform: translateX(-150%) scale(.4) rotateY(-65deg); }
			}
			
			@-webkit-keyframes rotateCarouselLeftIn {
				from { opacity: .3; -webkit-transform: translateX(200%) scale(.4) rotateY(65deg); }
			}
			@keyframes rotateCarouselLeftIn {
				from { opacity: .3; -webkit-transform: translateX(200%) scale(.4) rotateY(65deg); transform: translateX(200%) scale(.4) rotateY(65deg); }
			}
			
			@-webkit-keyframes rotateCarouselRightOut {
				from { }
				to { opacity: .3; -webkit-transform: translateX(200%) scale(.4) rotateY(65deg); }
			}
			@keyframes rotateCarouselRightOut {
				from { }
				to { opacity: .3; -webkit-transform: translateX(200%) scale(.4) rotateY(65deg); transform: translateX(200%) scale(.4) rotateY(65deg); }
			}
			
			@-webkit-keyframes rotateCarouselRightIn {
				from { opacity: .3; -webkit-transform: translateX(-200%) scale(.4) rotateY(-65deg); }
			}
			@keyframes rotateCarouselRightIn {
				from { opacity: .3; -webkit-transform: translateX(-200%) scale(.4) rotateY(-65deg); transform: translateX(-200%) scale(.4) rotateY(-65deg); }
			}
			
			@-webkit-keyframes rotateCarouselTopOut {
				from { }
				to { opacity: .3; -webkit-transform: translateY(-200%) scale(.4) rotateX(65deg); }
			}
			@keyframes rotateCarouselTopOut {
				from { }
				to { opacity: .3; -webkit-transform: translateY(-200%) scale(.4) rotateX(65deg); transform: translateY(-200%) scale(.4) rotateX(65deg); }
			}
			
			@-webkit-keyframes rotateCarouselTopIn {
				from { opacity: .3; -webkit-transform: translateY(200%) scale(.4) rotateX(-65deg); }
			}
			@keyframes rotateCarouselTopIn {
				from { opacity: .3; -webkit-transform: translateY(200%) scale(.4) rotateX(-65deg); transform: translateY(200%) scale(.4) rotateX(-65deg); }
			}
			
			@-webkit-keyframes rotateCarouselBottomOut {
				from { }
				to { opacity: .3; -webkit-transform: translateY(200%) scale(.4) rotateX(-65deg); }
			}
			@keyframes rotateCarouselBottomOut {
				from { }
				to { opacity: .3; -webkit-transform: translateY(200%) scale(.4) rotateX(-65deg); transform: translateY(200%) scale(.4) rotateX(-65deg); }
			}
			
			@-webkit-keyframes rotateCarouselBottomIn {
				from { opacity: .3; -webkit-transform: translateY(-200%) scale(.4) rotateX(65deg); }
			}
			@keyframes rotateCarouselBottomIn {
				from { opacity: .3; -webkit-transform: translateY(-200%) scale(.4) rotateX(65deg); transform: translateY(-200%) scale(.4) rotateX(65deg); }
			}
			
			/* sides */
			
			@-webkit-keyframes rotateSidesOut {
				from { }
				to { opacity: 0; -webkit-transform: translateZ(-500px) rotateY(90deg); }
			}
			@keyframes rotateSidesOut {
				from { }
				to { opacity: 0; -webkit-transform: translateZ(-500px) rotateY(90deg); transform: translateZ(-500px) rotateY(90deg); }
			}
			
			@-webkit-keyframes rotateSidesIn {
				from { opacity: 0; -webkit-transform: translateZ(-500px) rotateY(-90deg); }
			}
			@keyframes rotateSidesIn {
				from { opacity: 0; -webkit-transform: translateZ(-500px) rotateY(-90deg); transform: translateZ(-500px) rotateY(-90deg); }
			}
			
			/* slide */
			
			@-webkit-keyframes rotateSlideOut {
				0% { }
				25% { opacity: .5; -webkit-transform: translateZ(-500px); }
				75% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(-200%); }
				100% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(-200%); }
			}
			@keyframes rotateSlideOut {
				0% { }
				25% { opacity: .5; -webkit-transform: translateZ(-500px); transform: translateZ(-500px); }
				75% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(-200%); transform: translateZ(-500px) translateX(-200%); }
				100% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(-200%); transform: translateZ(-500px) translateX(-200%); }
			}
			
			@-webkit-keyframes rotateSlideIn {
				0%, 25% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(200%); }
				75% { opacity: .5; -webkit-transform: translateZ(-500px); }
				100% { opacity: 1; -webkit-transform: translateZ(0) translateX(0); }
			}
			@keyframes rotateSlideIn {
				0%, 25% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(200%); transform: translateZ(-500px) translateX(200%); }
				75% { opacity: .5; -webkit-transform: translateZ(-500px); transform: translateZ(-500px); }
				100% { opacity: 1; -webkit-transform: translateZ(0) translateX(0); transform: translateZ(0) translateX(0); }
			}
			
			/* animation delay classes */
			
			.pt-page-delay100 {
				-webkit-animation-delay: .1s;
				animation-delay: .1s;
			}
			.pt-page-delay180 {
				-webkit-animation-delay: .180s;
				animation-delay: .180s;
			}
			.pt-page-delay200 {
				-webkit-animation-delay: .2s;
				animation-delay: .2s;
			}
			.pt-page-delay300 {
				-webkit-animation-delay: .3s;
				animation-delay: .3s;
			}
			.pt-page-delay400 {
				-webkit-animation-delay: .4s;
				animation-delay: .4s;
			}
			.pt-page-delay500 {
				-webkit-animation-delay: .5s;
				animation-delay: .5s;
			}
			.pt-page-delay700 {
				-webkit-animation-delay: .7s;
				animation-delay: .7s;
			}
			.pt-page-delay1000 {
				-webkit-animation-delay: 1s;
				animation-delay: 1s;
			}
			</style>
			<div id="pageContainer">
				<div class="pt-page pt-page-current holder"></div>
			</div>
		`;
  }
  onEndAnimation($outpage, $inpage, outClass, inClass) {
    this.endCurrPage = false;
    this.endNextPage = false;

    $outpage.classList.remove('pt-page-current');
    outClass && $outpage.classList.remove(outClass);
    inClass && $inpage.classList.remove(inClass);
    $inpage.classList.add('pt-page-current');
  }
  addPage(page) {
    const holder = this.shadowDom.querySelector('.pt-page.holder');
    holder.append(page);
    holder.classList.remove('holder');

    var div = document.createElement('div');
    div.className = 'pt-page holder';
    this.$.pages.append(div);
    this.selectedItem = page;
  }
  setEffect(type) {
    this.effectType = type;
  }

  on(json) {
    const animEndEventName = window.AnimationSupport.end;

    this.currPage = this.shadowDom.querySelector('.pt-page-current');

    if (!json) {
      this.nextPage = this.shadowDom.querySelector('div.pt-page.holder');
    } else {
      this.selectedItem = this.shadowDom.querySelector(json.selected);
      this.nextPage = this.selectedItem.parentElement;
    }

    this.currPage.classList.remove('pt-page-current');
    this.nextPage.classList.add('pt-page-current');

    var outClass, inClass;

    switch (this.effectType) {
      case 1:
        outClass = 'pt-page-moveToLeft';
        inClass = 'pt-page-moveFromRight';
        break;
      case 2:
        outClass = 'pt-page-moveToRight';
        inClass = 'pt-page-moveFromLeft';
        break;
      case 3:
        outClass = 'pt-page-moveToTop';
        inClass = 'pt-page-moveFromBottom';
        break;
      case 4:
        outClass = 'pt-page-moveToBottom';
        inClass = 'pt-page-moveFromTop';
        break;
      case 5:
        outClass = 'pt-page-fade';
        inClass = 'pt-page-moveFromRight pt-page-ontop';
        break;
      case 6:
        outClass = 'pt-page-fade';
        inClass = 'pt-page-moveFromLeft pt-page-ontop';
        break;
      case 7:
        outClass = 'pt-page-fade';
        inClass = 'pt-page-moveFromBottom pt-page-ontop';
        break;
      case 8:
        outClass = 'pt-page-fade';
        inClass = 'pt-page-moveFromTop pt-page-ontop';
        break;
      case 9:
        outClass = 'pt-page-moveToLeftFade';
        inClass = 'pt-page-moveFromRightFade';
        break;
      case 10:
        outClass = 'pt-page-moveToRightFade';
        inClass = 'pt-page-moveFromLeftFade';
        break;
      case 11:
        outClass = 'pt-page-moveToTopFade';
        inClass = 'pt-page-moveFromBottomFade';
        break;
      case 12:
        outClass = 'pt-page-moveToBottomFade';
        inClass = 'pt-page-moveFromTopFade';
        break;
      case 13:
        outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
        inClass = 'pt-page-moveFromRight';
        break;
      case 14:
        outClass = 'pt-page-moveToRightEasing pt-page-ontop';
        inClass = 'pt-page-moveFromLeft';
        break;
      case 15:
        outClass = 'pt-page-moveToTopEasing pt-page-ontop';
        inClass = 'pt-page-moveFromBottom';
        break;
      case 16:
        outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
        inClass = 'pt-page-moveFromTop';
        break;
      case 17:
        outClass = 'pt-page-scaleDown';
        inClass = 'pt-page-moveFromRight pt-page-ontop';
        break;
      case 18:
        outClass = 'pt-page-scaleDown';
        inClass = 'pt-page-moveFromLeft pt-page-ontop';
        break;
      case 19:
        outClass = 'pt-page-scaleDown';
        inClass = 'pt-page-moveFromBottom pt-page-ontop';
        break;
      case 20:
        outClass = 'pt-page-scaleDown';
        inClass = 'pt-page-moveFromTop pt-page-ontop';
        break;
      case 21:
        outClass = 'pt-page-scaleDown';
        inClass = 'pt-page-scaleUpDown pt-page-delay300';
        break;
      case 22:
        outClass = 'pt-page-scaleDownUp';
        inClass = 'pt-page-scaleUp pt-page-delay300';
        break;
      case 23:
        outClass = 'pt-page-moveToLeft pt-page-ontop';
        inClass = 'pt-page-scaleUp';
        break;
      case 24:
        outClass = 'pt-page-moveToRight pt-page-ontop';
        inClass = 'pt-page-scaleUp';
        break;
      case 25:
        outClass = 'pt-page-moveToTop pt-page-ontop';
        inClass = 'pt-page-scaleUp';
        break;
      case 26:
        outClass = 'pt-page-moveToBottom pt-page-ontop';
        inClass = 'pt-page-scaleUp';
        break;
      case 27:
        outClass = 'pt-page-scaleDownCenter';
        inClass = 'pt-page-scaleUpCenter pt-page-delay400';
        break;
      case 28:
        outClass = 'pt-page-rotateRightSideFirst';
        inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
        break;
      case 29:
        outClass = 'pt-page-rotateLeftSideFirst';
        inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
        break;
      case 30:
        outClass = 'pt-page-rotateTopSideFirst';
        inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
        break;
      case 31:
        outClass = 'pt-page-rotateBottomSideFirst';
        inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
        break;
      case 32:
        outClass = 'pt-page-flipOutRight';
        inClass = 'pt-page-flipInLeft pt-page-delay500';
        break;
      case 33:
        outClass = 'pt-page-flipOutLeft';
        inClass = 'pt-page-flipInRight pt-page-delay500';
        break;
      case 34:
        outClass = 'pt-page-flipOutTop';
        inClass = 'pt-page-flipInBottom pt-page-delay500';
        break;
      case 35:
        outClass = 'pt-page-flipOutBottom';
        inClass = 'pt-page-flipInTop pt-page-delay500';
        break;
      case 36:
        outClass = 'pt-page-rotateFall pt-page-ontop';
        inClass = 'pt-page-scaleUp';
        break;
      case 37:
        outClass = 'pt-page-rotateOutNewspaper';
        inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
        break;
      case 38:
        outClass = 'pt-page-rotatePushLeft';
        inClass = 'pt-page-moveFromRight';
        break;
      case 39:
        outClass = 'pt-page-rotatePushRight';
        inClass = 'pt-page-moveFromLeft';
        break;
      case 40:
        outClass = 'pt-page-rotatePushTop';
        inClass = 'pt-page-moveFromBottom';
        break;
      case 41:
        outClass = 'pt-page-rotatePushBottom';
        inClass = 'pt-page-moveFromTop';
        break;
      case 42:
        outClass = 'pt-page-rotatePushLeft';
        inClass = 'pt-page-rotatePullRight pt-page-delay180';
        break;
      case 43:
        outClass = 'pt-page-rotatePushRight';
        inClass = 'pt-page-rotatePullLeft pt-page-delay180';
        break;
      case 44:
        outClass = 'pt-page-rotatePushTop';
        inClass = 'pt-page-rotatePullBottom pt-page-delay180';
        break;
      case 45:
        outClass = 'pt-page-rotatePushBottom';
        inClass = 'pt-page-rotatePullTop pt-page-delay180';
        break;
      case 46:
        outClass = 'pt-page-rotateFoldLeft';
        inClass = 'pt-page-moveFromRightFade';
        break;
      case 47:
        outClass = 'pt-page-rotateFoldRight';
        inClass = 'pt-page-moveFromLeftFade';
        break;
      case 48:
        outClass = 'pt-page-rotateFoldTop';
        inClass = 'pt-page-moveFromBottomFade';
        break;
      case 49:
        outClass = 'pt-page-rotateFoldBottom';
        inClass = 'pt-page-moveFromTopFade';
        break;
      case 50:
        outClass = 'pt-page-moveToRightFade';
        inClass = 'pt-page-rotateUnfoldLeft';
        break;
      case 51:
        outClass = 'pt-page-moveToLeftFade';
        inClass = 'pt-page-rotateUnfoldRight';
        break;
      case 52:
        outClass = 'pt-page-moveToBottomFade';
        inClass = 'pt-page-rotateUnfoldTop';
        break;
      case 53:
        outClass = 'pt-page-moveToTopFade';
        inClass = 'pt-page-rotateUnfoldBottom';
        break;
      case 54:
        outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
        inClass = 'pt-page-rotateRoomLeftIn';
        break;
      case 55:
        outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
        inClass = 'pt-page-rotateRoomRightIn';
        break;
      case 56:
        outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
        inClass = 'pt-page-rotateRoomTopIn';
        break;
      case 57:
        outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
        inClass = 'pt-page-rotateRoomBottomIn';
        break;
      case 58:
        outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
        inClass = 'pt-page-rotateCubeLeftIn';
        break;
      case 59:
        outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
        inClass = 'pt-page-rotateCubeRightIn';
        break;
      case 60:
        outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
        inClass = 'pt-page-rotateCubeTopIn';
        break;
      case 61:
        outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
        inClass = 'pt-page-rotateCubeBottomIn';
        break;
      case 62:
        outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
        inClass = 'pt-page-rotateCarouselLeftIn';
        break;
      case 63:
        outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
        inClass = 'pt-page-rotateCarouselRightIn';
        break;
      case 64:
        outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
        inClass = 'pt-page-rotateCarouselTopIn';
        break;
      case 65:
        outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
        inClass = 'pt-page-rotateCarouselBottomIn';
        break;
      case 66:
        outClass = 'pt-page-rotateSidesOut';
        inClass = 'pt-page-rotateSidesIn pt-page-delay200';
        break;
      case 67:
        outClass = 'pt-page-rotateSlideOut';
        inClass = 'pt-page-rotateSlideIn';
        break;
      default:
        outClass = '';
        inClass = '';
    }
    this.outClass = outClass;
    this.inClass = inClass;

    const curCallback = function() {
      this.currPage.removeEventListener(animEndEventName, curCallback);
      this.endCurrPage = true;
      if (this.endNextPage) {
        this.onEndAnimation(
          this.currPage,
          this.nextPage,
          this.outClass,
          this.inClass
        );
      }
    }.bind(this);

    const nextCallback = function() {
      this.nextPage.removeEventListener(animEndEventName, nextCallback);
      this.endNextPage = true;
      if (this.endCurrPage) {
        this.onEndAnimation(
          this.currPage,
          this.nextPage,
          this.outClass,
          this.inClass
        );
      }
    }.bind(this);

    this.currPage.addEventListener(animEndEventName, curCallback);
    this.nextPage.addEventListener(animEndEventName, nextCallback);

    this.outClass && this.currPage.classList.add(this.outClass);
    this.inClass && this.nextPage.classList.add(this.inClass);
  }
}

class HeroButton extends HeroElement {
  init() {
    this.$ = {
      button: this.shadowDom.querySelector('button'),
    };
    this.$.button.addEventListener('tap', this.onClick.bind(this));
    this.$.button.addEventListener('click', this.onClick.bind(this));
  }

  on(json) {
    if (json.title) {
      this.updateContent(this.$.button, json.title);
    }
    if (json.disabled) {
      this.updateAttr(this.$.button, 'disabled', json.disabled);
      if (json.titleDisabledColor) {
        this.$.button.style.color = '#' + json.titleDisabledColor;
      }
      if (json.backgroundDisabledColor) {
        this.$.button.style.background = '#' + json.backgroundDisabledColor;
      }
    } else {
      if (json.titleColor) {
        this.$.button.style.color = '#' + json.titleColor;
      }
      if (json.backgroundColor) {
        this.$.button.style.background = '#' + json.backgroundColor;
      }
    }
    if (json.size) {
      this.$.button.style.fontSize = json.size + 'px';
    }

    if (json.cornerRadius) {
      this.$.button.style.borderRadius = json.cornerRadius + 'px';
    }
    if (json.image) {
      var url;
      // this.$.title.innerHTML = '';
      if (json.image.startWith('http')) {
        url = json.image;
      } else if (json.image.search(/\./) > 0) {
        url = 'images/' + json.image;
      } else {
        url = 'images/' + json.image + '.png';
      }
      this.$.button.style.backgroundImage = 'url(' + url + ')';
      this.$.button.style.backgroundRepeat = 'no-repeat';
      this.$.button.style.backgroundPosition = 'center';
      this.$.button.style.backgroundSize = 'contain';
    }
  }

  onClick() {
    this.controller.on(this._json.click);
  }

  template(json) {
    return `
       <style>
          button {
            font-size: ${json.size}px;
            color: ${json.titleColor};
            background: ${json.backgroundColor};
            border-radius: ${json.cornerRadius}+'px';
            background: transparent;
            border: 0;
            height: 100%;
            width: 100%;
            color: #FFF;
            outline: 0;
          }
          button[disabled]{
            color: ${json.titleDisabledColor};
            background: ${json.backgroundDisabledColor};
          }
          div {
            text-align: center;
            height: 100%;
            width: 100%;
          }
        </style>
        <div>
          <button></button>
        </div>
      `;
  }
}

class HeroLabel extends HeroElement {
  init() {
    this.shadowDom.querySelector('#heroContent').style.pointerEvents='none';
    this.$ = {
      span: this.shadowDom.querySelector('span'),
    };
  }

  on(json) {
    if (json.text !== undefined) {
      this.updateContent(this.$.span, json.text);
    }
    if (!json.hasOwnProperty("numberOfLines") ) {
      this.$.span.style.lineHeight = this.$.heroContent.style.height;
    }    if (json.size) {
      this.$.span.style.fontSize = json.size + 'px';
    }
    if (json.alignment) {
      this.$.span.style.textAlign = json.alignment;
    }
    if (json.textColor) {
      this.$.span.style.color = '#' + json.textColor;
    }
    if (json.weight) {
      this.$.span.style.fontWeight = json.weight;
    }
  }

  template() {
    return `
         <style>
            span{
              display: block;
            }
          </style>
          <span></span>
        `;
  }
}

class HeroImageView extends HeroElement {
  constructor() {
    super();

    var _uploadUrl = '';
    var _uploadName = '';
    var _headers = '';
    var _wrapper;
    var _bigImg;
    var _types = ['image/jpg', 'image/jpeg', 'image/png'];

    this._uploadUrl = _uploadUrl;
    this._uploadName = _uploadName;
    this._headers = _headers;
    this._wrapper = _wrapper;
    this._bigImg = _bigImg;
    this._types = _types;
  }
  init() {
    this.shadowDom.querySelector('#heroContent').style.pointerEvents = 'none';
    this.$ = {
      img: this.shadowDom.querySelector('img'),
      input: this.shadowDom.querySelector('input'),
      upload: this.shadowDom.querySelector('#upload'),
    };
  }

  template() {
    return `
      <style type="text/css">
        img {
          margin: 0px;padding: 0px;
          width: 100%;height: 100%;border: 0px;
          pointer-events:auto;
        }
        input {
          display:none;
        }
        #upload{
          margin: 0px;padding: 0px;
          width: 100%;height: 100%;border: 0px;
          pointer-events:auto;
        }
        label{
          display:block;
          height:100%;
          width:100%;
          background:#6f787b;
          position:relative;
        }
        #upload-label::after {
         content:'';
         position:absolute;
         top:0;
         left:0;
         bottom:0;
         right:0;
         margin:auto;
         background: #000000;
         height:75px;
         width:10px;
      }
      #upload-label::before {
        content:'';
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;
        background: #000000;
        height:10px;
        width:75px;
     }
                  
      </style>  
      <img />
      <div id='upload'>
        <label for="file" id='upload-label'></label>
        <input type="file" id="file" name="" style="display: none"/>
      </div>
    `;
  }

  on(json) {
    if (json.base64image || json.image) {
      this.$.img.src = json.base64image || json.image;
    }
    if (json.headers) {
      this._headers = json.headers;
    }
    if (json.uploadName) {
      this._uploadName = json.uploadName;
    }
    if (json.showBig) {
      this.$.img.addEventListener('click', this.showBig.bind(this));
      this._wrapper = document.createElement('div');
      this._wrapper.style.height = '100%';
      this._wrapper.style.width = '100%';
      this._wrapper.style.background = 'rgba(0,0,0,0.8)';
      this._wrapper.style.position = 'absolute';
      this._wrapper.style.zIndex = '99998';
      this._wrapper.style.transition = `all 0.5s`;
      this._wrapper.style.opacity = 0;
      this._wrapper.style.visibility = 'hidden';
      this._wrapper.style.display = 'flex';
      this._wrapper.style.justifyContent = 'center';
      this._wrapper.style.alignItems = 'center';
      this._wrapper.addEventListener('click', this.showSmall.bind(this));

      this._bigImg = document.createElement('img');
      this._bigImg.style.height = 'auto';
      this._bigImg.style.width = '80%';
      this._bigImg.src = json.base64image || json.image;
      this._wrapper.appendChild(this._bigImg);
    }
    if (json.uploadUrl) {
      let _script = document.createElement('script');
      _script.src = './app/pickerviewbase/jquery-3.3.1.min.js';
      document.body.appendChild(_script);
      this.$.input.addEventListener('change', this.onChange.bind(this));
      this.$.img.style.display = 'none';
      this._uploadUrl = json.uploadUrl;
    } else {
      //fixd
      this.$.upload.style.display = 'none';
    }
  }
  showBig() {
    document.body.appendChild(this._wrapper);
    this._wrapper.style.visibility = 'visible';
    this._wrapper.style.opacity = 1;
  }
  showSmall() {
    this._wrapper.style.opacity = 0;
    this._wrapper.style.visibility = 'hidden';
  }
  onChange() {
    console.log(this._uploadUrl);
    var formFile = new FormData();
    var file = this.$.input.files[0];
    if (file.size > 1 * 1024 * 1024) {
      alert(`图片小于1mb${file.size}`);
      return;
    } else {
      let _filetype = file.type;
      for (let x in this._types) {
        //判断格式是否匹配
        if (_filetype == this._types[x]) {
          //匹配
          if (!formFile.get('upload')) {
            formFile.append('upload', file);
          } else {
            formFile.set('upload', file);
          }
          $.ajax({
            url: this._uploadUrl,
            type: 'POST',
            data: formFile,
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            success: res => {
              console.log(res);
              alert('上传成功');
            },
            error: res => {
              console.log(res);
              alert('上传失败');
            },
          });
          var r = new FileReader();
          let that = this;
          r.onload = function() {
            that.$.img.src = r.result;
            that._bigImg.src = r.result;
            that.$.img.style.display = 'block';
          };
          r.readAsDataURL(file);
          break;
        } else {
          if (x == this._types.length - 1) {
            //匹配失败
            alert(`格式不对${file.type}`);
            return;
          }
        }
      }
    }
  }
}

class HeroTextField extends HeroElement {
  init(json) {
    this.$ = {
      div: this.shadowDom.querySelector('div'),
      input: this.shadowDom.querySelector('input'),
    };

    this.$.input.addEventListener('change', this.textChange.bind(this));

    if (json.focus) {
      this.$.input.focus();
    }
    if (json.blur) {
      this.$.input.blur();
    }
  }

  on(json) {
    if (json.size) {
      this.$.input.style.fontSize = json.size + 'px';
    }

    if (json.textColor) {
      this.$.input.style.color = '#' + json.textColor;
    }
    if (json.clear) {
      json.text = '';
    }
    if (json.text) {
      this.$.input.value = json.text;
      if (this._json.textFieldDidEditing) {
        this._json.textFieldDidEditing.value = json.text;
        this._json.textFieldDidEditing.name = this._json.name;
        this.controller.on(this._json.textFieldDidEditing);
      }
    }

    this.controller && this.controller.on(json.textFieldDidEditing);

    if (json.placeHolder) {
      this.updateAttr(this.$.input, 'placeHolder', json.placeHolder);
    }

    if (json.secure) {
      json.type = 'password';
    }

    if (json.type === 'pin') {
      json.type = 'tel';
    }

    if (!json.type) {
      json.type = 'text';
    }

    this.updateAttr(this.$.input, 'type', json.type);

    if (json.focus) {
      this.$.input.focus();
    }

    if (json.blur) {
      this.$.input.blur();
    }
  }

  textChange(e) {
    var text = e.target.value;
    if (this._json.textFieldDidEditing) {
      this._json.textFieldDidEditing.value = text;
      this._json.textFieldDidEditing.name = this._json.name;
      this.controller.on(this._json.textFieldDidEditing);
    }
  }

  template() {
    return `
         <style>
            input{
                font-size: 16px;
                padding:0px;
                margin:0px;
                width: 100%;
                position: absolute;
                height: 100%;
                border:none;
                outline:none;
                padding-left:15px;
                background-color:transparent;
            }
            div{
                position: relative;
                height: 100%;
            }
          </style>
          <div>
            <input />
          </div>
        `;
  }
}

class HeroTableViewSection extends HeroElement {
  wrapperTemplate(html) {
    return html;
  }

  init() {
    this.$ = {
      sectionGap: this.shadowDom.querySelector('#sectionGap'),
      heroContent: this.shadowDom.querySelector('#heroContent'),
      title: this.shadowDom.querySelector('#title'),
    };
  }

  template() {
    return `
    <style type="text/css">
    :focus {outline:none;}
    #heroContent{
      margin: 0px;
      padding: 0px;
      background-color: #fff;
      border-bottom:1px solid #e4e4e4;
      border-top:1px solid #e4e4e4;
    }
    #title{
      display: block;
      font-size: 12px;
      color: #999;
      height: 29px;
      line-height: 29px;
      margin: 0px;
      padding: 0px;
      margin-left: 15px;
    }
    #sectionGap{
      display: block;
      height: 15px;
    }
    </style>
    <div id='sectionGap'></div>
    <p id='title'></p>
    <div id='heroContent'></div>
    `;
  }

  on(json) {
    if (!this.controller) {
      this.controller = window.APP.currentPage;
    }
    if (json.sectionTitle) {
      this.updateContent(this.$.title, json.sectionTitle);
    } else {
      this.$.title.style.display = 'none';
    }
    if (json.rows) {
      this.$.heroContent.innerHTML = '';
      for (var i = 0; i < json.rows.length; i++) {
        var row = json.rows[i];
        var cell;
        if (row.class || row.res) {
          cell = document.createElement(
            window.APP.camelCase2bar(row.class || row.res)
          );
          cell.controller = this.controller;
          this.$.heroContent.appendChild(cell);
          cell.in(row);
          cell.$.heroContent.style.position = 'relative';
        } else {
          cell = document.createElement('hero-table-view-cell');
          cell.controller = this.controller;
          this.$.heroContent.appendChild(cell);
          cell.in(row);
          this.$.heroContent.appendChild(cell);
        }
        if (row.height) {
          cell.$.heroContent.style.height = row.height + 'px';
        }
        if (i != json.rows.length - 1) {
          cell.in({ bottomLine: true });
        }
        this.$.heroContent.appendChild(cell);
      }
    }
  }
}

class HeroTableViewCell extends HeroElement {
  init() {
    this.$ = {
      ripple: this.shadowDom.querySelector('#ripple'),
      icon: this.shadowDom.querySelector('#icon'),
      heroContent: this.shadowDom.querySelector('#heroContent'),
      title: this.shadowDom.querySelector('#title'),
      other: this.shadowDom.querySelector('#other'),
      bottomLine: this.shadowDom.querySelector('#bottomLine'),
      rightIconWrap: this.shadowDom.querySelector('#rightIconWrap'),
      DisclosureIndicator: this.shadowDom.querySelector('.DisclosureIndicator'),
      Checkmark: this.shadowDom.querySelector('.Checkmark'),
      DetailButton: this.shadowDom.querySelector('.DetailButton'),
      rightIcon: this.shadowDom.querySelector('.rightIcon'),
    };

    var onTapCallback = this.onTap.bind(this);
    this.$.heroContent.addEventListener('touchstart', onTapCallback);
    this.$.heroContent.addEventListener('click', onTapCallback);
  }

  template() {
    return `
    <style type="text/css">
      :host {
        display: block;
        position:relative;
        width: 100%;
        margin: 0px;
        padding: 0px;
        border: 0px;
        overflow: hidden;
        background-color: #fff;
        left: 0px;
      }
      paper-ripple{
        width: 100%;
        height: 100%;
      }
      p{
        display: inline-block;
        position: absolute;
        overflow: hidden;
        margin: 0px;padding: 0px;width: 100%;height: 100%;
      }
      #title{
        left: 15px;
      }
      #other{
        font-size: 14px;
      }
      #bottomLine{
        left: 15px;
        height: 1px;
        right: 0px;
        bottom: 0px;
        display: none;
        background-color: #e4e4e4;
      }
      #icon{
        position: absolute;
        left: 15px;
        width: 15px;
        height: 15px;
        display: none;
      }
      #rightIconWrap{
        position: absolute;
        right: 15px;
        display: none;
      }
      .rightIcon,.DisclosureIndicator,.Checkmark,.DetailButton {
        display: none;
      }
      #heroContent{
        height: 44px;
        z-index: 1;
      }
      #ripple {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2;
      }
      #ripple:active {
        background-color: #aaa;
        opacity: 0.1;
      }
      </style>
      <div id='heroContent' on-Tap='onTap' >
        <paper-ripple id='ripple'></paper-ripple>
        <img id='icon' src=''>
        <p id='title'></p>
        <p id='other'></p>
        <div id="rightIconWrap">
          <svg class="DisclosureIndicator rightIcon" width="15px" height="15px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#cccccc" d="M233.172357 15.083013C254.338231-5.027671 288.693982-5.027671 309.859855 15.083013L791.398997 472.973481C802.695739 483.711593 807.506165 497.95666 806.73029 512.015518 807.506165 526.04334 802.695739 540.288407 791.398997 551.026519L309.859855 1008.916987C288.693982 1029.027671 254.338231 1029.027671 233.172357 1008.916987 211.975448 988.806304 211.975448 956.157478 233.172357 936.046795L679.114348 512.015518 233.172357 87.953205C211.975448 67.842522 211.975448 35.224731 233.172357 15.083013Z" /></svg>
          <svg class="Checkmark rightIcon" width="15px" height="15px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#cccccc" d="M384 691.2 204.8 512 145.066667 571.733333 384 810.666667 896 298.666667 836.266667 238.933333Z" /></svg>
          <svg class="DetailButton rightIcon" width="15px" height="15px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#cccccc" d="M512 0c282.428952 0 512 229.571048 512 512s-229.571048 512-512 512S0 794.428952 0 512 229.571048 0 512 0z m0 48.761905C256.512 48.761905 48.761905 256.512 48.761905 512s207.750095 463.238095 463.238095 463.238095c255.512381 0 463.238095-207.725714 463.238095-463.238095 0-255.488-207.725714-463.238095-463.238095-463.238095z m82.505143 654.774857c-39.253333 58.904381-79.335619 104.69181-147.260953 104.691809-45.787429-7.363048-65.414095-40.886857-54.784-74.435047l86.698667-287.939048a13.702095 13.702095 0 0 0-8.167619-17.16419c-6.558476-2.438095-18.822095 5.729524-30.281143 17.993143l-51.516952 64.609523c-1.633524-10.605714 0-27.794286 0-35.157333 39.253333-58.904381 104.69181-106.325333 148.041143-106.325333 41.71581 4.071619 61.342476 37.61981 53.979428 74.435047l-87.527619 289.548191c-0.804571 6.558476 2.462476 13.092571 8.192 15.555047 6.558476 2.438095 19.626667-5.729524 31.085715-17.993142l52.345904-63.000381c1.633524 9.825524-0.804571 28.647619-0.804571 35.181714z m-11.459048-376.271238c-33.54819 0-60.537905-24.551619-60.537905-59.733334 0-35.961905 26.989714-59.684571 60.537905-59.684571 33.54819 0 60.537905 24.527238 60.537905 59.708952 0 35.986286-26.989714 59.708952-60.537905 59.708953z" /></svg>
        </div>
       <p id='bottomLine'></p>
      </div>

    `;
  }
  wrapperTemplate(html) {
    return html;
  }

  ready() {
    super.ready();
    this.$.ripple.style.color = '#ddd';
  }

  on(json) {
    if (json.height) {
      this.$.heroContent.style.height = json.height + 'px';
    }

    if (json.textValue) {
      this.$.title.innerHTML = json.title;
      this.$.other.innerHTML = json.textValue;
      this.$.title.style.lineHeight = json.height ? json.height + 'px' : '44px';
      this.$.other.style.lineHeight = json.height ? json.height + 'px' : '44px';
      this.$.title.style.width = '50%';
      this.$.other.style.width = '50%';
      this.$.other.style.right = '15px';
      this.$.other.style.textAlign = 'right';
    } else if (json.detail) {
      this.$.title.innerHTML = json.title;
      this.$.other.innerHTML = json.detail;

      this.$.title.style.top = json.height ? json.height / 5 + 'px' : '4px';
      this.$.title.style.left = json.height ? json.height / 2 + 'px' : '30px';
      this.$.title.style.fontSize = json.height
        ? json.height / 4 + 2 + 'px'
        : '13px';
      this.$.other.style.left = json.height ? json.height / 2 + 'px' : '30px';
      this.$.other.style.top = json.height
        ? json.height / 2 + 4 + 'px'
        : '20px';
      this.$.other.style.fontSize = json.height
        ? json.height / 6 + 2 + 'px'
        : '8px';
      this.$.other.style.color = '#aaa';
    } else if (json.title) {
      this.$.title.innerHTML = json.title;
      this.$.title.style.lineHeight = json.height ? json.height + 'px' : '44px';
      this.$.title.style.left = json.height ? json.height / 2 + 'px' : '30px';
    }
    if (json.bottomLine) {
      this.$.bottomLine.style.display = 'block';
    }
    if (json.size) {
      this.$.title.style.fontSize = json.size + 'px';
      this.$.other.style.fontSize = json.size * 2 / 3 + 'px';
    }
    if (json.color) {
      this.$.title.style.color = '#' + json.color;
      this.$.other.style.color = '#' + json.color;
    }
    if (json.hasOwnProperty('ripple')) {
      if (json.ripple) {
        this.$.ripple.style.display = 'block';
      } else {
        this.$.ripple.style.display = 'none';
      }
    }
    if (json.hasOwnProperty('valueDelete')) {
      this.$.other.style.textDecoration = 'line-through';
    }

    if (json.image) {
      this.$.icon.style.display = 'block';
      this.$.icon.src = json.image;
      this.$.icon.style.top = json.height ? json.height / 4 + 'px' : '11px';
      this.$.icon.style.left = json.height ? json.height / 2 + 'px' : '30px';
      this.$.icon.style.width = json.height
        ? json.height * 2 / 4 + 'px'
        : '22px';
      this.$.icon.style.height = json.height
        ? json.height * 2 / 4 + 'px'
        : '22px';
      if (json.detail) {
        this.$.title.style.left = json.height
          ? json.height + 15 + 8 + 'px'
          : '67px';
        this.$.title.style.top = json.height ? json.height / 5 + 'px' : '4px';
        this.$.title.style.fontSize = json.height
          ? json.height / 4 + 2 + 'px'
          : '13px';

        this.$.other.style.top = json.height
          ? json.height / 2 + 4 + 'px'
          : '20px';
        this.$.other.style.left = json.height
          ? json.height + 15 + 8 + 'px'
          : '67px';
        this.$.other.style.fontSize = json.height
          ? json.height / 6 + 2 + 'px'
          : '9px';
        this.$.other.style.color = '#aaa';
      } else {
        this.$.title.style.left = json.height
          ? json.height * 2 / 3 + 40 + 'px'
          : '69px';
        this.$.title.style.top = '0px';
        this.$.title.style.height = json.height ? json.height + 'px' : '44px';
        this.$.title.style.lineHeight = json.height
          ? json.height + 'px'
          : '44px';
      }
    }

    // if rightButton
    if (json.accessoryType) {
      var btn = json.accessoryType;
      if (btn === 'DisclosureIndicator') {
        this.$.rightIcon.style.display = 'none';
        this.$.DisclosureIndicator.style.display = 'block';
      } else if (btn === 'DetailButton') {
        this.$.rightIcon.style.display = 'none';
        this.$.DetailButton.style.display = 'block';
      } else if (btn === 'Checkmark') {
        this.$.rightIcon.style.display = 'none';
        this.$.Checkmark.style.display = 'block';
      }
      this.$.rightIconWrap.style.display = 'block';
      this.$.rightIconWrap.style.top = json.height
        ? json.height / 3 + 'px'
        : '15px';
      this.$.rightIconWrap.style.width = json.height
        ? json.height * 2 / 6 + 'px'
        : '15px';
      this.$.rightIconWrap.style.height = json.height
        ? json.height * 2 / 6 + 'px'
        : '15px';
    }

    // titleXoffset
    if (json.indentationWidth) {
      this.$.title.style.left = json.indentationWidth + 'px';
      this.$.other.style.left = json.indentationWidth + 'px';
    }
  }

  onTap() {
    var json = this._json;
    if (json.action) {
      this.controller.on(json.action);
    } else {
      this.controller.on(json);
    }
  }
}

class HeroTableView extends HeroElement {
  init() {
    this.$ = {
      header: this.shadowDom.querySelector('#header'),
      footer: this.shadowDom.querySelector('#footer'),
      heroContent: this.shadowDom.querySelector('#heroContent'),
      tableData: this.shadowDom.querySelector('#table-data'),
    };
  }

  template() {
    return `
    <style type="text/css">
      #heroContent{
        display: inline-block;
        position: absolute;
        overflow: auto;
        padding: 0px;
        background-color: #fff;
      }
      #footer{
        margin-top: 5px;
        margin-bottom: 15px;
      }
      </style>
      <div id = 'header'></div>
      <div id="table-data">
        <hero-table-view-section></hero-table-view-section>
      </div>
      <div id = 'footer'></div>

    `;
  }

  on(json) {
    var viewObject, view;

    if (json.header) {
      this.$.header.innerHTML = '';
      viewObject = json.header;
      view = document.createElement(
        window.APP.camelCase2bar(viewObject.class || viewObject.res)
      );
      this.$.header.appendChild(view);
      view.controller = this.controller;
      if (viewObject.frame) {
        viewObject.frame.p = {
          w: parseInt(this.$.heroContent.style.width),
          h: parseInt(this.$.heroContent.style.height),
        };
      }
      view.in(viewObject);
      view.$.heroContent.style.position = 'relative';
    }
    if (json.data) {
      this.$.tableData.innerHTML =
        json.data &&
        json.data
          .map(function(ele) {
            return `
          <hero-table-view-section json='${JSON.stringify(
            ele
          )}'></hero-table-view-section>
        `;
          })
          .join('');
    }
    if (json.footer) {
      this.$.footer.innerHTML = '';
      viewObject = json.footer;
      view = document.createElement(
        window.APP.camelCase2bar(viewObject.class || viewObject.res)
      );
      this.$.footer.appendChild(view);
      view.controller = this.controller;
      if (viewObject.frame) {
        viewObject.frame.p = {
          w: parseInt(this.$.heroContent.style.width),
          h: parseInt(this.$.heroContent.style.height),
        };
      }
      view.in(viewObject);
      view.$.heroContent.style.position = 'relative';
    }
    var that = this;
    // this.async(function(){
    for (var i = 0; i < that.$.heroContent.children.length; i++) {
      that.$.heroContent.children[i].controller = that.controller;
    }
    // },100);
  }
}

class HeroTextView extends HeroElement {
  init() {
    this.$ = {
      textarea: this.shadowDom.querySelector('textarea'),
    };

    this.$.textarea.addEventListener('change', this.textChange.bind(this));
  }

  template() {
    return `
    <style type="text/css">
      textarea{
        display: block;
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 100%;
        line-height: 1.4;
        vertical-align: center;
        border-color: #fff;
        background-color: transparent;
        border:none;
        outline:none;
        padding: 10px;
      }
      </style>
      <textarea id='text'></textarea>
    `;
  }

  on(json) {
    if (json.size) {
      this.$.textarea.style.fontSize = json.size + 'px';
    }
    if (json.alignment) {
      this.$.textarea.style.textAlign = json.alignment;
    }
    if (json.textColor) {
      this.$.textarea.style.color = '#' + json.textColor;
    }
    if (json.append) {
      this.text = (this.text || '') + '\n' + json.append;
      this.$.textarea.scrollTop =
        this.$.textarea.scrollHeight - this.$.textarea.clientHeight;
    }

    if (json.text) {
      this.$.textarea.value = json.text;
      if (this._json.textFieldDidEditing) {
        this._json.textFieldDidEditing.value = json.text;
        this._json.textFieldDidEditing.name = this._json.name;
        this.controller.on(this._json.textFieldDidEditing);
      }
    }
  }

  textChange(e) {
    var text = e.target.value;
    if (this._json.textFieldDidEditing) {
      this._json.textFieldDidEditing.value = text;
      this._json.textFieldDidEditing.name = this._json.name;
      this.controller.on(this._json.textFieldDidEditing);
    }
  }
}

class HeroToast extends HeroElement {
  init() {
    this.$ = {
      div: this.shadowDom.querySelector('#hero-toast-wrap'),
  };
}

template() {
    return `
    <style type="text/css">
    * {
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    @keyframes bounceInLeft {
        from, 60%, 75%, 90%, to {animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);}
        0% {opacity: 0;transform: translate3d(-3000px, 0, 0);}
        60% {opacity: 1;transform: translate3d(25px, 0, 0);}
        75% {transform: translate3d(-10px, 0, 0);}
        90% {transform: translate3d(5px, 0, 0);}
        100% {opacity: 1;transform: none;}
    }
    @keyframes bounceInRight {
        from, 60%, 75%, 90%, to {animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);}
        0% {opacity: 0;transform: translate3d(3000px, 0, 0);}
        60% {opacity: 1;transform: translate3d(-25px, 0, 0);}
        75% {transform: translate3d(10px, 0, 0);}
        90% {transform: translate3d(-5px, 0, 0);}
        100% {opacity: 1;transform: none;}
    }

    #hero-toast-wrap {
        position: absolute;
        width: 330px;
        height:auto;
    }

    .hero-toast-box {
        display: flex;
        width: 330px;
        padding: 14px 26px 14px 13px;
        border-radius: 8px;
        box-sizing: border-box;
        border: 1px solid #ebeef5;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        transition: opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s;
        margin-top: 10px;
        opacity: 0;
        overflow: hidden;
    }

    .fit-left-top {
        left: 10px;
        top: 10px;
        animation: bounceInLeft 0.5s 0.5s linear forwards;
    }

    .fit-left-bottom {
        left: 10px;
        bottom: 10px;
        animation: bounceInLeft 0.5s 0.5s linear forwards;
    }

    .fit-right-top {
        right: 10px;
        top: 10px;
        animation: bounceInRight 0.5s 0.5s linear forwards;
    }

    .fit-right-bottom {
        right: 10px;
        bottom: 10px;
        animation: bounceInRight 0.5s 0.5s linear forwards;
    }

    .hidden {
        display: none;
        opacity: 0;
    }
    </style>
    <div id="hero-toast-wrap"></div>
    `;
}

on(json) {
    // json.position : leftTop (default) || rightTop || leftBottom || rightBottom
    var position = json.position ? json.position : "leftTop";
    if (json.text && json.text.length > 0) {
        let heroToastItem = document.createElement("div");
        this.$.div.appendChild(heroToastItem);
        var style = {};
        var toastPos = "";
        switch (position) {
            case "leftTop":
            toastPos = "fit-left-top";
            style = {
                left: "10px",
                top: 0
            };
            break;
            case "rightTop":
            toastPos = "fit-right-top";
            style = {
                right: "10px",
                top: 0
            };
            break;
            case "leftBottom":
            toastPos = "fit-left-bottom";
            style = {
                left: "10px",
                bottom: "10px"
            };
            break;
            case "rightBottom":
            toastPos = "fit-right-bottom";
            style = {
                right: "10px",
                bottom: "10px"
            };
            break;
        }
        // add className
        heroToastItem.className += `hero-toast-box ${toastPos} hidden`;
        // change style
        for( var i in style) {
            this.$.div.style[i] = style[i];
        }        // get childNodes Array
        this.$.p = this.$.div.childNodes;
        let len = this.$.p.length;
        // show and hidden item 
        for (let i = len-1; i >= 0; i--) {
            this.updateContent(this.$.p[len-1], json.text);
            this.$.p[len-1].classList.remove('hidden');
            var that = this;
            setTimeout(function () {
                that.$.p[len-i-1].classList.add('hidden'); 
            }, 3000);
        }
        }
    }
}

class HeroToolbarItem extends HeroElement {
  init() {
    this.$ = {
      button: this.shadowDom.querySelector('#btn'),
      div: this.shadowDom.querySelector('#wpr'),
      icon: this.shadowDom.querySelector('img'),
      span: this.shadowDom.querySelector('#wpr span'),
    };
    var onTapCallback = this.onTap.bind(this);
    this.$.button.addEventListener('touchstart', onTapCallback);
    this.$.button.addEventListener('click', onTapCallback);
  }

  template() {
    return `
    <style type="text/css">
      #wpr{
        display: inline-block;
        position: absolute;
        overflow: hidden;
        text-align:center;
        width: 100%;
        height: 100%;
      }
      #btn{
        display: inline-block;
        position: absolute;
        overflow: hidden;
        left:0px;
        top:0px;
        height:100%;
        width:100%;
      }
      #span{
        display: block;
        overflow: hidden;
        position:absolute;
        text-align: center;
        width:100%;
        height:100%;
        line-height:100%;
        pointer-events:none;
      }
      img{
        display: none;
        position:absolute;
        overflow: hidden;
        left:30%;
        width:40%;
        top:10%;
        height:40%;
        pointer-events:none;
      }
      #wpr.selected #btn{
        background: rgba(0, 0, 0, 0.08);
      }
      #wpr.selected #span{
        color: #00BC8D;
      }
      </style>
      <div id="wpr">
        <img id="icon" />
        <span id="span"></span>
        <div id="btn"></div>
      </div>
    `;
  }

  onTap() {
    this.selected = !this.selected;
    this.addSelectedClz();
    if (this._json.click) {
      this.controller.on(this._json.click);
    }
  }
  addSelectedClz() {
    if (this.selected) {
      this.$.div.classList.add('selected');
    } else {
      this.$.div.classList.remove('selected');
    }
  }
  on(json) {
    if (json.title) {
      this.$.span.innerHTML = json.title;
    }
    if (json.image) {
      this.$.icon.style.display = 'block';
      this.$.icon.src = json.image;
      this.$.span.style.top = '50%';
      this.$.span.style.height = '50%';
    }
    var that = this;
    setTimeout(function(){
      if (json.image) {
        that.$.span.style.lineHeight = that.$.span.getBoundingClientRect().height+'px';
      }else{
        that.$.span.style.lineHeight = that.$.span.getBoundingClientRect().height+'px';
      }
    },100);
    this.selected = this._json.selected;
    this.addSelectedClz();
  }
}

class HeroView extends HeroElement {
  
}

class HeroViewController extends HeroElement {
  findViewByname(name, root) {
    var view = root.querySelector('#' + name);
    if (!view || !view.json) {
      for (var i = 0; i < root.children.length; i++) {
        if (root.children[i].$ && root.children[i].$.heroContent) {
          view = this.findViewByname(name, root.children[i].$.heroContent);
          if (view) {
            break;
          }
        }
      }
    }
    if (view && view.$ && view.$.heroContent) {
      return view;
    }
  }
  ui2Data(observeUI) {
    if (Array.isArray(observeUI)) {
      for (var i = 0; i < observeUI.length; i++) {
        this.ui2Data(observeUI[i]);
      }
    } else if (observeUI.subViews) {
      this.ui2Data(observeUI.subViews);
    }
    if (observeUI.name) {
      window.ui2Data['_' + observeUI.name] = '';
      window.ui2Data.__defineSetter__(observeUI.name, function(v) {
        window.ui2Data['_' + observeUI.name] = v;
        var data = { name: observeUI.name };
        if (typeof v == 'string') {
          data.text = v;
        } else {
          for (var key in v) {
            data[key] = v[key];
          }
        }
        window.Hero.out({ datas: data });
      });
      window.ui2Data.__defineGetter__(observeUI.name, function() {
        return window.ui2Data['_' + observeUI.name];
      });
    }
  }

  template() {
    return `
      <style>
        div{
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          visibility: hidden;
          overflow: hidden;
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-transform: translate3d(0, 0, 0);
          -moz-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
          -webkit-transform-style: preserve-3d;
          -moz-transform-style: preserve-3d;
          transform-style: preserve-3d;
        }
      </style>
    `;
  }
  connectedCallback() {
    if (window.Hero && window.Hero.ui) {
      this.view = window.Hero.ui;
      this.controller = window.Hero;
      window.Hero.page = this;
      var heroContent = document.createElement('div');
      heroContent.style.height = '100%';
      heroContent.style.width = '100%';
      this.appendChild(heroContent);
      this.heroContent = heroContent;
      if (this.view.backgroundColor) {
        heroContent.style.backgroundColor = window.APP.str2Color(
          this.view.backgroundColor
        );
      } else {
        heroContent.style.backgroundColor = '#ffffff';
      }
      this.viewWillAppear();
      this.viewDidLoad();
    } else {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'inline-block';
      iframe.style.position = 'absolute';
      iframe.style.overflow = 'hidden';
      iframe.style.top = '0px';
      iframe.style.left = '0px';
      iframe.style.border = '0px';
      iframe.style.borderWidth = '0px';
      iframe.style.height = '100%';
      iframe.style.width = '100%';
      this.appendChild(iframe);
      var url = this.url;
      setTimeout(function() {
        iframe.src = url;
      }, 1000);
      var that = this;
      iframe.onload = function() {
        try {
          that.title = iframe.contentDocument.title;
          // eslint-disable-next-line
        } catch (e) {}
        window.APP.setNav({ title: that.title });
      };
    }
  }

  viewDidLoad() {
    if (this.controller) {
      this.controller.boot();
    }
  }

  viewWillAppear() {
    if (this.view && this.view.nav) {
      if (this.view.tintColor) {
        this.view.nav.tintColor = this.view.tintColor;
      }
      window.APP.setNav(this.view.nav);
    } else {
      window.APP.setNav({ title: this.title });
    }
    if (this.appearObject) {
      this.controller.in(this.appearObject);
    } else if (window.Hero && window.Hero.viewWillAppear) {
      window.Hero.viewWillAppear();
    }
  }

  viewWillDisappear() {
    if (this.disAppearObject) {
      this.controller.in(this.disAppearObject);
    } else if (window.Hero.viewWillDisppear) {
      window.Hero.viewWillDisppear();
    }
  }

  on(json) {
    if (!json) {
      return;
    }
    var element, num, viewObject, view;
    if (Array.isArray(json)) {
      for (num in json) {
        this.on(json[num]);
      }
      return;
    }
    if (json.appearance) {
      window.APP.setNav({ nav: json.appearance });
    } else if (json.ui) {
      while (this.heroContent.lastChild) {
        this.heroContent.removeChild(this.heroContent.lastChild);
      }
      if (json.ui.leftMenu) {
        var leftMenu = json.ui.leftMenu;
        window.APP.$.leftMenu.style.backgroundColor =
          '#' + (leftMenu.backgroundColor || 'f5f5f5');
        for (num in leftMenu.views) {
          viewObject = leftMenu.views[num];
          view = document.createElement(
            window.APP.camelCase2bar(viewObject.class || viewObject.res)
          );
          if (view.in) {
            window.APP.$.leftMenu.appendChild(view);
            view.controller = this;
            view.in(viewObject);
          }
        }
      }
      var views = json.ui.views;
      for (num in views) {
        viewObject = views[num];
        view = document.createElement(
          window.APP.camelCase2bar(viewObject.class || viewObject.res)
        );
        if (view.in) {
          this.heroContent.appendChild(view);
          view.controller = this;
          if (viewObject.frame) ;
          view.in(viewObject);
        }
      }
    } else if (json.ui_fragment) {
      var parentElement;
      for (num in json.ui_fragment) {
        view = json.ui_fragment[num];
        if (view.parent) {
          parentElement = this.findViewByname(view.parent, this.heroContent);
        } else {
          parentElement = this.heroContent;
        }
        element = document.createElement(
          window.APP.camelCase2bar(view.class || view.res)
        );
        parentElement.appendChild(element);
        parentElement.$.heroContent.appendChild(element);
        element.controller = this;
        element.in(view);
      }
    } else if (json.datas) {
      var datas = json.datas;
      if (Array.isArray(datas)) {
        for (num in datas) {
          var data = datas[num];
          element = this.findViewByname(data.name, this.heroContent);
          // if (!element) {
          //   element = this.findViewByname(data.name, document.body);
          // }
          if (element && element.in) {
            element.in(data);
          }
        }
      } else {
        if (datas.frame) {
          datas.frame.p = { w: window.innerWidth, h: window.innerHeight };
        }
        element = this.findViewByname(datas.name, this.heroContent);
        if (!element) {
          element = this.findViewByname(datas.name, document.body);
        }
        if (element && element.in) {
          element.in(datas);
        }
      }
    } else if (json.command) {
      var command = json.command;
      var loading;
      if (typeof command === 'string') {
        if (command === 'refresh') {
          window.location.reload();
        } else if (command === 'showLoading') {
          loading = this.findViewByname('loading', this.heroContent);
          if (!loading) {
            loading = document.createElement('hero-loading');
            loading.controller = this;
            this.heroContent.appendChild(loading);
          }
          loading.in({ show: true, name: 'loading' });
        } else if (command === 'stopLoading') {
          loading = this.findViewByname('loading', this.heroContent);
          if (loading) {
            loading.in({ show: false });
          }
          var showing =
            document.querySelector('hero-dialog') ||
            document.querySelector('hero-loading');
          if (showing) {
            showing.parentElement.removeChild(showing);
          }
        } else if (command.substring(0, 5) === 'goto:') {
          var url = command.replace('goto:', '');
          if (url.substring(0, 3) == 'tel') {
            // this.on({command:{show:{title:'拨打电话'+url}}});
            window.location.href = 'tel://' + url;
          } else {
            window.APP.gotoPage(url);
          }
        } else if (command.substring(0, 5) === 'load:') {
          window.APP.gotoPage(command.substring(5, command.length), 'load');
        } else if (command.substring(0, 16) === 'gotoWithLoading:') {
          window.APP.gotoPage(command.substring(16, command.length));
        } else if (command.substring(0, 4) === 'back') {
          window.history.back();
        } else if (command.substring(0, 8) === 'rootBack') {
          window.history.back();
        } else if (command.substring(0, 8) === 'present:') {
          var _data = {};
          var params = (window.location.search.split('?')[1] || '').split('&');
          for (var param in params) {
            if (params.hasOwnProperty(param)) {
              var paramParts = params[param].split('=');
              _data[paramParts[0]] = decodeURIComponent(paramParts[1] || '');
            }
          }
          if (_data.heropage) {
            window.presentedPage = _data.heropage;
          }
          window.APP.gotoPage(command.substring(8, command.length), 'present');
        } else if (command.substring(0, 7) === 'dismiss') {
          if (window.presentedPage) {
            window.APP.gotoPage(window.presentedPage);
            window.presentedPage = '';
          } else {
            window.history.back();
          }
        } else if (command.substring(0, 6) === 'submit') ;
      } else if (command.hasOwnProperty('showMenu')) {
        var showMenu = command.showMenu;
        window.APP.showLeftmenu(showMenu);
      } else if (command.show) {
        if (command.show.action || command.show.cancelAction) {
          var confirm = document.createElement('hero-confirm');
          confirm.controller = this;
          confirm.in({
            text: command.show.content || '',
            action: command.show.action,
            cancelAction: command.show.cancelAction,
          });
          this.heroContent.appendChild(confirm);
        } else if (command.show.title || command.show.content) {
          var alert = document.createElement('hero-alert');
          alert.controller = this;
          alert.in({ text: command.show.title || command.show.content });
          this.heroContent.appendChild(alert);
        } else if (command.show.class) {
          var dialog = document.createElement('hero-dialog');
          dialog.controller = this;
          dialog.in({ str: JSON.stringify(command.show) });
          document.body.appendChild(dialog);
        }
      } else if (command.delay) {
        var delayObj = command.delay;
        var delayTime = command.delayTime;
        var that = this;
        setTimeout(function() {
          that.on(delayObj);
        }, delayTime);
      } else if (command.viewWillAppear) {
        this.appearObject = command.viewWillAppear;
      }
      // else if (command.viewWillDisappear) {

      // }
    } else {
      if (window.APP.mobile) {
        this.controller.in(json);
      } else {
        for (var i = 0; i < window.Heros.length; i++) {
          window.Heros[i].in(json);
        }
      }
    }
  }
}

class HeroApp extends HeroElement {
  wrapperTemplate(html) {
    return html;
  }
  init() {
    this.rootPages = [];
    this.pageStack = [];
    this.loadedPages = [];
    this.currentPage = [];
    if (this.mobile) {
      this.$ = {
        tab: this.shadowDom.querySelector('#tab'),
        bar: this.shadowDom.querySelector('#bar'),
        title: this.shadowDom.querySelector('#title'),
        pages: this.shadowDom.querySelector('#pages'),
        menu: this.shadowDom.querySelector('#menu'),
        cover: this.shadowDom.querySelector('#cover'),
        leftMenu: this.shadowDom.querySelector('#leftMenu'),
        rightMenu: this.shadowDom.querySelector('#rightMenu'),
        backBtn: this.shadowDom.querySelector('#backBtn'),
        leftBtn: this.shadowDom.querySelector('#leftBtn'),
        rightBtn: this.shadowDom.querySelector('#rightBtn'),
        leftBtn2: this.shadowDom.querySelector('#leftBtn2'),
        rightBtn2: this.shadowDom.querySelector('#rightBtn2'),
      };
    } else {
      this.$ = {
        tab: this.shadowDom.querySelector('#pad_tab'),
        bar: this.shadowDom.querySelector('#pad_bar'),
        title: this.shadowDom.querySelector('#title'),
        rootPages: this.shadowDom.querySelector('#root_pages'),
        contentPages: this.shadowDom.querySelector('#content_pages'),
        menu: this.shadowDom.querySelector('#menu'),
        cover: this.shadowDom.querySelector('#cover'),
        leftMenu: this.shadowDom.querySelector('#leftMenu'),
        rightMenu: this.shadowDom.querySelector('#rightMenu'),
        backBtn: this.shadowDom.querySelector('#backBtn'),
        leftBtn: this.shadowDom.querySelector('#leftBtn'),
        rightBtn: this.shadowDom.querySelector('#rightBtn'),
        leftBtn2: this.shadowDom.querySelector('#leftBtn2'),
        rightBtn2: this.shadowDom.querySelector('#rightBtn2'),
      };
      var backSVG = document.createElement('div');
      backSVG.innerHTML =
        '<svg class="icon" width="100%" height="100%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M268.896 476.032 622.24 125.92c18.848-18.656 49.216-18.528 67.872 0.32 18.656 18.816 18.528 49.216-0.32 67.872l-319.456 316.576 318.176 321.056c18.656 18.816 18.528 49.216-0.32 67.872-9.344 9.28-21.568 13.92-33.792 13.92-12.352 0-24.704-4.736-34.08-14.208L270.208 545.984c-0.512-0.512-0.672-1.248-1.184-1.792-0.128-0.128-0.288-0.16-0.416-0.288C249.952 525.088 250.08 494.688 268.896 476.032z" /></svg>';
      this.$.backBtn.shadowDom.appendChild(backSVG);
    }

    var localStorageTemp = {};
    var forceMem = false;
    try {
      window.localStorage.boot = '{}';
    } catch (e) {
      forceMem = true;
    }
    if (forceMem) {
      window.__defineGetter__('localStorage', function() {
        return localStorageTemp;
      });
    }
  }

  template() {
    this.mobile = /iphone|ipad|ipod|android|blackberry|mini|palm/i.test(
      navigator.userAgent.toLowerCase()
    );
    if (this.mobile) {
      return `
      <style>
        :host {
          display: block;
          position: absolute;
          margin: 0px;
          padding: 0px;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        #bar {
          display:block;
          position: absolute;
          overflow:hidden;
          top: 0px;
          width: 100%;
          height: 43px;
          background-color: #ffffff;
          border-bottom:1px solid #ddd;
        }
        #tab {
          display:block;
          position: absolute;
          overflow:hidden;
          bottom: 0px;
          width: 100%;
          height: 44px;
          background-color: #fff;
          border-top:1px solid #ddd;
        }
        #cover {
          display:block;
          position: absolute;
          overflow:hidden;
          height: 100%;
          width: 100%;
          background: url(../../../images/cover.jpeg);
          background-color: #fff;
          background-size:cover;
          z-index:1
        }
        #menu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.4);
        }
        #leftMenu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          width: 66%;
          background-color: #fff;
        }
        #rightMenu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          left: 34%;
          width: 66%;
          background-color: #fff;
        }
        #title {
          display:inline-block;
          position: absolute;
          overflow:hidden;
          width: 100%;
          height: 100%;
          color: #000;
          font-size: 20px;
          text-align: center;
          top:-10px;
          pointer-events:none;
        }
        #leftBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          color: #fff;
          width: 40px;
          height: 30px;
          left:10px;
          top:7px;
        }
        #leftBtn2 {
          display:none;
          position: absolute;
          overflow:hidden;
          color: #fff;
          width: 40px;
          height: 30px;
          left:60px;
          top:7px;
        }
        #backBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 25px;
          height: 25px;
          left:10px;
          top:9.5px;
        }
        #rightBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 40px;
          height: 30px;
          right:10px;
          top:7px;
        }
        #rightBtn2 {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 40px;
          height: 30px;
          right:60px;
          top:7px;
        }
        hero-pages{
          display:block;
          position: absolute;
          overflow:hidden;
          top: 44px;
          bottom: 100%;
          width: 100%;
        }
        @keyframes backBtnIn
        {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes backBtnOut
        {
          from {opacity: 1;}
          to {opacity: 0;}
        }
        @keyframes coverGo
        {
          from {opacity: 1;}
          to {opacity: 0;}
          from {transform:scale(1,1);}
          to {transform:scale(1.1,1.1);}
        }
        @keyframes leftMenuIn
        {
          from {left: -66%;}
          to {left: 0%;}
        }
        @keyframes leftMenuOut
        {
          from {left: 0%;}
          to {left: -66%;}
        }
      </style>

      <div id='bar'>
        <hero-button class='btn' id ='backBtn'></hero-button>
        <hero-button class='btn' id ='leftBtn'></hero-button>
        <hero-button class='btn' id ='leftBtn2'></hero-button>
        <hero-button class='btn' id ='rightBtn'></hero-button>
        <hero-button class='btn' id ='rightBtn2'></hero-button>
        <p id='title'></p>
      </div>
      <hero-pages id='pages'></hero-pages>
      <div id='tab'></div>
      <div id='menu' on-tap='closeMenu'>
        <div id='leftMenu'></div>
        <div id='rightMenu'></div>
      </div>
      <div id='cover'></div>

      `;
    } else {
      return `
      <style>
        :host {
          display: block;
          position: absolute;
          margin: 0px;
          padding: 0px;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        #pad_bar {
          display:block;
          position: absolute;
          overflow:hidden;
          top: 0px;
          left: 440px;
          right: 0px;
          height: 88px;
          background-color: #ffffff;
          border-bottom:1px solid #ddd;
        }
        #pad_tab {
          display:block;
          position: absolute;
          overflow:hidden;
          left:0px;
          width:120px;
          height: 100%;
          background-color: #fff;
          border-right:1px solid #ddd;
        }
        #root_pages{
          display:block;
          position: absolute;
          overflow:hidden;
          top: 0px;
          left: 121px;
          width: 320px;
          height: 100%;
          border-right:1px solid #ddd;
        }
        #content_pages{
          display:block;
          position: absolute;
          overflow:hidden;
          top: 0px;
          left: 442px;
          right: 0px;
          height: 100%;
        }
        #cover {
          display:block;
          position: absolute;
          overflow:hidden;
          height: 100%;
          width: 100%;
          background: url(../../../images/cover.jpeg);
          background-color: #fff;
          background-size:cover;
          z-index:1;
        }
        #menu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.4);
        }
        #leftMenu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          width: 66%;
          background-color: #fff;
        }
        #rightMenu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          left: 34%;
          width: 66%;
          background-color: #fff;
        }
        #title {
          display:inline-block;
          position: absolute;
          overflow:hidden;
          width: 100%;
          height: 100%;
          line-height:88px;
          margin:0px;
          color: #000;
          font-size: 30px;
          text-align: center;
          pointer-events:none;
        }
        #leftBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          color: #fff;
          width: 40px;
          height: 30px;
          left:20px;
          top:29px;
        }
        #leftBtn2 {
          display:none;
          position: absolute;
          overflow:hidden;
          color: #fff;
          width: 40px;
          height: 30px;
          left:80px;
          top:29px;
        }
        #backBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 25px;
          height: 25px;
          left:10px;
          top:32px;
        }
        #rightBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 40px;
          height: 30px;
          right:20px;
          top:29px;
        }
        #rightBtn2 {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 40px;
          height: 30px;
          right:80px;
          top:29px;
        }
        @keyframes backBtnIn
        {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes backBtnOut
        {
          from {opacity: 1;}
          to {opacity: 0;}
        }
        @keyframes coverGo
        {
          from {opacity: 1;}
          to {opacity: 0;}
          from {transform:scale(1,1);}
          to {transform:scale(1.1,1.1);}
        }
        @keyframes leftMenuIn
        {
          from {left: -66%;}
          to {left: 0%;}
        }
        @keyframes leftMenuOut
        {
          from {left: 0%;}
          to {left: -66%;}
        }
      </style>
      <div id='pad_bar'>
        <hero-button class='btn' id ='backBtn'></hero-button>
        <hero-button class='btn' id ='leftBtn'></hero-button>
        <hero-button class='btn' id ='leftBtn2'></hero-button>
        <hero-button class='btn' id ='rightBtn'></hero-button>
        <hero-button class='btn' id ='rightBtn2'></hero-button>
        <p id='title'></p>
      </div>
      <hero-pages id='root_pages'></hero-pages>
      <hero-pages id='content_pages'></hero-pages>
      <div id='pad_tab'></div>
      <div id='pad_menu' on-tap='closeMenu'>
        <div id='leftMenu'></div>
        <div id='rightMenu'></div>
      </div>
      <div id='cover'></div>
        `;
    }
  }

  on(json) {
    var i, item;

    if (json.tabs) {
      this.tabs = json.tabs;
      for (i = 0; i < json.tabs.length; i++) {
        var tab = json.tabs[i];
        this.rootPages.push(this.page2Element(tab.url));
        item = document.createElement('hero-toolbar-item');
        this.$.tab.appendChild(item);
        this.$.tab.style.backgroundColor = '#' + tab.backgroundColor;
        this.$.tab.style.color = '#' + tab.color;
        item.setController(this);
        if (this.mobile) {
          item.in({
            frame: {
              x: i / json.tabs.length + 'x',
              w: 1 / json.tabs.length + 'x',
              y: '0',
              h: '44',
            },
            image: tab.image,
            title: tab.title,
            selected: i == 0,
            click: { select: i + 1 },
          });
        } else {
          item.in({
            frame: {
              x: '0',
              w: '120',
              y: i * 120 + (i + 1) * 10 + '',
              h: '120',
            },
            image: tab.image,
            title: tab.title,
            selected: i == 0,
            click: { select: i + 1 },
          });
        }
      }
      if (this.tabs.length == 1) {
        this.$.tab.style.display = 'none';
        if (this.mobile) {
          this.$.pages.style.bottom = '0px';
        }
      }
      this.gotoPage(json.tabs[0].url);
      if (json.loadPage) {
        var that = this;
        setTimeout(function() {
          that.gotoPage(json.loadPage);
        }, 1500);
      }
    }
    if (json.select) {
      for (i = 0; i < this.$.tab.children.length; i++) {
        item = this.$.tab.children[i];
        item.in({ selected: i == json.select - 1 });
      }
      this.$.title.innerHTML = this.json.tabs[json.select - 1].title;
      this.gotoPage(this.json.tabs[json.select - 1].url);
    }
    if (json.goBack) {
      window.history.back();
    }
  }
  merge(o1, o2) {
    for (var key in o2) {
      o1[key] = o2[key];
    }
    return o1;
  }
  str2Color(str) {
    if (str.length == 3 || str.length == 6) {
      return '#' + str;
    } else if (str.length == 8) {
      var r = parseInt('0x' + str.substr(0, 2));
      var g = parseInt('0x' + str.substr(2, 2));
      var b = parseInt('0x' + str.substr(4, 2));
      var a = parseInt('0x' + str.substr(6, 2)) / 255;
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
  }
  camelCase2bar(str) {
    var low = str.toLowerCase();
    var des = low.substr(0, 2);
    for (var i = 2; i < str.length; i++) {
      if (str.charAt(i) !== low.charAt(i)) {
        des = des.concat('-' + low.charAt(i));
      } else {
        des = des.concat(low.charAt(i));
      }
    }
    return des;
  }
  remove(arr, value) {
    if (!arr) return;
    var a = arr.indexOf(value);
    if (a >= 0) {
      arr.splice(a, 1);
    }
  }
  contain(objs, obj) {
    var i = objs.length;
    while (i--) {
      if (objs[i] === obj) {
        return true;
      }
    }
    return false;
  }
  registerElement(element) {
    if (!this.contain(this.loadedPages, element)) {
      this.loadedPages.push(element);

      class Page extends HeroViewController {
        constructor() {
          super();
        }
        _on() {
          // override parent
        }
      }
      customElements.define(element, Page);
    }
  }
  page2Element(page) {
    var pageElement;
    if (page.search(/pageName=/) > 0) {
      pageElement = page.split('pageName=')[1];
      pageElement =
        pageElement.search(/-/) > 0 ? pageElement : 'hero-' + pageElement;
      return pageElement;
    }
    pageElement = page.replace('_', '-');
    if (page.search(/.html/) > 0) {
      pageElement = pageElement.split('/').pop();
      if (pageElement.search(/\?/) > 0) {
        pageElement = pageElement.split('?')[0];
      }
      pageElement = pageElement.replace('.html', '');
      pageElement =
        pageElement.search(/-/) > 0 ? pageElement : 'hero-' + pageElement;
    }
    return pageElement;
  }
  connectedCallback() {
    window.APP = this;
    window.addEventListener('popstate', function(e) {
      if (e.state) {
        window.window.APP.gotoPage(e.state.state || e.state.heropage, 'back');
      }
    });
    this.$.backBtn.setController(this);
    this.$.backBtn.in({ click: { goBack: true } });
    this.$.rightBtn.in({ title: ' ', titleColor: 'ffffff' });
    this.$.leftMenu.style.width = parseInt(window.innerWidth) * 2 / 3 + 'px';
    var that = this;
    if (/[127\.0\.0\.0|localhost]/.test(window.location.host)) {
      this.$.cover.style.display = 'none';
    } else {
      setTimeout(function() {
        that.$.cover.style.animation = 'coverGo 1s';
      }, 2000);
      setTimeout(function() {
        that.$.cover.style.display = 'none';
      }, 2900);
    }
    window.Heros = [];
    window.__defineSetter__('Hero', function(v) {
      window.Heros.push(v);
      window[window.location.href + '_Hero'] = v;
    });

    window.__defineGetter__('Hero', function() {
      return window[window.location.href + '_Hero'];
    });

    window.last_ui2Data = '';

    window.__defineSetter__('ui2Data', function(v) {
      window[window.location.href + '_ui2Data'] = v;
    });
    window.__defineGetter__('ui2Data', function() {
      var _ui2Data = window[window.location.href + '_ui2Data'];
      if (_ui2Data) {
        window.last_ui2Data = _ui2Data;
      }
      return window.last_ui2Data;
    });
  }
  setNav(nav) {
    if (nav) {
      if (nav.nav) {
        nav = nav.nav;
      }
      this.$.title.innerHTML = nav.title || '';
      document.title = nav.title || '';
      if (nav.titleColor) {
        this.$.title.style.color = '#' + nav.titleColor;
      }
      if (nav.tintColor) {
        this.$.bar.style.backgroundColor = this.str2Color(nav.tintColor);
      }
      if (nav.navigationBarHidden || nav.navigationBarHiddenH5) {
        this.$.bar.style.height = '0px';
        if (this.mobile) {
          this.$.pages.style.top = '0px';
        } else {
          this.$.contentPages.style.top = '0px';
        }
      } else {
        if (this.mobile) {
          this.$.bar.style.height = '43px';
          this.$.pages.style.top = '44px';
        } else {
          this.$.bar.style.height = '88px';
          this.$.contentPages.style.top = '89px';
        }
      }
      if (nav.leftItems && nav.leftItems.length > 0) {
        this.$.backBtn.style.display = 'none';
        this.$.backBtn.style.animation = 'backBtnOut 0.25s';
        this.$.leftBtn.style.display = 'inline-block';
        this.$.leftBtn.in(nav.leftItems[0]);
        this.$.leftBtn.setController(this.currentPage);
        //second leftItem
        if (nav.leftItems[1]) {
          this.$.leftBtn2.style.display = 'inline-block';
          this.$.leftBtn2.in(nav.leftItems[1]);
          this.$.leftBtn2.setController(this.currentPage);
        }
      } else {
        this.$.leftBtn.style.display = 'none';

        this.$.leftBtn2.style.display = 'none';

        if (this.contain(this.rootPages, this.currentPage.name)) {
          this.$.backBtn.style.display = 'none';
          this.$.backBtn.style.animation = 'backBtnOut 0.25s';
        } else {
          this.$.backBtn.style.display = 'inline-block';
          this.$.backBtn.style.animation = 'backBtnIn 0.25s';
        }
      }
      if (nav.rightItems && nav.rightItems.length > 0) {
        this.$.rightBtn.in(nav.rightItems[0]);
        this.$.rightBtn.setController(this.currentPage);
        this.$.rightBtn.style.display = 'inline-block';
        //second rightItem
        if (nav.rightItems[1]) {
          this.$.rightBtn2.style.display = 'inline-block';
          this.$.rightBtn2.in(nav.rightItems[1]);
          this.$.rightBtn2.setController(this.currentPage);
        }
      } else {
        this.$.rightBtn.style.display = 'none';

        this.$.rightBtn2.style.display = 'none';
      }
    }
  }
  showLeftmenu(show) {
    if (show) {
      this.$.menu.style.display = 'block';
      this.$.leftMenu.style.display = 'block';
      this.$.leftMenu.style.animation = 'leftMenuIn 0.3s';
    } else {
      this.$.leftMenu.style.animation = 'leftMenuOut 0.3s';
      // this.async(function(){
      this.$.menu.style.display = 'none';
      this.$.leftMenu.style.display = 'none';
      // },200);
    }
  }
  closeMenu() {
    this.showLeftmenu(false);
  }
  loadPage(page) {
    var pageElement = this.page2Element(page);
    if (!this.contain(this.loadedPages, pageElement)) {
      this.registerElement(pageElement);
      var that = this;
      window.API = undefined;
      window.ui = undefined;
      // eslint-disable-next-line
      if (/[127\.0\.0\.0|localhost]/.test(page)) {
        if (page.endWith('html')) {
          page = page + '?test=true';
        } else {
          page = page + '&test=true';
        }
      }
      if (this.mobile) {
        this.$.pages.on();
      } else {
        if (this.contain(this.rootPages, pageElement)) {
          this.$.rootPages.on();
        } else {
          this.$.contentPages.on();
        }
      }
      window.importHref(
        page,
        function() {
          that.currentPage = document.createElement(pageElement);
          that.currentPage.name = pageElement;
          that.currentPage.url = page;
          if (that.mobile) {
            that.$.pages.addPage(that.currentPage);
          } else {
            if (that.contain(that.rootPages, pageElement)) {
              that.$.rootPages.addPage(that.currentPage);
            } else {
              that.$.contentPages.addPage(that.currentPage);
            }
          }
        },
        function() {
          that.currentPage = document.createElement(pageElement);
          that.currentPage.name = pageElement;
          that.currentPage.url = page;
          if (that.mobile) {
            that.$.pages.addPage(that.currentPage);
          } else {
            if (that.contain(that.rootPages, page)) {
              that.$.rootPages.addPage(that.currentPage);
            } else {
              that.$.contentPages.addPage(that.currentPage);
            }
          }
        }
      );
    } else {
      if (this.mobile) {
        this.$.pages.on({
          selected: pageElement,
          callback: true,
        });
        const next = this.$.pages.selectedItem;
        if (this.pageStack.indexOf(pageElement) === -1) {
          next.viewDidLoad();
        }
        next.viewWillAppear();
      } else {
        if (this.contain(this.rootPages, pageElement)) {
          this.$.rootPages.on({
            selected: pageElement,
            callback: true,
          });
          const next = this.$.rootPages.selectedItem;
          if (this.pageStack.indexOf(pageElement) === -1) {
            next.viewDidLoad();
          }
          next.viewWillAppear();
        } else {
          this.$.contentPages.on({
            selected: pageElement,
            callback: true,
          });
          const next = this.$.contentPages.selectedItem;
          if (this.pageStack.indexOf(pageElement) === -1) {
            next.viewDidLoad();
          }
          next.viewWillAppear();
        }
      }
    }
  }
  gotoPage(page, option) {
    var pageElement = this.page2Element(page);
    if (pageElement.search(/http/) >= 0) {
      window.open(pageElement, '_blank');
      window.focus();
      return;
    }
    const isInPageStack = this.contain(this.pageStack, pageElement);
    const isInRootStack = this.contain(this.rootPages, pageElement);
    const isIn = this.contain(
      this.rootPages,
      this.pageStack[this.pageStack.length - 1]
    );

    if (isInRootStack && this.rootPages.length > 1) {
      if (this.mobile) {
        this.$.tab.style.display = 'block';
        this.$.pages.style.bottom = '44px';
        this.$.backBtn.style.display = 'none';
      }
    } else {
      if (this.mobile) {
        this.$.tab.style.display = 'none';
        this.$.pages.style.bottom = '0px';
      }
    }
    var animationType = '';

    if (isInPageStack) {
      if (!isIn) {
        animationType = 10;
      }
    } else if (!isInRootStack) {
      animationType = 9;
    }
    if (option == 'present') {
      animationType = 3;
    } else if (option == 'dissmiss') {
      animationType = 4;
    } else if (option == 'load') {
      animationType = 9;
    }
    if (this.mobile) {
      this.$.pages.setEffect(animationType);
      if (this.$.pages.selectedItem) {
        this.$.pages.selectedItem.viewWillDisappear();
      }
    }

    if (
      !history.state ||
      (history.state.state || history.state.heropage) === page ||
      option === 'load'
    ) {
      history.replaceState(
        { heropage: page },
        pageElement,
        '?heropage=' + page
      );
    } else if (
      option != 'dissmiss' &&
      option != 'back' &&
      option != 'rootBack' &&
      option != 'load'
    ) {
      history.pushState({ heropage: page }, pageElement, '?heropage=' + page);
    }
    if (!this.contain(this.pageStack, pageElement)) {
      this.pageStack.push(pageElement);
    } else {
      while (this.pageStack[this.pageStack.length - 1] != pageElement) {
        this.pageStack.pop();
      }
    }
    this.loadPage(page);
  }
}

class HeroAlert extends HeroElement {
  constructor() {
    super();
    var btOk = '确定';
    var ul = navigator.language.toLowerCase();
    if (ul === 'en-us') {
      btOk = 'ok';
    }
    this.btOk = btOk;
  }
  init() {
    this.$ = {
      button: this.shadowDom.querySelector('button'),
      p: this.shadowDom.querySelector('p'),
      wpr: this.shadowDom.querySelector('.wpr'),
    };

    var callback = this.close.bind(this);
    this.$.button.addEventListener('touchstart', callback);
    this.$.button.addEventListener('click', callback);
  }

  template(json) {
    return `
    <style type="text/css">
      .action {
        position:absolute;
        width:100%;
        left:0;
        bottom:10px;
        display: block !important;
        text-align: center;
      }
      button{
        background:#F99190;
        border-radius:8px;
        border:solid 1px #FEEFF0;
        color:#FEEFF0;
      }
      .wpr{
        position: fixed;
        box-sizing: border-box;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        width: 50%;
        max-height:200px;
        max-width:300px;
        min-width:150px;
        visibility:hidden;
        border-radius:12px;
        padding: 16px 24px;
        background:#FEEFF0;
        opacity:0;
        transform:scale(0.8,0.8);
        transition: all 0.5s cubic-bezier(.25,.1,.3,1.5);
      }
      p{
        text-align:center;
        color:#F99190;
      }
    </style>
    <div class="wpr">
      <p id='text'>${json.text}</p>
      <div class="action">
        <button>${this.btOk}</button>
      </div>
    </div>

    `;
  }

  on(json) {
    if (json.text) {
      this.updateContent(this.$.p, json.text);
      this.updateContent(this.$.button, this.btOk);
      var that = this;
      setTimeout(function() {
        that.open();
      }, 50);
    }
  }

  open() {
    this.$.wpr.style.transform = 'scale(1,1)';
    this.$.wpr.style.opacity = 1;
    this.$.wpr.style.visibility = 'visible';
  }

  close() {
    this.$.wpr.style.transform = 'scale(0.8,0.8)';
    this.$.wpr.style.opacity = 0;
    this.$.wpr.style.visibility = 'hidden';
  }
}

class HeroConfirm extends HeroElement {
  constructor() {
    super();

    var btOk = '确定',
      btCancel = '取消';
    var ul = navigator.language.toLowerCase();
    if (ul === 'en-us') {
      btOk = 'ok';
      btCancel = 'Cancel';
    }
    this.btOk = btOk;
    this.btCancel = btCancel;
  }
  init() {
    this.$ = {
      confirm: this.shadowDom.querySelector('#confirm'),
      cancel: this.shadowDom.querySelector('#cancel'),
      text: this.shadowDom.querySelector('p'),
      wpr: this.shadowDom.querySelector('.wpr'),
    };

    var tapOKCallback = this.tapOk.bind(this);
    var tapCancelCallback = this.tapCancel.bind(this);

    this.$.confirm.addEventListener('touchstart', tapOKCallback);
    this.$.confirm.addEventListener('click', tapOKCallback);

    this.$.cancel.addEventListener('touchstart', tapCancelCallback);
    this.$.cancel.addEventListener('click', tapCancelCallback);
  }

  template(json) {
    return `
      <style type="text/css">

      .buttons {
        position:absolute;
        width:100%;
        left:0;
        bottom:10px;
        display: block !important;
        text-align: center;
      }
      #confirm{
          background:#80CB5C;
          border-radius:8px;
          border:solid 1px #F1F8EB;
          color:#F1F8EB;
      }
      #cancel{
          background:#F99190;
          border-radius:8px;
          border:solid 1px #FEEFF0;
          color:#FEEFF0;
      }
      .wpr{
        position: fixed;
        box-sizing: border-box;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        width: 50%;
        max-height:200px;
        max-width:300px;
        min-width:150px;
        visibility:hidden;
        border-radius:12px;
        padding: 16px 24px;
        background:#F1F8EB;
        opacity:0;
        transform:scale(0.8,0.8);
        transition: all 0.5s cubic-bezier(.25,.1,.3,1.5);
      }
      p{
        color:#80CB5C
        text-align:center;
      }
      </style>
      <div class="wpr">
        <p>${json.text}</p>
        <div class="buttons">
          <button id="confirm">${this.btOk}</button>
          <button id="cancel">${this.btCancel}</button>
        </div>
      </div>
    `;
  }

  on(json) {
    if (json.text) {
      this.updateContent(this.$.text, json.text);
      this.updateContent(this.$.confirm, this.btOk);
      this.updateContent(this.$.cancel, this.btCancel);
      var that = this;
      setTimeout(function() {
        that.open();
      }, 50);
    }
  }
  open() {
    this.$.wpr.style.transform = 'scale(1,1)';
    this.$.wpr.style.opacity = 1;
    this.$.wpr.style.visibility = 'visible';
  }
  close() {
    this.$.wpr.style.transform = 'scale(0.8,0.8)';
    this.$.wpr.style.opacity = 0;
    this.$.wpr.style.visibility = 'hidden';
  }
  tapOk() {
    this.close();
    this.controller.on(this._json.action);
  }
  tapCancel() {
    this.close();
    this.controller.on(this._json.cancelAction);
  }
}

class HeroDialog extends HeroElement {
  constructor() {
    super();
    var btOk = '确定';
    var ul = navigator.language.toLowerCase();
    if (ul === 'en-us') {
      btOk = 'ok';
    }
    this.btOk = btOk;
  }
  init() {
    this.$ = {
      button: this.shadowDom.querySelector('button'),
      p: this.shadowDom.querySelector('p'),
      wpr: this.shadowDom.querySelector('.wpr'),
      mask: this.shadowDom.querySelector('.mask'),
    };

    var callback = this.close.bind(this);
    this.$.button.addEventListener('touchstart', callback);
    this.$.button.addEventListener('click', callback);
  }

  template(json) {
    return `
    <style type="text/css">
      .mask{
        opacity:0;
        position: fixed;
        height:100%;
        width:100%;
        background:transparent;
        transition:all 0.6s;
        visibility:hidden;
      }
      .wpr{
        opacity:0;
        position: fixed;
        box-sizing: border-box;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        height: 300px;
        width: 50%;
        min-width:300px;
        visibility:hidden;
        border-radius:12px;
        padding: 16px 24px;
        border:1px solid rgb(57, 52, 54);
        background:white;
        transform:scale(0.8,0.8);
        transition:all 0.5s cubic-bezier(.25,.1,.3,1.5);
      }
      button{
        position:absolute;
        background:#80CB5C;
        border-radius:8px;
        border:solid 1px #F1F8EB;
        color:#F1F8EB;
        right:15px;
        bottom:10px;
      }
      p{
        text-align:center;
      }
    </style>
    <div class="mask"></div>
    <div class="wpr">
      <p id='text'>${json.text}</p>
      <div class="action">
        <button>${this.btOk}</button>
      </div>
    </div>

    `;
  }
  on(json) {
    if (json.text) {
      this.updateContent(this.$.p, json.text);
      this.updateContent(this.$.button, this.btOk);
      var that = this;
      setTimeout(function() {
        that.open();
      }, 50);
    }
  }

  open() {
    this.$.wpr.style.transform = 'scale(1,1)';
    this.$.wpr.style.visibility = 'visible';
    this.$.mask.style.visibility = 'visible';
    this.$.mask.style.background = 'rgba(12, 13, 12, 0.64)';
    this.$.mask.style.opacity = 1;
    this.$.wpr.style.opacity = 1;
  }

  close() {
    this.$.wpr.style.transform = 'scale(0.8,0.8)';
    this.$.wpr.style.visibility = 'hidden';
    this.$.mask.style.visibility = 'hidden';
    this.$.mask.style.background = 'transparent';
    this.$.mask.style.opacity = 0;
    this.$.wpr.style.opacity = 0;
  }
}

class HeroScrollView extends HeroElement {
  init() {
    this.shadowDom.querySelector('#heroContent').style.overflow = 'scroll';
  }
}

class HeroLoading extends HeroElement {
  init() {
    this.$ = {
      layer: this.shadowDom.querySelector('#layer'),
      loading: this.shadowDom.querySelector('#loading'),
  };
};

template() {
    return `
    <style type="text/css">
    * {
        width: 100%;
        height: 100%;
    }
    #loading{
        width: 100px;
        height: 100px;
        position: absolute;
        left:50%;
        top:50%;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 99999;
    }
    #layer{
        position: absolute;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 99998;
        background-color:#000; 
        filter: alpha(opacity=40); 
        -moz-opacity: 0.4; 
        opacity: 0.4; 
    }
    .loadEffect {
        width: 100px;
        height: 100px;
        position: relative;
    }
    .loadEffect span{
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        -webkit-animation: load 1.04s ease infinite;
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0.2;
        }
    }
    .loadEffect span:nth-child(1) {
        left: 0;
        top: 50%;
        margin-top:-8px;
        -webkit-animation-delay:0.13s;
    } 
    .loadEffect span:nth-child(2) {
        left: 14px;
        top: 14px;
        -webkit-animation-delay:0.26s;
    }
    .loadEffect span:nth-child(3) {
        left: 50%;
        top: 0;
        margin-left: -8px;
        -webkit-animation-delay:0.39s;
    }
    .loadEffect span:nth-child(4) {
        top: 14px;
        right:14px;
        -webkit-animation-delay:0.52s;
    }
    .loadEffect span:nth-child(5) {
        right: 0;
        top: 50%;
        margin-top:-8px;
        -webkit-animation-delay:0.65s;
    }
    .loadEffect span:nth-child(6) {
        right: 14px;
        bottom:14px;
        -webkit-animation-delay:0.78s;
    }
    .loadEffect span:nth-child(7) {
        bottom: 0;
        left: 50%;
        margin-left: -8px;
        -webkit-animation-delay:0.91s;
    }
    .loadEffect span:nth-child(8) {
        bottom: 14px;
        left: 14px;
        -webkit-animation-delay:1.04s;
    }
    .loadText {
        position: relative;
        left: 15px;
        top: 10px;
        font-size: 15px;
        color: #fff;
    }

    </style>
    <div id='layer'>
    <div id='loading'>
    <div class="loadEffect">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    </div>
    </div>
    </div>
    `;
};

on(json) {
    if (typeof json.show === 'boolean') {
      this.$.loading.active = json.show;
      this.$.layer.style.visibility = json.show ? 'visible' : 'hidden';
  }
}
}

var components = [
  HeroElement,
  HeroButton,
  HeroLabel,
  HeroPages,
  HeroImageView,
  HeroTableViewCell,
  HeroTableViewSection,
  HeroTableView,
  HeroTextField,
  HeroTextView,
  HeroToast,
  HeroToolbarItem,
  HeroView,
  HeroViewController,
  HeroApp,
  HeroAlert,
  HeroConfirm,
  HeroDialog,
  HeroScrollView,
  HeroLoading,
];

for (var i = 0, len = components.length; i < len; i++) {
  window.customElements.define(components[i].customName, components[i]);
}
