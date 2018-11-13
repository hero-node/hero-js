import HeroElement from './hero-element';

export default class HeroImageView extends HeroElement {
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
      document.body.appendChild(this._wrapper);
    }
    if (json.uploadUrl) {
      this.$.input.addEventListener('change', this.onChange.bind(this));
      this.$.img.style.display = 'none';
      this._uploadUrl = json.uploadUrl;
    }
  }
  showBig() {
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
