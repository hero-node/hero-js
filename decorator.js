
function Component(config) {
    console.log('config', config);
    return function (target) {
        console.log(target);
        return target;
    };
}
function Boot(target, name, descriptor) {
    console.log(target, name, descriptor);
    return descriptor;
}

function Reload(target, name, descriptor) {
    console.log(target, name, descriptor);
    return descriptor;
}


function Message(eventType) {
    console.log('eventType', eventType);
    return function (target, name, descriptor) {
        console.log(target, name, descriptor);
        return descriptor;
    };
}

module.exports = {
    Component: Component,
    Boot: Boot,
    Reload: Reload,
    Message: Message
};
