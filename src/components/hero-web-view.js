import HeroElement from './hero-element';

export default class HeroWebView extends HeroElement {
  template() {
    return `
    <style type="text/css">
      iframe{
        display: block;
        position: absolute;
        overflow: hidden;
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 100%;
        border:0px;
        border-width:0px;
      }
      #wpr{
        display: block;
        position: absolute;
        overflow: scroll;
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 100%;
      }
      </style>
      <div id='wpr'>
      </div>

    `;
  }

  observerHijackUrls() {
    var url = '';
    try {
      url = this.iframe.contentWindow.location.href;
      // eslint-disable-next-line
    } catch (e) {}
    for (var i = 0; i < this.hijackURLs.length; i++) {
      var hackurl = this.hijackURLs[i].url;
      var isLoad = this.hijackURLs[i].isLoad;
      if (hackurl === url) {
        this.controller.on({ name: this.getName(), url: hackurl });
        return isLoad;
      }
    }
    var that = this;
    setTimeout(function() {
      that.observerHijackUrls();
    }, 1000);
  }

  on(json) {
    if (json.hijackURLs) {
      this.hijackURLs = json.hijackURLs;
      this.observerHijackUrls();
    }
    if (json.url) {
      if (this.iframe) {
        this.$.wpr.removeChild(this.iframe);
        this.iframe = undefined;
      }
      this.iframe = document.createElement('iframe');
      this.iframe.style.margin = '0px';
      this.iframe.style.padding = '0px';
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.iframe.style.border = '0px';
      this.iframe.style.borderWidth = '0px';
      this.$.wpr.appendChild(this.iframe);
      this.iframe.hidden = false;
      if (typeof json.url === 'string') {
        this.iframe.src = json.url;
      } else if (typeof json.url === 'object') {
        var url = json.url.url;
        var data = json.url.data;

        var innerHtml =
          '<form style="" id="form" method="POST" action="' + url + '">';
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          innerHtml +=
            "<input name='" + keys[i] + "' value='" + data[keys[i]] + "'/>";
        }
        innerHtml += '<input type="submit" value="submit"></input>';
        innerHtml += '</form>';
        this.iframe.contentWindow.document.body.innerHTML = innerHtml;
        var script = document.createElement('script');
        script.innerHTML = 'document.getElementById("form").submit()';
        this.iframe.contentWindow.document.body.appendChild(script);
      }
    } else if (json.innerHtml) {
      this.$.wpr.innerHTML = json.innerHtml;
    } else if (json.in) {
      this.iframe.contentWindow.Hero.in(json.in);
    } else if (json.out) {
      this.iframe.contentWindow.Hero.out(json.out);
    } else if (json.mode == 'replay') {
      this.iframe.contentWindow.Hero.in = function() {};
    }
  }
}
