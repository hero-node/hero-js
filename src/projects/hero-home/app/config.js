window.host = window.location.origin;
window.path = (
  window.location.protocol +
  '//' +
  window.location.host +
  window.location.pathname
).replace(/\/[A-Za-z0-9_-]+.html/, ''); //如果url路径有前缀请加上;
if (!/\/$/.test(window.path)) {
  window.path += '/';
}
window.backgroundColor = 'ffffff';
window.color = '333333';
window.tintColor = '778899';
