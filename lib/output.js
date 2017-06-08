var mappings = {

};

function _heroView0(element, view) {
    view.version = 0;
    view.back_heroView0_heroView0groundColor = 'ffffff';
}
function _drTextField0(element, view) {
    view.name = 'phone';
    view.theme = 'green';
}
function _uiView0(element, view) {
    view.frame = '';
    view.name = 'payView';
}
function _heroImageView0() {
    view.frame = '';
    view. image = '';
}

function getViews(element) {

    if (!element) {
        return null;
    }
    var condition = element.condition;

    if (!condition()) {
        return null;
    }
    var view = mappings[element].call(null, element, {});

    var children = element.children;

    if (children) {
        view.subViews = [];
    }
    var idx, len, _subViews;

    for (idx = 0, len = children.length; idx < len; idx++) {
        _subViews = getViews(children[idx]);

        if (_subViews) {
            view.subViews.push(_subViews);
        }
    }
}

getViews();
