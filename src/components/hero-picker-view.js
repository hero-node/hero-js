import HeroElement from './hero-element';

export default class HeroPickerView extends HeroElement {
  init() {
    this.$ = {
      picker: this.shadowDom.querySelector('#picker'),
    };
    var element = document.createElement('link');
    element.rel = 'stylesheet';
    element.href = '/dist/hero-picker-view/anypicker-font.css';
    document.head.appendChild(element);

    element = document.createElement('link');
    element.rel = 'stylesheet';
    element.href = '/dist/hero-picker-view/anypicker.css';
    document.head.appendChild(element);

    element = document.createElement('link');
    element.rel = 'stylesheet';
    element.href = '/dist/hero-picker-view/anypicker-ios.css';
    document.head.appendChild(element);

    element = document.createElement('script');
    element.src = '/dist/hero-picker-view/jquery-1.11.1.min.js';
    document.head.appendChild(element);
    setTimeout(function() {
      element = document.createElement('script');
      element.src = '/dist/hero-picker-view/anypicker.js';
      document.head.appendChild(element);
    }, 500);
  }

  template(json) {
    return `
      <style>
        #content{
          display:none;
        }
      </style>
      <div id='content'>
        <input type="text" id='picker'></input>
      </div>
    `;
  }

  on(json) {
    if (!json.method) {
      return;
    }
    var soViewSections = {
      header: [],
      contentTop: [],
      contentBottom: [],
      footer: ['cancelButton', 'setButton'],
    };
    var $this = $(this.$.picker);
    var ul = navigator.language.toLowerCase();
    if (ul === 'zh-cn')
      var io18n = {
        setButton: '设置',
        cancelButton: '取消',
        shortMonths: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
          '_'
        ),
        fullMonths: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
          '_'
        ),
      };

    if (json.selectAction) {
      this.selectAction = json.selectAction;
    }
    if (json.type === 'date') {
      $this.AnyPicker({
        mode: 'datetime',
        dateTimeFormat: 'MMMM d, yyyy',
        theme: 'iOS',
        layout: 'fixed',
        viewSections: soViewSections,
        i18n: io18n,
      });
    }
    if (json.datas) {
      var arr = (this.arr = json.datas);
      if (Array.isArray(arr) && arr.length > 0) {
        if (typeof arr[0] === 'string') {
          this.arr.one = true;
          // one dimension
          var dataSource = [],
            oArrComponents = [
              {
                component: 0,
                name: '0',
                label: '0',
              },
            ],
            oArrDataSource = [
              {
                component: 0,
                data: dataSource,
              },
            ];

          for (var i = 0, j = arr.length; i < j; i++) {
            dataSource.push({
              label: arr[i],
              val: i,
            });
          }

          $this.AnyPicker({
            mode: 'select',
            layout: 'fixed',
            viewSections: soViewSections,
            components: oArrComponents,
            dataSource: oArrDataSource,
            theme: 'iOS',
            // onSetOutput:this.valueChange,
            i18n: io18n,
          });
        } else if (typeof arr[0] === 'object') {
          // two dimension
          var arr0 = [];
          for (var i = 0, j = arr.length; i < j; i++) {
            arr0.push({
              label: arr[i].title,
              val: i,
            });
          }

          function getData2(data1) {
            var arr1 = [];
            var tmpArr = arr[data1.val].rows;
            for (var i = 0, j = tmpArr.length; i < j; i++) {
              arr1.push({
                label: tmpArr[i],
                val: i,
              });
            }
            return arr1;
          }

          function onChange(iComp, iRow, oSelectedValues, sSource) {
            if (iComp === 0) {
              var data1 = oSelectedValues.values[0];
              this.setting.dataSource[1].data = getData2(data1);
              this.reloadComponent(1, true);
            }
          }

          var oArrComponents = [
              {
                component: 0,
                name: '0',
                label: '0',
                width: '50%',
                textAlign: 'center',
              },
              {
                component: 1,
                name: '1',
                label: '1',
                width: '50%',
                textAlign: 'center',
              },
            ],
            oArrDataSource = [
              {
                component: 0,
                data: arr0,
              },
              {
                component: 1,
                data: getData2(arr0[0]),
              },
            ];
          $this.AnyPicker({
            mode: 'select',
            layout: 'fixed',
            viewSections: soViewSections,
            components: oArrComponents,
            dataSource: oArrDataSource,
            onChange: onChange,
            // onSetOutput:this.valueChange,
            theme: 'iOS',
            i18n: io18n,
          });
        }
      }
    }
    if (json.method === 'show') {
      // show the picker
      $this.triggerHandler('focus');
    }
  }
}
