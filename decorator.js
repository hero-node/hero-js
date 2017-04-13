
function Component(target) {
    target.__isHeroPage = true;
}
function Boot(target, name, descriptor) {

    return descriptor;
}
function Message(target, name, descriptor) {

    return descriptor;
}
export {
  Component,
  Boot,
  Message
};
