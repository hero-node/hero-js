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
