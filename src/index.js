import './components/polyfills.js';
import HeroElement from './components/hero-element.js';
import HeroPages from './components/hero-page.js';
import HeroButton from './components/hero-button.js';
import HeroLabel from './components/hero-label.js';
import HeroImageView from './components/hero-image-view.js';
import HeroTextField from './components/hero-text-field.js';
import HeroTableView from './components/hero-table-view.js';
import HeroTableViewCell from './components/hero-table-view-cell.js';
import HeroTableViewSection from './components/hero-table-view-section.js';
import HeroTextView from './components/hero-text-view.js';
import HeroToast from './components/hero-toast.js';
import HeroToolbarItem from './components/hero-toolbar-item.js';
import HeroView from './components/hero-view.js';
import HeroViewController from './components/hero-view-controller.js';
import HeroApp from './components/hero-app.js';
import HeroAlert from './components/hero-alert.js';
import HeroConfirm from './components/hero-confirm.js';
import HeroDialog from './components/hero-dialog.js';
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
];

for (var i = 0, len = components.length; i < len; i++) {
  window.customElements.define(components[i].customName, components[i]);
}
