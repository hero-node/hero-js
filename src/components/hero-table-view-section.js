import HeroElement from './hero-element';

export default class HeroTableViewSection extends HeroElement {

  wrapperTemplate(html){
    return html;
  }

  init(json) {
      this.$ = {
        sectionGap: this.shadowDom.querySelector('#sectionGap'),
        heroContent: this.shadowDom.querySelector('#heroContent'),
        title: this.shadowDom.querySelector('title')
      }
  }

  template(json) {
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
    <div id='sectionGap'>
    </div>
    <p id='title'>${json.sectionTitle}</p>
    <div id='heroContent'>
    </div>

    `;
  }

  on(json) {
    if (!this.controller) {
      this.controller = APP.currentPage;
    };
    if (json.sectionTitle) {
      this.title = json.sectionTitle;
    }else{
      this.$.title.style.display = 'none';
    }
    if (json.rows) {
      while (this.$.heroContent.lastChild) {
         this.$.heroContent.removeChild(this.$.heroContent.lastChild);
      }
      for (var i = 0; i < json.rows.length; i++) {
        var row = json.rows[i];
        var cell;
        if (row.class || row.res) {
          cell = document.createElement(APP.camelCase2bar(row.class||row.res));
          cell.controller = this.controller;
          this.$.heroContent.appendChild(cell);
          cell.json = row;
          cell.$.heroContent.style.position = 'relative';
          // cell.tabIndex = i+'';
        }else{
          cell = document.createElement('hero-table-view-cell');
          cell.controller = this.controller;
          this.$.heroContent.appendChild(cell);
          cell.json = row;
          // cell.tabIndex = i+'';
          this.$.heroContent.appendChild(cell);
        }
        if (row.height) {
          cell.$.heroContent.style.height = row.height+'px';
        }
        if (i != json.rows.length-1) {
          cell.in({bottomLine:true});
        }
        this.$.heroContent.appendChild(cell);
     };
    };
  }

  selectItem(item){
    var json = item.srcElement.json
    if (json.action) {
      this.controller.on(json.action)
    };
  }

}
