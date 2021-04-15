// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/materialize-css/js/cash.js":[function(require,module,exports) {
/*! cash-dom 1.3.5, https://github.com/kenwheeler/cash @license MIT */
(function (factory) {
  window.cash = factory();
})(function () {
  var doc = document, win = window, ArrayProto = Array.prototype, slice = ArrayProto.slice, filter = ArrayProto.filter, push = ArrayProto.push;

  var noop = function () {}, isFunction = function (item) {
    // @see https://crbug.com/568448
    return typeof item === typeof noop && item.call;
  }, isString = function (item) {
    return typeof item === typeof "";
  };

  var idMatch = /^#[\w-]*$/, classMatch = /^\.[\w-]*$/, htmlMatch = /<.+>/, singlet = /^\w+$/;

  function find(selector, context) {
    context = context || doc;
    var elems = (classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
    return elems;
  }

  var frag;
  function parseHTML(str) {
    if (!frag) {
      frag = doc.implementation.createHTMLDocument(null);
      var base = frag.createElement("base");
      base.href = doc.location.href;
      frag.head.appendChild(base);
    }

    frag.body.innerHTML = str;

    return frag.body.childNodes;
  }

  function onReady(fn) {
    if (doc.readyState !== "loading") {
      fn();
    } else {
      doc.addEventListener("DOMContentLoaded", fn);
    }
  }

  function Init(selector, context) {
    if (!selector) {
      return this;
    }

    // If already a cash collection, don't do any further processing
    if (selector.cash && selector !== win) {
      return selector;
    }

    var elems = selector, i = 0, length;

    if (isString(selector)) {
      elems = (idMatch.test(selector) ?
      // If an ID use the faster getElementById check
      doc.getElementById(selector.slice(1)) : htmlMatch.test(selector) ?
      // If HTML, parse it into real elements
      parseHTML(selector) :
      // else use `find`
      find(selector, context));

      // If function, use as shortcut for DOM ready
    } else if (isFunction(selector)) {
      onReady(selector);return this;
    }

    if (!elems) {
      return this;
    }

    // If a single DOM element is passed in or received via ID, return the single element
    if (elems.nodeType || elems === win) {
      this[0] = elems;
      this.length = 1;
    } else {
      // Treat like an array and loop through each item.
      length = this.length = elems.length;
      for (; i < length; i++) {
        this[i] = elems[i];
      }
    }

    return this;
  }

  function cash(selector, context) {
    return new Init(selector, context);
  }

  var fn = cash.fn = cash.prototype = Init.prototype = { // jshint ignore:line
    cash: true,
    length: 0,
    push: push,
    splice: ArrayProto.splice,
    map: ArrayProto.map,
    init: Init
  };

  Object.defineProperty(fn, "constructor", { value: cash });

  cash.parseHTML = parseHTML;
  cash.noop = noop;
  cash.isFunction = isFunction;
  cash.isString = isString;

  cash.extend = fn.extend = function (target) {
    target = target || {};

    var args = slice.call(arguments), length = args.length, i = 1;

    if (args.length === 1) {
      target = this;
      i = 0;
    }

    for (; i < length; i++) {
      if (!args[i]) {
        continue;
      }
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          target[key] = args[i][key];
        }
      }
    }

    return target;
  };

  function each(collection, callback) {
    var l = collection.length, i = 0;

    for (; i < l; i++) {
      if (callback.call(collection[i], collection[i], i, collection) === false) {
        break;
      }
    }
  }

  function matches(el, selector) {
    var m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
    return !!m && m.call(el, selector);
  }

  function getCompareFunction(selector) {
    return (
    /* Use browser's `matches` function if string */
    isString(selector) ? matches :
    /* Match a cash element */
    selector.cash ? function (el) {
      return selector.is(el);
    } :
    /* Direct comparison */
    function (el, selector) {
      return el === selector;
    });
  }

  function unique(collection) {
    return cash(slice.call(collection).filter(function (item, index, self) {
      return self.indexOf(item) === index;
    }));
  }

  cash.extend({
    merge: function (first, second) {
      var len = +second.length, i = first.length, j = 0;

      for (; j < len; i++, j++) {
        first[i] = second[j];
      }

      first.length = i;
      return first;
    },

    each: each,
    matches: matches,
    unique: unique,
    isArray: Array.isArray,
    isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

  });

  var uid = cash.uid = "_cash" + Date.now();

  function getDataCache(node) {
    return (node[uid] = node[uid] || {});
  }

  function setData(node, key, value) {
    return (getDataCache(node)[key] = value);
  }

  function getData(node, key) {
    var c = getDataCache(node);
    if (c[key] === undefined) {
      c[key] = node.dataset ? node.dataset[key] : cash(node).attr("data-" + key);
    }
    return c[key];
  }

  function removeData(node, key) {
    var c = getDataCache(node);
    if (c) {
      delete c[key];
    } else if (node.dataset) {
      delete node.dataset[key];
    } else {
      cash(node).removeAttr("data-" + name);
    }
  }

  fn.extend({
    data: function (name, value) {
      if (isString(name)) {
        return (value === undefined ? getData(this[0], name) : this.each(function (v) {
          return setData(v, name, value);
        }));
      }

      for (var key in name) {
        this.data(key, name[key]);
      }

      return this;
    },

    removeData: function (key) {
      return this.each(function (v) {
        return removeData(v, key);
      });
    }

  });

  var notWhiteMatch = /\S+/g;

  function getClasses(c) {
    return isString(c) && c.match(notWhiteMatch);
  }

  function hasClass(v, c) {
    return (v.classList ? v.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(v.className));
  }

  function addClass(v, c, spacedName) {
    if (v.classList) {
      v.classList.add(c);
    } else if (spacedName.indexOf(" " + c + " ")) {
      v.className += " " + c;
    }
  }

  function removeClass(v, c) {
    if (v.classList) {
      v.classList.remove(c);
    } else {
      v.className = v.className.replace(c, "");
    }
  }

  fn.extend({
    addClass: function (c) {
      var classes = getClasses(c);

      return (classes ? this.each(function (v) {
        var spacedName = " " + v.className + " ";
        each(classes, function (c) {
          addClass(v, c, spacedName);
        });
      }) : this);
    },

    attr: function (name, value) {
      if (!name) {
        return undefined;
      }

      if (isString(name)) {
        if (value === undefined) {
          return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined;
        }

        return this.each(function (v) {
          if (v.setAttribute) {
            v.setAttribute(name, value);
          } else {
            v[name] = value;
          }
        });
      }

      for (var key in name) {
        this.attr(key, name[key]);
      }

      return this;
    },

    hasClass: function (c) {
      var check = false, classes = getClasses(c);
      if (classes && classes.length) {
        this.each(function (v) {
          check = hasClass(v, classes[0]);
          return !check;
        });
      }
      return check;
    },

    prop: function (name, value) {
      if (isString(name)) {
        return (value === undefined ? this[0][name] : this.each(function (v) {
          v[name] = value;
        }));
      }

      for (var key in name) {
        this.prop(key, name[key]);
      }

      return this;
    },

    removeAttr: function (name) {
      return this.each(function (v) {
        if (v.removeAttribute) {
          v.removeAttribute(name);
        } else {
          delete v[name];
        }
      });
    },

    removeClass: function (c) {
      if (!arguments.length) {
        return this.attr("class", "");
      }
      var classes = getClasses(c);
      return (classes ? this.each(function (v) {
        each(classes, function (c) {
          removeClass(v, c);
        });
      }) : this);
    },

    removeProp: function (name) {
      return this.each(function (v) {
        delete v[name];
      });
    },

    toggleClass: function (c, state) {
      if (state !== undefined) {
        return this[state ? "addClass" : "removeClass"](c);
      }
      var classes = getClasses(c);
      return (classes ? this.each(function (v) {
        var spacedName = " " + v.className + " ";
        each(classes, function (c) {
          if (hasClass(v, c)) {
            removeClass(v, c);
          } else {
            addClass(v, c, spacedName);
          }
        });
      }) : this);
    } });

  fn.extend({
    add: function (selector, context) {
      return unique(cash.merge(this, cash(selector, context)));
    },

    each: function (callback) {
      each(this, callback);
      return this;
    },

    eq: function (index) {
      return cash(this.get(index));
    },

    filter: function (selector) {
      if (!selector) {
        return this;
      }

      var comparator = (isFunction(selector) ? selector : getCompareFunction(selector));

      return cash(filter.call(this, function (e) {
        return comparator(e, selector);
      }));
    },

    first: function () {
      return this.eq(0);
    },

    get: function (index) {
      if (index === undefined) {
        return slice.call(this);
      }
      return (index < 0 ? this[index + this.length] : this[index]);
    },

    index: function (elem) {
      var child = elem ? cash(elem)[0] : this[0], collection = elem ? this : cash(child).parent().children();
      return slice.call(collection).indexOf(child);
    },

    last: function () {
      return this.eq(-1);
    }

  });

  var camelCase = (function () {
    var camelRegex = /(?:^\w|[A-Z]|\b\w)/g, whiteSpace = /[\s-_]+/g;
    return function (str) {
      return str.replace(camelRegex, function (letter, index) {
        return letter[index === 0 ? "toLowerCase" : "toUpperCase"]();
      }).replace(whiteSpace, "");
    };
  }());

  var getPrefixedProp = (function () {
    var cache = {}, doc = document, div = doc.createElement("div"), style = div.style;

    return function (prop) {
      prop = camelCase(prop);
      if (cache[prop]) {
        return cache[prop];
      }

      var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), prefixes = ["webkit", "moz", "ms", "o"], props = (prop + " " + (prefixes).join(ucProp + " ") + ucProp).split(" ");

      each(props, function (p) {
        if (p in style) {
          cache[p] = prop = cache[prop] = p;
          return false;
        }
      });

      return cache[prop];
    };
  }());

  cash.prefixedProp = getPrefixedProp;
  cash.camelCase = camelCase;

  fn.extend({
    css: function (prop, value) {
      if (isString(prop)) {
        prop = getPrefixedProp(prop);
        return (arguments.length > 1 ? this.each(function (v) {
          return v.style[prop] = value;
        }) : win.getComputedStyle(this[0])[prop]);
      }

      for (var key in prop) {
        this.css(key, prop[key]);
      }

      return this;
    }

  });

  function compute(el, prop) {
    return parseInt(win.getComputedStyle(el[0], null)[prop], 10) || 0;
  }

  each(["Width", "Height"], function (v) {
    var lower = v.toLowerCase();

    fn[lower] = function () {
      return this[0].getBoundingClientRect()[lower];
    };

    fn["inner" + v] = function () {
      return this[0]["client" + v];
    };

    fn["outer" + v] = function (margins) {
      return this[0]["offset" + v] + (margins ? compute(this, "margin" + (v === "Width" ? "Left" : "Top")) + compute(this, "margin" + (v === "Width" ? "Right" : "Bottom")) : 0);
    };
  });

  function registerEvent(node, eventName, callback) {
    var eventCache = getData(node, "_cashEvents") || setData(node, "_cashEvents", {});
    eventCache[eventName] = eventCache[eventName] || [];
    eventCache[eventName].push(callback);
    node.addEventListener(eventName, callback);
  }

  function removeEvent(node, eventName, callback) {
    var events = getData(node, "_cashEvents"), eventCache = (events && events[eventName]), index;

    if (!eventCache) {
      return;
    }

    if (callback) {
      node.removeEventListener(eventName, callback);
      index = eventCache.indexOf(callback);
      if (index >= 0) {
        eventCache.splice(index, 1);
      }
    } else {
      each(eventCache, function (event) {
        node.removeEventListener(eventName, event);
      });
      eventCache = [];
    }
  }

  fn.extend({
    off: function (eventName, callback) {
      return this.each(function (v) {
        return removeEvent(v, eventName, callback);
      });
    },

    on: function (eventName, delegate, callback, runOnce) {
      // jshint ignore:line
      var originalCallback;
      if (!isString(eventName)) {
        for (var key in eventName) {
          this.on(key, delegate, eventName[key]);
        }
        return this;
      }

      if (isFunction(delegate)) {
        callback = delegate;
        delegate = null;
      }

      if (eventName === "ready") {
        onReady(callback);
        return this;
      }

      if (delegate) {
        originalCallback = callback;
        callback = function (e) {
          var t = e.target;
          while (!matches(t, delegate)) {
            if (t === this || t === null) {
              return (t = false);
            }

            t = t.parentNode;
          }

          if (t) {
            originalCallback.call(t, e);
          }
        };
      }

      return this.each(function (v) {
        var finalCallback = callback;
        if (runOnce) {
          finalCallback = function () {
            callback.apply(this, arguments);
            removeEvent(v, eventName, finalCallback);
          };
        }
        registerEvent(v, eventName, finalCallback);
      });
    },

    one: function (eventName, delegate, callback) {
      return this.on(eventName, delegate, callback, true);
    },

    ready: onReady,

    /**
     * Modified
     * Triggers browser event
     * @param String eventName
     * @param Object data - Add properties to event object
     */
    trigger: function (eventName, data) {
      if (document.createEvent) {
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, false);
        evt = this.extend(evt, data);
        return this.each(function (v) {
          return v.dispatchEvent(evt);
        });
      }
    }

  });

  function encode(name, value) {
    return "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value).replace(/%20/g, "+");
  }

  function getSelectMultiple_(el) {
    var values = [];
    each(el.options, function (o) {
      if (o.selected) {
        values.push(o.value);
      }
    });
    return values.length ? values : null;
  }

  function getSelectSingle_(el) {
    var selectedIndex = el.selectedIndex;
    return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
  }

  function getValue(el) {
    var type = el.type;
    if (!type) {
      return null;
    }
    switch (type.toLowerCase()) {
      case "select-one":
        return getSelectSingle_(el);
      case "select-multiple":
        return getSelectMultiple_(el);
      case "radio":
        return (el.checked) ? el.value : null;
      case "checkbox":
        return (el.checked) ? el.value : null;
      default:
        return el.value ? el.value : null;
    }
  }

  fn.extend({
    serialize: function () {
      var query = "";

      each(this[0].elements || this, function (el) {
        if (el.disabled || el.tagName === "FIELDSET") {
          return;
        }
        var name = el.name;
        switch (el.type.toLowerCase()) {
          case "file":
          case "reset":
          case "submit":
          case "button":
            break;
          case "select-multiple":
            var values = getValue(el);
            if (values !== null) {
              each(values, function (value) {
                query += encode(name, value);
              });
            }
            break;
          default:
            var value = getValue(el);
            if (value !== null) {
              query += encode(name, value);
            }
        }
      });

      return query.substr(1);
    },

    val: function (value) {
      if (value === undefined) {
        return getValue(this[0]);
      }

      return this.each(function (v) {
        return v.value = value;
      });
    }

  });

  function insertElement(el, child, prepend) {
    if (prepend) {
      var first = el.childNodes[0];
      el.insertBefore(child, first);
    } else {
      el.appendChild(child);
    }
  }

  function insertContent(parent, child, prepend) {
    var str = isString(child);

    if (!str && child.length) {
      each(child, function (v) {
        return insertContent(parent, v, prepend);
      });
      return;
    }

    each(parent, str ? function (v) {
      return v.insertAdjacentHTML(prepend ? "afterbegin" : "beforeend", child);
    } : function (v, i) {
      return insertElement(v, (i === 0 ? child : child.cloneNode(true)), prepend);
    });
  }

  fn.extend({
    after: function (selector) {
      cash(selector).insertAfter(this);
      return this;
    },

    append: function (content) {
      insertContent(this, content);
      return this;
    },

    appendTo: function (parent) {
      insertContent(cash(parent), this);
      return this;
    },

    before: function (selector) {
      cash(selector).insertBefore(this);
      return this;
    },

    clone: function () {
      return cash(this.map(function (v) {
        return v.cloneNode(true);
      }));
    },

    empty: function () {
      this.html("");
      return this;
    },

    html: function (content) {
      if (content === undefined) {
        return this[0].innerHTML;
      }
      var source = (content.nodeType ? content[0].outerHTML : content);
      return this.each(function (v) {
        return v.innerHTML = source;
      });
    },

    insertAfter: function (selector) {
      var _this = this;


      cash(selector).each(function (el, i) {
        var parent = el.parentNode, sibling = el.nextSibling;
        _this.each(function (v) {
          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), sibling);
        });
      });

      return this;
    },

    insertBefore: function (selector) {
      var _this2 = this;
      cash(selector).each(function (el, i) {
        var parent = el.parentNode;
        _this2.each(function (v) {
          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), el);
        });
      });
      return this;
    },

    prepend: function (content) {
      insertContent(this, content, true);
      return this;
    },

    prependTo: function (parent) {
      insertContent(cash(parent), this, true);
      return this;
    },

    remove: function () {
      return this.each(function (v) {
        if (!!v.parentNode) {
          return v.parentNode.removeChild(v);
        }
      });
    },

    text: function (content) {
      if (content === undefined) {
        return this[0].textContent;
      }
      return this.each(function (v) {
        return v.textContent = content;
      });
    }

  });

  var docEl = doc.documentElement;

  fn.extend({
    position: function () {
      var el = this[0];
      return {
        left: el.offsetLeft,
        top: el.offsetTop
      };
    },

    offset: function () {
      var rect = this[0].getBoundingClientRect();
      return {
        top: rect.top + win.pageYOffset - docEl.clientTop,
        left: rect.left + win.pageXOffset - docEl.clientLeft
      };
    },

    offsetParent: function () {
      return cash(this[0].offsetParent);
    }

  });

  fn.extend({
    children: function (selector) {
      var elems = [];
      this.each(function (el) {
        push.apply(elems, el.children);
      });
      elems = unique(elems);

      return (!selector ? elems : elems.filter(function (v) {
        return matches(v, selector);
      }));
    },

    closest: function (selector) {
      if (!selector || this.length < 1) {
        return cash();
      }
      if (this.is(selector)) {
        return this.filter(selector);
      }
      return this.parent().closest(selector);
    },

    is: function (selector) {
      if (!selector) {
        return false;
      }

      var match = false, comparator = getCompareFunction(selector);

      this.each(function (el) {
        match = comparator(el, selector);
        return !match;
      });

      return match;
    },

    find: function (selector) {
      if (!selector || selector.nodeType) {
        return cash(selector && this.has(selector).length ? selector : null);
      }

      var elems = [];
      this.each(function (el) {
        push.apply(elems, find(selector, el));
      });

      return unique(elems);
    },

    has: function (selector) {
      var comparator = (isString(selector) ? function (el) {
        return find(selector, el).length !== 0;
      } : function (el) {
        return el.contains(selector);
      });

      return this.filter(comparator);
    },

    next: function () {
      return cash(this[0].nextElementSibling);
    },

    not: function (selector) {
      if (!selector) {
        return this;
      }

      var comparator = getCompareFunction(selector);

      return this.filter(function (el) {
        return !comparator(el, selector);
      });
    },

    parent: function () {
      var result = [];

      this.each(function (item) {
        if (item && item.parentNode) {
          result.push(item.parentNode);
        }
      });

      return unique(result);
    },

    parents: function (selector) {
      var last, result = [];

      this.each(function (item) {
        last = item;

        while (last && last.parentNode && last !== doc.body.parentNode) {
          last = last.parentNode;

          if (!selector || (selector && matches(last, selector))) {
            result.push(last);
          }
        }
      });

      return unique(result);
    },

    prev: function () {
      return cash(this[0].previousElementSibling);
    },

    siblings: function (selector) {
      var collection = this.parent().children(selector), el = this[0];

      return collection.filter(function (i) {
        return i !== el;
      });
    }

  });


  return cash;
});

},{}],"../node_modules/materialize-css/js/global.js":[function(require,module,exports) {
var define;
// Required for Meteor package, the use of window prevents export by Meteor
(function(window) {
  if (window.Package) {
    M = {};
  } else {
    window.M = {};
  }

  // Check for jQuery
  M.jQueryLoaded = !!window.jQuery;
})(window);

// AMD
if (typeof define === 'function' && define.amd) {
  define('M', [], function() {
    return M;
  });

  // Common JS
} else if (typeof exports !== 'undefined' && !exports.nodeType) {
  if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
    exports = module.exports = M;
  }
  exports.default = M;
}

M.keys = {
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  ARROW_UP: 38,
  ARROW_DOWN: 40
};

/**
 * TabPress Keydown handler
 */
M.tabPressed = false;
M.keyDown = false;
let docHandleKeydown = function(e) {
  M.keyDown = true;
  if (e.which === M.keys.TAB || e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) {
    M.tabPressed = true;
  }
};
let docHandleKeyup = function(e) {
  M.keyDown = false;
  if (e.which === M.keys.TAB || e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) {
    M.tabPressed = false;
  }
};
let docHandleFocus = function(e) {
  if (M.keyDown) {
    document.body.classList.add('keyboard-focused');
  }
};
let docHandleBlur = function(e) {
  document.body.classList.remove('keyboard-focused');
};
document.addEventListener('keydown', docHandleKeydown, true);
document.addEventListener('keyup', docHandleKeyup, true);
document.addEventListener('focus', docHandleFocus, true);
document.addEventListener('blur', docHandleBlur, true);

/**
 * Initialize jQuery wrapper for plugin
 * @param {Class} plugin  javascript class
 * @param {string} pluginName  jQuery plugin name
 * @param {string} classRef  Class reference name
 */
M.initializeJqueryWrapper = function(plugin, pluginName, classRef) {
  jQuery.fn[pluginName] = function(methodOrOptions) {
    // Call plugin method if valid method name is passed in
    if (plugin.prototype[methodOrOptions]) {
      let params = Array.prototype.slice.call(arguments, 1);

      // Getter methods
      if (methodOrOptions.slice(0, 3) === 'get') {
        let instance = this.first()[0][classRef];
        return instance[methodOrOptions].apply(instance, params);
      }

      // Void methods
      return this.each(function() {
        let instance = this[classRef];
        instance[methodOrOptions].apply(instance, params);
      });

      // Initialize plugin if options or no argument is passed in
    } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
      plugin.init(this, arguments[0]);
      return this;
    }

    // Return error if an unrecognized  method name is passed in
    jQuery.error(`Method ${methodOrOptions} does not exist on jQuery.${pluginName}`);
  };
};

/**
 * Automatically initialize components
 * @param {Element} context  DOM Element to search within for components
 */
M.AutoInit = function(context) {
  // Use document.body if no context is given
  let root = !!context ? context : document.body;

  let registry = {
    Autocomplete: root.querySelectorAll('.autocomplete:not(.no-autoinit)'),
    Carousel: root.querySelectorAll('.carousel:not(.no-autoinit)'),
    Chips: root.querySelectorAll('.chips:not(.no-autoinit)'),
    Collapsible: root.querySelectorAll('.collapsible:not(.no-autoinit)'),
    Datepicker: root.querySelectorAll('.datepicker:not(.no-autoinit)'),
    Dropdown: root.querySelectorAll('.dropdown-trigger:not(.no-autoinit)'),
    Materialbox: root.querySelectorAll('.materialboxed:not(.no-autoinit)'),
    Modal: root.querySelectorAll('.modal:not(.no-autoinit)'),
    Parallax: root.querySelectorAll('.parallax:not(.no-autoinit)'),
    Pushpin: root.querySelectorAll('.pushpin:not(.no-autoinit)'),
    ScrollSpy: root.querySelectorAll('.scrollspy:not(.no-autoinit)'),
    FormSelect: root.querySelectorAll('select:not(.no-autoinit)'),
    Sidenav: root.querySelectorAll('.sidenav:not(.no-autoinit)'),
    Tabs: root.querySelectorAll('.tabs:not(.no-autoinit)'),
    TapTarget: root.querySelectorAll('.tap-target:not(.no-autoinit)'),
    Timepicker: root.querySelectorAll('.timepicker:not(.no-autoinit)'),
    Tooltip: root.querySelectorAll('.tooltipped:not(.no-autoinit)'),
    FloatingActionButton: root.querySelectorAll('.fixed-action-btn:not(.no-autoinit)')
  };

  for (let pluginName in registry) {
    let plugin = M[pluginName];
    plugin.init(registry[pluginName]);
  }
};

/**
 * Generate approximated selector string for a jQuery object
 * @param {jQuery} obj  jQuery object to be parsed
 * @returns {string}
 */
M.objectSelectorString = function(obj) {
  let tagStr = obj.prop('tagName') || '';
  let idStr = obj.attr('id') || '';
  let classStr = obj.attr('class') || '';
  return (tagStr + idStr + classStr).replace(/\s/g, '');
};

// Unique Random ID
M.guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
})();

/**
 * Escapes hash from special characters
 * @param {string} hash  String returned from this.hash
 * @returns {string}
 */
M.escapeHash = function(hash) {
  return hash.replace(/(:|\.|\[|\]|,|=|\/)/g, '\\$1');
};

M.elementOrParentIsFixed = function(element) {
  let $element = $(element);
  let $checkElements = $element.add($element.parents());
  let isFixed = false;
  $checkElements.each(function() {
    if ($(this).css('position') === 'fixed') {
      isFixed = true;
      return false;
    }
  });
  return isFixed;
};

/**
 * @typedef {Object} Edges
 * @property {Boolean} top  If the top edge was exceeded
 * @property {Boolean} right  If the right edge was exceeded
 * @property {Boolean} bottom  If the bottom edge was exceeded
 * @property {Boolean} left  If the left edge was exceeded
 */

/**
 * @typedef {Object} Bounding
 * @property {Number} left  left offset coordinate
 * @property {Number} top  top offset coordinate
 * @property {Number} width
 * @property {Number} height
 */

/**
 * Escapes hash from special characters
 * @param {Element} container  Container element that acts as the boundary
 * @param {Bounding} bounding  element bounding that is being checked
 * @param {Number} offset  offset from edge that counts as exceeding
 * @returns {Edges}
 */
M.checkWithinContainer = function(container, bounding, offset) {
  let edges = {
    top: false,
    right: false,
    bottom: false,
    left: false
  };

  let containerRect = container.getBoundingClientRect();
  // If body element is smaller than viewport, use viewport height instead.
  let containerBottom =
    container === document.body
      ? Math.max(containerRect.bottom, window.innerHeight)
      : containerRect.bottom;

  let scrollLeft = container.scrollLeft;
  let scrollTop = container.scrollTop;

  let scrolledX = bounding.left - scrollLeft;
  let scrolledY = bounding.top - scrollTop;

  // Check for container and viewport for each edge
  if (scrolledX < containerRect.left + offset || scrolledX < offset) {
    edges.left = true;
  }

  if (
    scrolledX + bounding.width > containerRect.right - offset ||
    scrolledX + bounding.width > window.innerWidth - offset
  ) {
    edges.right = true;
  }

  if (scrolledY < containerRect.top + offset || scrolledY < offset) {
    edges.top = true;
  }

  if (
    scrolledY + bounding.height > containerBottom - offset ||
    scrolledY + bounding.height > window.innerHeight - offset
  ) {
    edges.bottom = true;
  }

  return edges;
};

M.checkPossibleAlignments = function(el, container, bounding, offset) {
  let canAlign = {
    top: true,
    right: true,
    bottom: true,
    left: true,
    spaceOnTop: null,
    spaceOnRight: null,
    spaceOnBottom: null,
    spaceOnLeft: null
  };

  let containerAllowsOverflow = getComputedStyle(container).overflow === 'visible';
  let containerRect = container.getBoundingClientRect();
  let containerHeight = Math.min(containerRect.height, window.innerHeight);
  let containerWidth = Math.min(containerRect.width, window.innerWidth);
  let elOffsetRect = el.getBoundingClientRect();

  let scrollLeft = container.scrollLeft;
  let scrollTop = container.scrollTop;

  let scrolledX = bounding.left - scrollLeft;
  let scrolledYTopEdge = bounding.top - scrollTop;
  let scrolledYBottomEdge = bounding.top + elOffsetRect.height - scrollTop;

  // Check for container and viewport for left
  canAlign.spaceOnRight = !containerAllowsOverflow
    ? containerWidth - (scrolledX + bounding.width)
    : window.innerWidth - (elOffsetRect.left + bounding.width);
  if (canAlign.spaceOnRight < 0) {
    canAlign.left = false;
  }

  // Check for container and viewport for Right
  canAlign.spaceOnLeft = !containerAllowsOverflow
    ? scrolledX - bounding.width + elOffsetRect.width
    : elOffsetRect.right - bounding.width;
  if (canAlign.spaceOnLeft < 0) {
    canAlign.right = false;
  }

  // Check for container and viewport for Top
  canAlign.spaceOnBottom = !containerAllowsOverflow
    ? containerHeight - (scrolledYTopEdge + bounding.height + offset)
    : window.innerHeight - (elOffsetRect.top + bounding.height + offset);
  if (canAlign.spaceOnBottom < 0) {
    canAlign.top = false;
  }

  // Check for container and viewport for Bottom
  canAlign.spaceOnTop = !containerAllowsOverflow
    ? scrolledYBottomEdge - (bounding.height - offset)
    : elOffsetRect.bottom - (bounding.height + offset);
  if (canAlign.spaceOnTop < 0) {
    canAlign.bottom = false;
  }

  return canAlign;
};

M.getOverflowParent = function(element) {
  if (element == null) {
    return null;
  }

  if (element === document.body || getComputedStyle(element).overflow !== 'visible') {
    return element;
  }

  return M.getOverflowParent(element.parentElement);
};

/**
 * Gets id of component from a trigger
 * @param {Element} trigger  trigger
 * @returns {string}
 */
M.getIdFromTrigger = function(trigger) {
  let id = trigger.getAttribute('data-target');
  if (!id) {
    id = trigger.getAttribute('href');
    if (id) {
      id = id.slice(1);
    } else {
      id = '';
    }
  }
  return id;
};

/**
 * Multi browser support for document scroll top
 * @returns {Number}
 */
M.getDocumentScrollTop = function() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

/**
 * Multi browser support for document scroll left
 * @returns {Number}
 */
M.getDocumentScrollLeft = function() {
  return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
};

/**
 * @typedef {Object} Edges
 * @property {Boolean} top  If the top edge was exceeded
 * @property {Boolean} right  If the right edge was exceeded
 * @property {Boolean} bottom  If the bottom edge was exceeded
 * @property {Boolean} left  If the left edge was exceeded
 */

/**
 * @typedef {Object} Bounding
 * @property {Number} left  left offset coordinate
 * @property {Number} top  top offset coordinate
 * @property {Number} width
 * @property {Number} height
 */

/**
 * Get time in ms
 * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
 * @type {function}
 * @return {number}
 */
let getTime =
  Date.now ||
  function() {
    return new Date().getTime();
  };

/**
 * Returns a function, that, when invoked, will only be triggered at most once
 * during a given window of time. Normally, the throttled function will run
 * as much as it can, without ever going more than once per `wait` duration;
 * but if you'd like to disable the execution on the leading edge, pass
 * `{leading: false}`. To disable execution on the trailing edge, ditto.
 * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
 * @param {function} func
 * @param {number} wait
 * @param {Object=} options
 * @returns {Function}
 */
M.throttle = function(func, wait, options) {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  options || (options = {});
  let later = function() {
    previous = options.leading === false ? 0 : getTime();
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };
  return function() {
    let now = getTime();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

},{}],"../node_modules/materialize-css/js/anime.min.js":[function(require,module,exports) {
var global = arguments[3];
/*
 v2.2.0
 2017 Julian Garnier
 Released under the MIT license
*/
var $jscomp={scope:{}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(e,r,p){if(p.get||p.set)throw new TypeError("ES3 does not support getters and setters.");e!=Array.prototype&&e!=Object.prototype&&(e[r]=p.value)};$jscomp.getGlobal=function(e){return"undefined"!=typeof window&&window===e?e:"undefined"!=typeof global&&null!=global?global:e};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(e){return $jscomp.SYMBOL_PREFIX+(e||"")+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var e=$jscomp.global.Symbol.iterator;e||(e=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[e]&&$jscomp.defineProperty(Array.prototype,e,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(e){var r=0;return $jscomp.iteratorPrototype(function(){return r<e.length?{done:!1,value:e[r++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(e){$jscomp.initSymbolIterator();e={next:e};e[$jscomp.global.Symbol.iterator]=function(){return this};return e};$jscomp.array=$jscomp.array||{};$jscomp.iteratorFromArray=function(e,r){$jscomp.initSymbolIterator();e instanceof String&&(e+="");var p=0,m={next:function(){if(p<e.length){var u=p++;return{value:r(u,e[u]),done:!1}}m.next=function(){return{done:!0,value:void 0}};return m.next()}};m[Symbol.iterator]=function(){return m};return m};
$jscomp.polyfill=function(e,r,p,m){if(r){p=$jscomp.global;e=e.split(".");for(m=0;m<e.length-1;m++){var u=e[m];u in p||(p[u]={});p=p[u]}e=e[e.length-1];m=p[e];r=r(m);r!=m&&null!=r&&$jscomp.defineProperty(p,e,{configurable:!0,writable:!0,value:r})}};$jscomp.polyfill("Array.prototype.keys",function(e){return e?e:function(){return $jscomp.iteratorFromArray(this,function(e){return e})}},"es6-impl","es3");var $jscomp$this=this;
(function(r){M.anime=r()})(function(){function e(a){if(!h.col(a))try{return document.querySelectorAll(a)}catch(c){}}function r(a,c){for(var d=a.length,b=2<=arguments.length?arguments[1]:void 0,f=[],n=0;n<d;n++)if(n in a){var k=a[n];c.call(b,k,n,a)&&f.push(k)}return f}function p(a){return a.reduce(function(a,d){return a.concat(h.arr(d)?p(d):d)},[])}function m(a){if(h.arr(a))return a;
h.str(a)&&(a=e(a)||a);return a instanceof NodeList||a instanceof HTMLCollection?[].slice.call(a):[a]}function u(a,c){return a.some(function(a){return a===c})}function C(a){var c={},d;for(d in a)c[d]=a[d];return c}function D(a,c){var d=C(a),b;for(b in a)d[b]=c.hasOwnProperty(b)?c[b]:a[b];return d}function z(a,c){var d=C(a),b;for(b in c)d[b]=h.und(a[b])?c[b]:a[b];return d}function T(a){a=a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(a,c,d,k){return c+c+d+d+k+k});var c=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
a=parseInt(c[1],16);var d=parseInt(c[2],16),c=parseInt(c[3],16);return"rgba("+a+","+d+","+c+",1)"}function U(a){function c(a,c,b){0>b&&(b+=1);1<b&&--b;return b<1/6?a+6*(c-a)*b:.5>b?c:b<2/3?a+(c-a)*(2/3-b)*6:a}var d=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(a);a=parseInt(d[1])/360;var b=parseInt(d[2])/100,f=parseInt(d[3])/100,d=d[4]||1;if(0==b)f=b=a=f;else{var n=.5>f?f*(1+b):f+b-f*b,k=2*f-n,f=c(k,n,a+1/3),b=c(k,n,a);a=c(k,n,a-1/3)}return"rgba("+
255*f+","+255*b+","+255*a+","+d+")"}function y(a){if(a=/([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(a))return a[2]}function V(a){if(-1<a.indexOf("translate")||"perspective"===a)return"px";if(-1<a.indexOf("rotate")||-1<a.indexOf("skew"))return"deg"}function I(a,c){return h.fnc(a)?a(c.target,c.id,c.total):a}function E(a,c){if(c in a.style)return getComputedStyle(a).getPropertyValue(c.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase())||"0"}function J(a,c){if(h.dom(a)&&
u(W,c))return"transform";if(h.dom(a)&&(a.getAttribute(c)||h.svg(a)&&a[c]))return"attribute";if(h.dom(a)&&"transform"!==c&&E(a,c))return"css";if(null!=a[c])return"object"}function X(a,c){var d=V(c),d=-1<c.indexOf("scale")?1:0+d;a=a.style.transform;if(!a)return d;for(var b=[],f=[],n=[],k=/(\w+)\((.+?)\)/g;b=k.exec(a);)f.push(b[1]),n.push(b[2]);a=r(n,function(a,b){return f[b]===c});return a.length?a[0]:d}function K(a,c){switch(J(a,c)){case "transform":return X(a,c);case "css":return E(a,c);case "attribute":return a.getAttribute(c)}return a[c]||
0}function L(a,c){var d=/^(\*=|\+=|-=)/.exec(a);if(!d)return a;var b=y(a)||0;c=parseFloat(c);a=parseFloat(a.replace(d[0],""));switch(d[0][0]){case "+":return c+a+b;case "-":return c-a+b;case "*":return c*a+b}}function F(a,c){return Math.sqrt(Math.pow(c.x-a.x,2)+Math.pow(c.y-a.y,2))}function M(a){a=a.points;for(var c=0,d,b=0;b<a.numberOfItems;b++){var f=a.getItem(b);0<b&&(c+=F(d,f));d=f}return c}function N(a){if(a.getTotalLength)return a.getTotalLength();switch(a.tagName.toLowerCase()){case "circle":return 2*
Math.PI*a.getAttribute("r");case "rect":return 2*a.getAttribute("width")+2*a.getAttribute("height");case "line":return F({x:a.getAttribute("x1"),y:a.getAttribute("y1")},{x:a.getAttribute("x2"),y:a.getAttribute("y2")});case "polyline":return M(a);case "polygon":var c=a.points;return M(a)+F(c.getItem(c.numberOfItems-1),c.getItem(0))}}function Y(a,c){function d(b){b=void 0===b?0:b;return a.el.getPointAtLength(1<=c+b?c+b:0)}var b=d(),f=d(-1),n=d(1);switch(a.property){case "x":return b.x;case "y":return b.y;
case "angle":return 180*Math.atan2(n.y-f.y,n.x-f.x)/Math.PI}}function O(a,c){var d=/-?\d*\.?\d+/g,b;b=h.pth(a)?a.totalLength:a;if(h.col(b))if(h.rgb(b)){var f=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(b);b=f?"rgba("+f[1]+",1)":b}else b=h.hex(b)?T(b):h.hsl(b)?U(b):void 0;else f=(f=y(b))?b.substr(0,b.length-f.length):b,b=c&&!/\s/g.test(b)?f+c:f;b+="";return{original:b,numbers:b.match(d)?b.match(d).map(Number):[0],strings:h.str(a)||c?b.split(d):[]}}function P(a){a=a?p(h.arr(a)?a.map(m):m(a)):[];return r(a,
function(a,d,b){return b.indexOf(a)===d})}function Z(a){var c=P(a);return c.map(function(a,b){return{target:a,id:b,total:c.length}})}function aa(a,c){var d=C(c);if(h.arr(a)){var b=a.length;2!==b||h.obj(a[0])?h.fnc(c.duration)||(d.duration=c.duration/b):a={value:a}}return m(a).map(function(a,b){b=b?0:c.delay;a=h.obj(a)&&!h.pth(a)?a:{value:a};h.und(a.delay)&&(a.delay=b);return a}).map(function(a){return z(a,d)})}function ba(a,c){var d={},b;for(b in a){var f=I(a[b],c);h.arr(f)&&(f=f.map(function(a){return I(a,
c)}),1===f.length&&(f=f[0]));d[b]=f}d.duration=parseFloat(d.duration);d.delay=parseFloat(d.delay);return d}function ca(a){return h.arr(a)?A.apply(this,a):Q[a]}function da(a,c){var d;return a.tweens.map(function(b){b=ba(b,c);var f=b.value,e=K(c.target,a.name),k=d?d.to.original:e,k=h.arr(f)?f[0]:k,w=L(h.arr(f)?f[1]:f,k),e=y(w)||y(k)||y(e);b.from=O(k,e);b.to=O(w,e);b.start=d?d.end:a.offset;b.end=b.start+b.delay+b.duration;b.easing=ca(b.easing);b.elasticity=(1E3-Math.min(Math.max(b.elasticity,1),999))/
1E3;b.isPath=h.pth(f);b.isColor=h.col(b.from.original);b.isColor&&(b.round=1);return d=b})}function ea(a,c){return r(p(a.map(function(a){return c.map(function(b){var c=J(a.target,b.name);if(c){var d=da(b,a);b={type:c,property:b.name,animatable:a,tweens:d,duration:d[d.length-1].end,delay:d[0].delay}}else b=void 0;return b})})),function(a){return!h.und(a)})}function R(a,c,d,b){var f="delay"===a;return c.length?(f?Math.min:Math.max).apply(Math,c.map(function(b){return b[a]})):f?b.delay:d.offset+b.delay+
b.duration}function fa(a){var c=D(ga,a),d=D(S,a),b=Z(a.targets),f=[],e=z(c,d),k;for(k in a)e.hasOwnProperty(k)||"targets"===k||f.push({name:k,offset:e.offset,tweens:aa(a[k],d)});a=ea(b,f);return z(c,{children:[],animatables:b,animations:a,duration:R("duration",a,c,d),delay:R("delay",a,c,d)})}function q(a){function c(){return window.Promise&&new Promise(function(a){return p=a})}function d(a){return g.reversed?g.duration-a:a}function b(a){for(var b=0,c={},d=g.animations,f=d.length;b<f;){var e=d[b],
k=e.animatable,h=e.tweens,n=h.length-1,l=h[n];n&&(l=r(h,function(b){return a<b.end})[0]||l);for(var h=Math.min(Math.max(a-l.start-l.delay,0),l.duration)/l.duration,w=isNaN(h)?1:l.easing(h,l.elasticity),h=l.to.strings,p=l.round,n=[],m=void 0,m=l.to.numbers.length,t=0;t<m;t++){var x=void 0,x=l.to.numbers[t],q=l.from.numbers[t],x=l.isPath?Y(l.value,w*x):q+w*(x-q);p&&(l.isColor&&2<t||(x=Math.round(x*p)/p));n.push(x)}if(l=h.length)for(m=h[0],w=0;w<l;w++)p=h[w+1],t=n[w],isNaN(t)||(m=p?m+(t+p):m+(t+" "));
else m=n[0];ha[e.type](k.target,e.property,m,c,k.id);e.currentValue=m;b++}if(b=Object.keys(c).length)for(d=0;d<b;d++)H||(H=E(document.body,"transform")?"transform":"-webkit-transform"),g.animatables[d].target.style[H]=c[d].join(" ");g.currentTime=a;g.progress=a/g.duration*100}function f(a){if(g[a])g[a](g)}function e(){g.remaining&&!0!==g.remaining&&g.remaining--}function k(a){var k=g.duration,n=g.offset,w=n+g.delay,r=g.currentTime,x=g.reversed,q=d(a);if(g.children.length){var u=g.children,v=u.length;
if(q>=g.currentTime)for(var G=0;G<v;G++)u[G].seek(q);else for(;v--;)u[v].seek(q)}if(q>=w||!k)g.began||(g.began=!0,f("begin")),f("run");if(q>n&&q<k)b(q);else if(q<=n&&0!==r&&(b(0),x&&e()),q>=k&&r!==k||!k)b(k),x||e();f("update");a>=k&&(g.remaining?(t=h,"alternate"===g.direction&&(g.reversed=!g.reversed)):(g.pause(),g.completed||(g.completed=!0,f("complete"),"Promise"in window&&(p(),m=c()))),l=0)}a=void 0===a?{}:a;var h,t,l=0,p=null,m=c(),g=fa(a);g.reset=function(){var a=g.direction,c=g.loop;g.currentTime=
0;g.progress=0;g.paused=!0;g.began=!1;g.completed=!1;g.reversed="reverse"===a;g.remaining="alternate"===a&&1===c?2:c;b(0);for(a=g.children.length;a--;)g.children[a].reset()};g.tick=function(a){h=a;t||(t=h);k((l+h-t)*q.speed)};g.seek=function(a){k(d(a))};g.pause=function(){var a=v.indexOf(g);-1<a&&v.splice(a,1);g.paused=!0};g.play=function(){g.paused&&(g.paused=!1,t=0,l=d(g.currentTime),v.push(g),B||ia())};g.reverse=function(){g.reversed=!g.reversed;t=0;l=d(g.currentTime)};g.restart=function(){g.pause();
g.reset();g.play()};g.finished=m;g.reset();g.autoplay&&g.play();return g}var ga={update:void 0,begin:void 0,run:void 0,complete:void 0,loop:1,direction:"normal",autoplay:!0,offset:0},S={duration:1E3,delay:0,easing:"easeOutElastic",elasticity:500,round:0},W="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY perspective".split(" "),H,h={arr:function(a){return Array.isArray(a)},obj:function(a){return-1<Object.prototype.toString.call(a).indexOf("Object")},
pth:function(a){return h.obj(a)&&a.hasOwnProperty("totalLength")},svg:function(a){return a instanceof SVGElement},dom:function(a){return a.nodeType||h.svg(a)},str:function(a){return"string"===typeof a},fnc:function(a){return"function"===typeof a},und:function(a){return"undefined"===typeof a},hex:function(a){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)},rgb:function(a){return/^rgb/.test(a)},hsl:function(a){return/^hsl/.test(a)},col:function(a){return h.hex(a)||h.rgb(a)||h.hsl(a)}},A=function(){function a(a,
d,b){return(((1-3*b+3*d)*a+(3*b-6*d))*a+3*d)*a}return function(c,d,b,f){if(0<=c&&1>=c&&0<=b&&1>=b){var e=new Float32Array(11);if(c!==d||b!==f)for(var k=0;11>k;++k)e[k]=a(.1*k,c,b);return function(k){if(c===d&&b===f)return k;if(0===k)return 0;if(1===k)return 1;for(var h=0,l=1;10!==l&&e[l]<=k;++l)h+=.1;--l;var l=h+(k-e[l])/(e[l+1]-e[l])*.1,n=3*(1-3*b+3*c)*l*l+2*(3*b-6*c)*l+3*c;if(.001<=n){for(h=0;4>h;++h){n=3*(1-3*b+3*c)*l*l+2*(3*b-6*c)*l+3*c;if(0===n)break;var m=a(l,c,b)-k,l=l-m/n}k=l}else if(0===
n)k=l;else{var l=h,h=h+.1,g=0;do m=l+(h-l)/2,n=a(m,c,b)-k,0<n?h=m:l=m;while(1e-7<Math.abs(n)&&10>++g);k=m}return a(k,d,f)}}}}(),Q=function(){function a(a,b){return 0===a||1===a?a:-Math.pow(2,10*(a-1))*Math.sin(2*(a-1-b/(2*Math.PI)*Math.asin(1))*Math.PI/b)}var c="Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "),d={In:[[.55,.085,.68,.53],[.55,.055,.675,.19],[.895,.03,.685,.22],[.755,.05,.855,.06],[.47,0,.745,.715],[.95,.05,.795,.035],[.6,.04,.98,.335],[.6,-.28,.735,.045],a],Out:[[.25,
.46,.45,.94],[.215,.61,.355,1],[.165,.84,.44,1],[.23,1,.32,1],[.39,.575,.565,1],[.19,1,.22,1],[.075,.82,.165,1],[.175,.885,.32,1.275],function(b,c){return 1-a(1-b,c)}],InOut:[[.455,.03,.515,.955],[.645,.045,.355,1],[.77,0,.175,1],[.86,0,.07,1],[.445,.05,.55,.95],[1,0,0,1],[.785,.135,.15,.86],[.68,-.55,.265,1.55],function(b,c){return.5>b?a(2*b,c)/2:1-a(-2*b+2,c)/2}]},b={linear:A(.25,.25,.75,.75)},f={},e;for(e in d)f.type=e,d[f.type].forEach(function(a){return function(d,f){b["ease"+a.type+c[f]]=h.fnc(d)?
d:A.apply($jscomp$this,d)}}(f)),f={type:f.type};return b}(),ha={css:function(a,c,d){return a.style[c]=d},attribute:function(a,c,d){return a.setAttribute(c,d)},object:function(a,c,d){return a[c]=d},transform:function(a,c,d,b,f){b[f]||(b[f]=[]);b[f].push(c+"("+d+")")}},v=[],B=0,ia=function(){function a(){B=requestAnimationFrame(c)}function c(c){var b=v.length;if(b){for(var d=0;d<b;)v[d]&&v[d].tick(c),d++;a()}else cancelAnimationFrame(B),B=0}return a}();q.version="2.2.0";q.speed=1;q.running=v;q.remove=
function(a){a=P(a);for(var c=v.length;c--;)for(var d=v[c],b=d.animations,f=b.length;f--;)u(a,b[f].animatable.target)&&(b.splice(f,1),b.length||d.pause())};q.getValue=K;q.path=function(a,c){var d=h.str(a)?e(a)[0]:a,b=c||100;return function(a){return{el:d,property:a,totalLength:N(d)*(b/100)}}};q.setDashoffset=function(a){var c=N(a);a.setAttribute("stroke-dasharray",c);return c};q.bezier=A;q.easings=Q;q.timeline=function(a){var c=q(a);c.pause();c.duration=0;c.add=function(d){c.children.forEach(function(a){a.began=
!0;a.completed=!0});m(d).forEach(function(b){var d=z(b,D(S,a||{}));d.targets=d.targets||a.targets;b=c.duration;var e=d.offset;d.autoplay=!1;d.direction=c.direction;d.offset=h.und(e)?b:L(e,b);c.began=!0;c.completed=!0;c.seek(d.offset);d=q(d);d.began=!0;d.completed=!0;d.duration>b&&(c.duration=d.duration);c.children.push(d)});c.seek(0);c.reset();c.autoplay&&c.restart();return c};return c};q.random=function(a,c){return Math.floor(Math.random()*(c-a+1))+a};return q});

},{}],"../node_modules/materialize-css/js/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Component {
  /**
   * Generic constructor for all components
   * @constructor
   * @param {Element} el
   * @param {Object} options
   */
  constructor(classDef, el, options) {
    // Display error if el is valid HTML Element
    if (!(el instanceof Element)) {
      console.error(Error(el + ' is not an HTML Element'));
    } // If exists, destroy and reinitialize in child


    let ins = classDef.getInstance(el);

    if (!!ins) {
      ins.destroy();
    }

    this.el = el;
    this.$el = cash(el);
  }
  /**
   * Initializes components
   * @param {class} classDef
   * @param {Element | NodeList | jQuery} els
   * @param {Object} options
   */


  static init(classDef, els, options) {
    let instances = null;

    if (els instanceof Element) {
      instances = new classDef(els, options);
    } else if (!!els && (els.jquery || els.cash || els instanceof NodeList)) {
      let instancesArr = [];

      for (let i = 0; i < els.length; i++) {
        instancesArr.push(new classDef(els[i], options));
      }

      instances = instancesArr;
    }

    return instances;
  }

}

exports.default = Component;
},{}],"../node_modules/materialize-css/js/tabs.js":[function(require,module,exports) {
"use strict";

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($, anim) {
  'use strict';

  let _defaults = {
    duration: 300,
    onShow: null,
    swipeable: false,
    responsiveThreshold: Infinity // breakpoint for swipeable

  };
  /**
   * @class
   *
   */

  class Tabs extends _component.default {
    /**
     * Construct Tabs instance
     * @constructor
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options) {
      super(Tabs, el, options);
      this.el.M_Tabs = this;
      /**
       * Options for the Tabs
       * @member Tabs#options
       * @prop {Number} duration
       * @prop {Function} onShow
       * @prop {Boolean} swipeable
       * @prop {Number} responsiveThreshold
       */

      this.options = $.extend({}, Tabs.defaults, options); // Setup

      this.$tabLinks = this.$el.children('li.tab').children('a');
      this.index = 0;

      this._setupActiveTabLink(); // Setup tabs content


      if (this.options.swipeable) {
        this._setupSwipeableTabs();
      } else {
        this._setupNormalTabs();
      } // Setup tabs indicator after content to ensure accurate widths


      this._setTabsAndTabWidth();

      this._createIndicator();

      this._setupEventHandlers();
    }

    static get defaults() {
      return _defaults;
    }

    static init(els, options) {
      return super.init(this, els, options);
    }
    /**
     * Get Instance
     */


    static getInstance(el) {
      let domElem = !!el.jquery ? el[0] : el;
      return domElem.M_Tabs;
    }
    /**
     * Teardown component
     */


    destroy() {
      this._removeEventHandlers();

      this._indicator.parentNode.removeChild(this._indicator);

      if (this.options.swipeable) {
        this._teardownSwipeableTabs();
      } else {
        this._teardownNormalTabs();
      }

      this.$el[0].M_Tabs = undefined;
    }
    /**
     * Setup Event Handlers
     */


    _setupEventHandlers() {
      this._handleWindowResizeBound = this._handleWindowResize.bind(this);
      window.addEventListener('resize', this._handleWindowResizeBound);
      this._handleTabClickBound = this._handleTabClick.bind(this);
      this.el.addEventListener('click', this._handleTabClickBound);
    }
    /**
     * Remove Event Handlers
     */


    _removeEventHandlers() {
      window.removeEventListener('resize', this._handleWindowResizeBound);
      this.el.removeEventListener('click', this._handleTabClickBound);
    }
    /**
     * Handle window Resize
     */


    _handleWindowResize() {
      this._setTabsAndTabWidth();

      if (this.tabWidth !== 0 && this.tabsWidth !== 0) {
        this._indicator.style.left = this._calcLeftPos(this.$activeTabLink) + 'px';
        this._indicator.style.right = this._calcRightPos(this.$activeTabLink) + 'px';
      }
    }
    /**
     * Handle tab click
     * @param {Event} e
     */


    _handleTabClick(e) {
      let tab = $(e.target).closest('li.tab');
      let tabLink = $(e.target).closest('a'); // Handle click on tab link only

      if (!tabLink.length || !tabLink.parent().hasClass('tab')) {
        return;
      }

      if (tab.hasClass('disabled')) {
        e.preventDefault();
        return;
      } // Act as regular link if target attribute is specified.


      if (!!tabLink.attr('target')) {
        return;
      } // Make the old tab inactive.


      this.$activeTabLink.removeClass('active');
      let $oldContent = this.$content; // Update the variables with the new link and content

      this.$activeTabLink = tabLink;
      this.$content = $(M.escapeHash(tabLink[0].hash));
      this.$tabLinks = this.$el.children('li.tab').children('a'); // Make the tab active.

      this.$activeTabLink.addClass('active');
      let prevIndex = this.index;
      this.index = Math.max(this.$tabLinks.index(tabLink), 0); // Swap content

      if (this.options.swipeable) {
        if (this._tabsCarousel) {
          this._tabsCarousel.set(this.index, () => {
            if (typeof this.options.onShow === 'function') {
              this.options.onShow.call(this, this.$content[0]);
            }
          });
        }
      } else {
        if (this.$content.length) {
          this.$content[0].style.display = 'block';
          this.$content.addClass('active');

          if (typeof this.options.onShow === 'function') {
            this.options.onShow.call(this, this.$content[0]);
          }

          if ($oldContent.length && !$oldContent.is(this.$content)) {
            $oldContent[0].style.display = 'none';
            $oldContent.removeClass('active');
          }
        }
      } // Update widths after content is swapped (scrollbar bugfix)


      this._setTabsAndTabWidth(); // Update indicator


      this._animateIndicator(prevIndex); // Prevent the anchor's default click action


      e.preventDefault();
    }
    /**
     * Generate elements for tab indicator.
     */


    _createIndicator() {
      let indicator = document.createElement('li');
      indicator.classList.add('indicator');
      this.el.appendChild(indicator);
      this._indicator = indicator;
      setTimeout(() => {
        this._indicator.style.left = this._calcLeftPos(this.$activeTabLink) + 'px';
        this._indicator.style.right = this._calcRightPos(this.$activeTabLink) + 'px';
      }, 0);
    }
    /**
     * Setup first active tab link.
     */


    _setupActiveTabLink() {
      // If the location.hash matches one of the links, use that as the active tab.
      this.$activeTabLink = $(this.$tabLinks.filter('[href="' + location.hash + '"]')); // If no match is found, use the first link or any with class 'active' as the initial active tab.

      if (this.$activeTabLink.length === 0) {
        this.$activeTabLink = this.$el.children('li.tab').children('a.active').first();
      }

      if (this.$activeTabLink.length === 0) {
        this.$activeTabLink = this.$el.children('li.tab').children('a').first();
      }

      this.$tabLinks.removeClass('active');
      this.$activeTabLink[0].classList.add('active');
      this.index = Math.max(this.$tabLinks.index(this.$activeTabLink), 0);

      if (this.$activeTabLink.length) {
        this.$content = $(M.escapeHash(this.$activeTabLink[0].hash));
        this.$content.addClass('active');
      }
    }
    /**
     * Setup swipeable tabs
     */


    _setupSwipeableTabs() {
      // Change swipeable according to responsive threshold
      if (window.innerWidth > this.options.responsiveThreshold) {
        this.options.swipeable = false;
      }

      let $tabsContent = $();
      this.$tabLinks.each(link => {
        let $currContent = $(M.escapeHash(link.hash));
        $currContent.addClass('carousel-item');
        $tabsContent = $tabsContent.add($currContent);
      });
      let $tabsWrapper = $('<div class="tabs-content carousel carousel-slider"></div>');
      $tabsContent.first().before($tabsWrapper);
      $tabsWrapper.append($tabsContent);
      $tabsContent[0].style.display = ''; // Keep active tab index to set initial carousel slide

      let activeTabIndex = this.$activeTabLink.closest('.tab').index();
      this._tabsCarousel = M.Carousel.init($tabsWrapper[0], {
        fullWidth: true,
        noWrap: true,
        onCycleTo: item => {
          let prevIndex = this.index;
          this.index = $(item).index();
          this.$activeTabLink.removeClass('active');
          this.$activeTabLink = this.$tabLinks.eq(this.index);
          this.$activeTabLink.addClass('active');

          this._animateIndicator(prevIndex);

          if (typeof this.options.onShow === 'function') {
            this.options.onShow.call(this, this.$content[0]);
          }
        }
      }); // Set initial carousel slide to active tab

      this._tabsCarousel.set(activeTabIndex);
    }
    /**
     * Teardown normal tabs.
     */


    _teardownSwipeableTabs() {
      let $tabsWrapper = this._tabsCarousel.$el;

      this._tabsCarousel.destroy(); // Unwrap


      $tabsWrapper.after($tabsWrapper.children());
      $tabsWrapper.remove();
    }
    /**
     * Setup normal tabs.
     */


    _setupNormalTabs() {
      // Hide Tabs Content
      this.$tabLinks.not(this.$activeTabLink).each(link => {
        if (!!link.hash) {
          let $currContent = $(M.escapeHash(link.hash));

          if ($currContent.length) {
            $currContent[0].style.display = 'none';
          }
        }
      });
    }
    /**
     * Teardown normal tabs.
     */


    _teardownNormalTabs() {
      // show Tabs Content
      this.$tabLinks.each(link => {
        if (!!link.hash) {
          let $currContent = $(M.escapeHash(link.hash));

          if ($currContent.length) {
            $currContent[0].style.display = '';
          }
        }
      });
    }
    /**
     * set tabs and tab width
     */


    _setTabsAndTabWidth() {
      this.tabsWidth = this.$el.width();
      this.tabWidth = Math.max(this.tabsWidth, this.el.scrollWidth) / this.$tabLinks.length;
    }
    /**
     * Finds right attribute for indicator based on active tab.
     * @param {cash} el
     */


    _calcRightPos(el) {
      return Math.ceil(this.tabsWidth - el.position().left - el[0].getBoundingClientRect().width);
    }
    /**
     * Finds left attribute for indicator based on active tab.
     * @param {cash} el
     */


    _calcLeftPos(el) {
      return Math.floor(el.position().left);
    }

    updateTabIndicator() {
      this._setTabsAndTabWidth();

      this._animateIndicator(this.index);
    }
    /**
     * Animates Indicator to active tab.
     * @param {Number} prevIndex
     */


    _animateIndicator(prevIndex) {
      let leftDelay = 0,
          rightDelay = 0;

      if (this.index - prevIndex >= 0) {
        leftDelay = 90;
      } else {
        rightDelay = 90;
      } // Animate


      let animOptions = {
        targets: this._indicator,
        left: {
          value: this._calcLeftPos(this.$activeTabLink),
          delay: leftDelay
        },
        right: {
          value: this._calcRightPos(this.$activeTabLink),
          delay: rightDelay
        },
        duration: this.options.duration,
        easing: 'easeOutQuad'
      };
      anim.remove(this._indicator);
      anim(animOptions);
    }
    /**
     * Select tab.
     * @param {String} tabId
     */


    select(tabId) {
      let tab = this.$tabLinks.filter('[href="#' + tabId + '"]');

      if (tab.length) {
        tab.trigger('click');
      }
    }

  }

  window.M.Tabs = Tabs;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Tabs, 'tabs', 'M_Tabs');
  }
})(cash, M.anime);
},{"./component":"../node_modules/materialize-css/js/component.js"}],"../node_modules/materialize-css/js/collapsible.js":[function(require,module,exports) {
"use strict";

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($, anim) {
  'use strict';

  let _defaults = {
    accordion: true,
    onOpenStart: undefined,
    onOpenEnd: undefined,
    onCloseStart: undefined,
    onCloseEnd: undefined,
    inDuration: 300,
    outDuration: 300
  };
  /**
   * @class
   *
   */

  class Collapsible extends _component.default {
    /**
     * Construct Collapsible instance
     * @constructor
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options) {
      super(Collapsible, el, options);
      this.el.M_Collapsible = this;
      /**
       * Options for the collapsible
       * @member Collapsible#options
       * @prop {Boolean} [accordion=false] - Type of the collapsible
       * @prop {Function} onOpenStart - Callback function called before collapsible is opened
       * @prop {Function} onOpenEnd - Callback function called after collapsible is opened
       * @prop {Function} onCloseStart - Callback function called before collapsible is closed
       * @prop {Function} onCloseEnd - Callback function called after collapsible is closed
       * @prop {Number} inDuration - Transition in duration in milliseconds.
       * @prop {Number} outDuration - Transition duration in milliseconds.
       */

      this.options = $.extend({}, Collapsible.defaults, options); // Setup tab indices

      this.$headers = this.$el.children('li').children('.collapsible-header');
      this.$headers.attr('tabindex', 0);

      this._setupEventHandlers(); // Open first active


      let $activeBodies = this.$el.children('li.active').children('.collapsible-body');

      if (this.options.accordion) {
        // Handle Accordion
        $activeBodies.first().css('display', 'block');
      } else {
        // Handle Expandables
        $activeBodies.css('display', 'block');
      }
    }

    static get defaults() {
      return _defaults;
    }

    static init(els, options) {
      return super.init(this, els, options);
    }
    /**
     * Get Instance
     */


    static getInstance(el) {
      let domElem = !!el.jquery ? el[0] : el;
      return domElem.M_Collapsible;
    }
    /**
     * Teardown component
     */


    destroy() {
      this._removeEventHandlers();

      this.el.M_Collapsible = undefined;
    }
    /**
     * Setup Event Handlers
     */


    _setupEventHandlers() {
      this._handleCollapsibleClickBound = this._handleCollapsibleClick.bind(this);
      this._handleCollapsibleKeydownBound = this._handleCollapsibleKeydown.bind(this);
      this.el.addEventListener('click', this._handleCollapsibleClickBound);
      this.$headers.each(header => {
        header.addEventListener('keydown', this._handleCollapsibleKeydownBound);
      });
    }
    /**
     * Remove Event Handlers
     */


    _removeEventHandlers() {
      this.el.removeEventListener('click', this._handleCollapsibleClickBound);
      this.$headers.each(header => {
        header.removeEventListener('keydown', this._handleCollapsibleKeydownBound);
      });
    }
    /**
     * Handle Collapsible Click
     * @param {Event} e
     */


    _handleCollapsibleClick(e) {
      let $header = $(e.target).closest('.collapsible-header');

      if (e.target && $header.length) {
        let $collapsible = $header.closest('.collapsible');

        if ($collapsible[0] === this.el) {
          let $collapsibleLi = $header.closest('li');
          let $collapsibleLis = $collapsible.children('li');
          let isActive = $collapsibleLi[0].classList.contains('active');
          let index = $collapsibleLis.index($collapsibleLi);

          if (isActive) {
            this.close(index);
          } else {
            this.open(index);
          }
        }
      }
    }
    /**
     * Handle Collapsible Keydown
     * @param {Event} e
     */


    _handleCollapsibleKeydown(e) {
      if (e.keyCode === 13) {
        this._handleCollapsibleClickBound(e);
      }
    }
    /**
     * Animate in collapsible slide
     * @param {Number} index - 0th index of slide
     */


    _animateIn(index) {
      let $collapsibleLi = this.$el.children('li').eq(index);

      if ($collapsibleLi.length) {
        let $body = $collapsibleLi.children('.collapsible-body');
        anim.remove($body[0]);
        $body.css({
          display: 'block',
          overflow: 'hidden',
          height: 0,
          paddingTop: '',
          paddingBottom: ''
        });
        let pTop = $body.css('padding-top');
        let pBottom = $body.css('padding-bottom');
        let finalHeight = $body[0].scrollHeight;
        $body.css({
          paddingTop: 0,
          paddingBottom: 0
        });
        anim({
          targets: $body[0],
          height: finalHeight,
          paddingTop: pTop,
          paddingBottom: pBottom,
          duration: this.options.inDuration,
          easing: 'easeInOutCubic',
          complete: anim => {
            $body.css({
              overflow: '',
              paddingTop: '',
              paddingBottom: '',
              height: ''
            }); // onOpenEnd callback

            if (typeof this.options.onOpenEnd === 'function') {
              this.options.onOpenEnd.call(this, $collapsibleLi[0]);
            }
          }
        });
      }
    }
    /**
     * Animate out collapsible slide
     * @param {Number} index - 0th index of slide to open
     */


    _animateOut(index) {
      let $collapsibleLi = this.$el.children('li').eq(index);

      if ($collapsibleLi.length) {
        let $body = $collapsibleLi.children('.collapsible-body');
        anim.remove($body[0]);
        $body.css('overflow', 'hidden');
        anim({
          targets: $body[0],
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          duration: this.options.outDuration,
          easing: 'easeInOutCubic',
          complete: () => {
            $body.css({
              height: '',
              overflow: '',
              padding: '',
              display: ''
            }); // onCloseEnd callback

            if (typeof this.options.onCloseEnd === 'function') {
              this.options.onCloseEnd.call(this, $collapsibleLi[0]);
            }
          }
        });
      }
    }
    /**
     * Open Collapsible
     * @param {Number} index - 0th index of slide
     */


    open(index) {
      let $collapsibleLi = this.$el.children('li').eq(index);

      if ($collapsibleLi.length && !$collapsibleLi[0].classList.contains('active')) {
        // onOpenStart callback
        if (typeof this.options.onOpenStart === 'function') {
          this.options.onOpenStart.call(this, $collapsibleLi[0]);
        } // Handle accordion behavior


        if (this.options.accordion) {
          let $collapsibleLis = this.$el.children('li');
          let $activeLis = this.$el.children('li.active');
          $activeLis.each(el => {
            let index = $collapsibleLis.index($(el));
            this.close(index);
          });
        } // Animate in


        $collapsibleLi[0].classList.add('active');

        this._animateIn(index);
      }
    }
    /**
     * Close Collapsible
     * @param {Number} index - 0th index of slide
     */


    close(index) {
      let $collapsibleLi = this.$el.children('li').eq(index);

      if ($collapsibleLi.length && $collapsibleLi[0].classList.contains('active')) {
        // onCloseStart callback
        if (typeof this.options.onCloseStart === 'function') {
          this.options.onCloseStart.call(this, $collapsibleLi[0]);
        } // Animate out


        $collapsibleLi[0].classList.remove('active');

        this._animateOut(index);
      }
    }

  }

  M.Collapsible = Collapsible;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Collapsible, 'collapsible', 'M_Collapsible');
  }
})(cash, M.anime);
},{"./component":"../node_modules/materialize-css/js/component.js"}],"app/vendor/materialize-config.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var collapsibleIcons = _toConsumableArray(document.querySelectorAll('.collapsible-icons'));

var index;
M.Tabs.init(document.querySelectorAll('.tabs'), {
  swipeable: false
}); // console.log(collapsibleItems);

M.Collapsible.init(document.getElementById('collapsible'), {
  onOpenStart: getItem,
  onCloseStart: function onCloseStart() {
    return transformArrow(index);
  }
});

function getItem() {
  // IMPORTANT: Se coloca toda la funcion dentro de un setTimeout() para dar chance a que se coloque la clase "active"
  setTimeout(function () {
    // Collapsible Instance
    var collapsibleItems = _toConsumableArray(document.querySelectorAll('ul.collapsible li'));

    var i = 0;

    var _iterator = _createForOfIteratorHelper(collapsibleItems),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var el = _step.value;

        if (el.classList.contains("active")) {
          index = i;
        }

        i++;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    transformArrow(index);
  }, 0);
}

function transformArrow(i) {
  collapsibleIcons[i].classList.toggle('transform-arrow');
}
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"app/vendor/v-grid.min.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"app/vendor/fontello/css/facebook.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./..\\font\\facebook.woff2":[["facebook.5a9ee458.woff2","app/vendor/fontello/font/facebook.woff2"],"app/vendor/fontello/font/facebook.woff2"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"app/scss/main.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"../vendor/v-grid.min.css":"app/vendor/v-grid.min.css","../vendor/fontello/css/facebook.css":"app/vendor/fontello/css/facebook.css","_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"app/vendor/aos/aos.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"app/vendor/hamburger-config.js":[function(require,module,exports) {
// Look for .hamburger
var hamburger = document.getElementById("iconHamburger"),
    menu = document.getElementById('menu'),
    body = document.getElementById('body'),
    links = document.querySelectorAll('.nav__link'); // On click

hamburger.addEventListener("click", function () {
  // Toggle class "is-active"
  hamburger.classList.toggle("is-active");
  body.classList.toggle("no-scroll");
  menu.classList.toggle("open");
});
links.forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove("is-active");
    body.classList.remove("no-scroll");
    menu.classList.remove("open");
  });
});
},{}],"app/js/app.js":[function(require,module,exports) {

},{}],"app/vendor/aos/aos.js":[function(require,module,exports) {
var define;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (e, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.AOS = t() : e.AOS = t();
}(this, function () {
  return function (e) {
    function t(o) {
      if (n[o]) return n[o].exports;
      var i = n[o] = {
        exports: {},
        id: o,
        loaded: !1
      };
      return e[o].call(i.exports, i, i.exports, t), i.loaded = !0, i.exports;
    }

    var n = {};
    return t.m = e, t.c = n, t.p = "dist/", t(0);
  }([function (e, t, n) {
    "use strict";

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    var i = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];

        for (var o in n) {
          Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
        }
      }

      return e;
    },
        r = n(1),
        a = (o(r), n(6)),
        u = o(a),
        c = n(7),
        f = o(c),
        s = n(8),
        d = o(s),
        l = n(9),
        p = o(l),
        m = n(10),
        b = o(m),
        v = n(11),
        y = o(v),
        g = n(14),
        h = o(g),
        w = [],
        k = !1,
        x = {
      offset: 120,
      delay: 0,
      easing: "ease",
      duration: 400,
      disable: !1,
      once: !1,
      startEvent: "DOMContentLoaded",
      throttleDelay: 99,
      debounceDelay: 50,
      disableMutationObserver: !1
    },
        j = function j() {
      var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if (e && (k = !0), k) return w = (0, y.default)(w, x), (0, b.default)(w, x.once), w;
    },
        O = function O() {
      w = (0, h.default)(), j();
    },
        _ = function _() {
      w.forEach(function (e, t) {
        e.node.removeAttribute("data-aos"), e.node.removeAttribute("data-aos-easing"), e.node.removeAttribute("data-aos-duration"), e.node.removeAttribute("data-aos-delay");
      });
    },
        S = function S(e) {
      return e === !0 || "mobile" === e && p.default.mobile() || "phone" === e && p.default.phone() || "tablet" === e && p.default.tablet() || "function" == typeof e && e() === !0;
    },
        z = function z(e) {
      x = i(x, e), w = (0, h.default)();
      var t = document.all && !window.atob;
      return S(x.disable) || t ? _() : (document.querySelector("body").setAttribute("data-aos-easing", x.easing), document.querySelector("body").setAttribute("data-aos-duration", x.duration), document.querySelector("body").setAttribute("data-aos-delay", x.delay), "DOMContentLoaded" === x.startEvent && ["complete", "interactive"].indexOf(document.readyState) > -1 ? j(!0) : "load" === x.startEvent ? window.addEventListener(x.startEvent, function () {
        j(!0);
      }) : document.addEventListener(x.startEvent, function () {
        j(!0);
      }), window.addEventListener("resize", (0, f.default)(j, x.debounceDelay, !0)), window.addEventListener("orientationchange", (0, f.default)(j, x.debounceDelay, !0)), window.addEventListener("scroll", (0, u.default)(function () {
        (0, b.default)(w, x.once);
      }, x.throttleDelay)), x.disableMutationObserver || (0, d.default)("[data-aos]", O), w);
    };

    e.exports = {
      init: z,
      refresh: j,
      refreshHard: O
    };
  }, function (e, t) {},,,,, function (e, t) {
    (function (t) {
      "use strict";

      function n(e, t, n) {
        function o(t) {
          var n = b,
              o = v;
          return b = v = void 0, k = t, g = e.apply(o, n);
        }

        function r(e) {
          return k = e, h = setTimeout(s, t), _ ? o(e) : g;
        }

        function a(e) {
          var n = e - w,
              o = e - k,
              i = t - n;
          return S ? j(i, y - o) : i;
        }

        function c(e) {
          var n = e - w,
              o = e - k;
          return void 0 === w || n >= t || n < 0 || S && o >= y;
        }

        function s() {
          var e = O();
          return c(e) ? d(e) : void (h = setTimeout(s, a(e)));
        }

        function d(e) {
          return h = void 0, z && b ? o(e) : (b = v = void 0, g);
        }

        function l() {
          void 0 !== h && clearTimeout(h), k = 0, b = w = v = h = void 0;
        }

        function p() {
          return void 0 === h ? g : d(O());
        }

        function m() {
          var e = O(),
              n = c(e);

          if (b = arguments, v = this, w = e, n) {
            if (void 0 === h) return r(w);
            if (S) return h = setTimeout(s, t), o(w);
          }

          return void 0 === h && (h = setTimeout(s, t)), g;
        }

        var b,
            v,
            y,
            g,
            h,
            w,
            k = 0,
            _ = !1,
            S = !1,
            z = !0;

        if ("function" != typeof e) throw new TypeError(f);
        return t = u(t) || 0, i(n) && (_ = !!n.leading, S = "maxWait" in n, y = S ? x(u(n.maxWait) || 0, t) : y, z = "trailing" in n ? !!n.trailing : z), m.cancel = l, m.flush = p, m;
      }

      function o(e, t, o) {
        var r = !0,
            a = !0;
        if ("function" != typeof e) throw new TypeError(f);
        return i(o) && (r = "leading" in o ? !!o.leading : r, a = "trailing" in o ? !!o.trailing : a), n(e, t, {
          leading: r,
          maxWait: t,
          trailing: a
        });
      }

      function i(e) {
        var t = "undefined" == typeof e ? "undefined" : c(e);
        return !!e && ("object" == t || "function" == t);
      }

      function r(e) {
        return !!e && "object" == ("undefined" == typeof e ? "undefined" : c(e));
      }

      function a(e) {
        return "symbol" == ("undefined" == typeof e ? "undefined" : c(e)) || r(e) && k.call(e) == d;
      }

      function u(e) {
        if ("number" == typeof e) return e;
        if (a(e)) return s;

        if (i(e)) {
          var t = "function" == typeof e.valueOf ? e.valueOf() : e;
          e = i(t) ? t + "" : t;
        }

        if ("string" != typeof e) return 0 === e ? e : +e;
        e = e.replace(l, "");
        var n = m.test(e);
        return n || b.test(e) ? v(e.slice(2), n ? 2 : 8) : p.test(e) ? s : +e;
      }

      var c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
      },
          f = "Expected a function",
          s = NaN,
          d = "[object Symbol]",
          l = /^\s+|\s+$/g,
          p = /^[-+]0x[0-9a-f]+$/i,
          m = /^0b[01]+$/i,
          b = /^0o[0-7]+$/i,
          v = parseInt,
          y = "object" == ("undefined" == typeof t ? "undefined" : c(t)) && t && t.Object === Object && t,
          g = "object" == ("undefined" == typeof self ? "undefined" : c(self)) && self && self.Object === Object && self,
          h = y || g || Function("return this")(),
          w = Object.prototype,
          k = w.toString,
          x = Math.max,
          j = Math.min,
          O = function O() {
        return h.Date.now();
      };

      e.exports = o;
    }).call(t, function () {
      return this;
    }());
  }, function (e, t) {
    (function (t) {
      "use strict";

      function n(e, t, n) {
        function i(t) {
          var n = b,
              o = v;
          return b = v = void 0, O = t, g = e.apply(o, n);
        }

        function r(e) {
          return O = e, h = setTimeout(s, t), _ ? i(e) : g;
        }

        function u(e) {
          var n = e - w,
              o = e - O,
              i = t - n;
          return S ? x(i, y - o) : i;
        }

        function f(e) {
          var n = e - w,
              o = e - O;
          return void 0 === w || n >= t || n < 0 || S && o >= y;
        }

        function s() {
          var e = j();
          return f(e) ? d(e) : void (h = setTimeout(s, u(e)));
        }

        function d(e) {
          return h = void 0, z && b ? i(e) : (b = v = void 0, g);
        }

        function l() {
          void 0 !== h && clearTimeout(h), O = 0, b = w = v = h = void 0;
        }

        function p() {
          return void 0 === h ? g : d(j());
        }

        function m() {
          var e = j(),
              n = f(e);

          if (b = arguments, v = this, w = e, n) {
            if (void 0 === h) return r(w);
            if (S) return h = setTimeout(s, t), i(w);
          }

          return void 0 === h && (h = setTimeout(s, t)), g;
        }

        var b,
            v,
            y,
            g,
            h,
            w,
            O = 0,
            _ = !1,
            S = !1,
            z = !0;

        if ("function" != typeof e) throw new TypeError(c);
        return t = a(t) || 0, o(n) && (_ = !!n.leading, S = "maxWait" in n, y = S ? k(a(n.maxWait) || 0, t) : y, z = "trailing" in n ? !!n.trailing : z), m.cancel = l, m.flush = p, m;
      }

      function o(e) {
        var t = "undefined" == typeof e ? "undefined" : u(e);
        return !!e && ("object" == t || "function" == t);
      }

      function i(e) {
        return !!e && "object" == ("undefined" == typeof e ? "undefined" : u(e));
      }

      function r(e) {
        return "symbol" == ("undefined" == typeof e ? "undefined" : u(e)) || i(e) && w.call(e) == s;
      }

      function a(e) {
        if ("number" == typeof e) return e;
        if (r(e)) return f;

        if (o(e)) {
          var t = "function" == typeof e.valueOf ? e.valueOf() : e;
          e = o(t) ? t + "" : t;
        }

        if ("string" != typeof e) return 0 === e ? e : +e;
        e = e.replace(d, "");
        var n = p.test(e);
        return n || m.test(e) ? b(e.slice(2), n ? 2 : 8) : l.test(e) ? f : +e;
      }

      var u = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
      },
          c = "Expected a function",
          f = NaN,
          s = "[object Symbol]",
          d = /^\s+|\s+$/g,
          l = /^[-+]0x[0-9a-f]+$/i,
          p = /^0b[01]+$/i,
          m = /^0o[0-7]+$/i,
          b = parseInt,
          v = "object" == ("undefined" == typeof t ? "undefined" : u(t)) && t && t.Object === Object && t,
          y = "object" == ("undefined" == typeof self ? "undefined" : u(self)) && self && self.Object === Object && self,
          g = v || y || Function("return this")(),
          h = Object.prototype,
          w = h.toString,
          k = Math.max,
          x = Math.min,
          j = function j() {
        return g.Date.now();
      };

      e.exports = n;
    }).call(t, function () {
      return this;
    }());
  }, function (e, t) {
    "use strict";

    function n(e, t) {
      var n = window.document,
          r = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
          a = new r(o);
      i = t, a.observe(n.documentElement, {
        childList: !0,
        subtree: !0,
        removedNodes: !0
      });
    }

    function o(e) {
      e && e.forEach(function (e) {
        var t = Array.prototype.slice.call(e.addedNodes),
            n = Array.prototype.slice.call(e.removedNodes),
            o = t.concat(n).filter(function (e) {
          return e.hasAttribute && e.hasAttribute("data-aos");
        }).length;
        o && i();
      });
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var i = function i() {};

    t.default = n;
  }, function (e, t) {
    "use strict";

    function n(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    function o() {
      return navigator.userAgent || navigator.vendor || window.opera || "";
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var i = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var o = t[n];
          o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
        }
      }

      return function (t, n, o) {
        return n && e(t.prototype, n), o && e(t, o), t;
      };
    }(),
        r = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
        a = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        u = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,
        c = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        f = function () {
      function e() {
        n(this, e);
      }

      return i(e, [{
        key: "phone",
        value: function value() {
          var e = o();
          return !(!r.test(e) && !a.test(e.substr(0, 4)));
        }
      }, {
        key: "mobile",
        value: function value() {
          var e = o();
          return !(!u.test(e) && !c.test(e.substr(0, 4)));
        }
      }, {
        key: "tablet",
        value: function value() {
          return this.mobile() && !this.phone();
        }
      }]), e;
    }();

    t.default = new f();
  }, function (e, t) {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var n = function n(e, t, _n) {
      var o = e.node.getAttribute("data-aos-once");
      t > e.position ? e.node.classList.add("aos-animate") : "undefined" != typeof o && ("false" === o || !_n && "true" !== o) && e.node.classList.remove("aos-animate");
    },
        o = function o(e, t) {
      var o = window.pageYOffset,
          i = window.innerHeight;
      e.forEach(function (e, r) {
        n(e, i + o, t);
      });
    };

    t.default = o;
  }, function (e, t, n) {
    "use strict";

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var i = n(12),
        r = o(i),
        a = function a(e, t) {
      return e.forEach(function (e, n) {
        e.node.classList.add("aos-init"), e.position = (0, r.default)(e.node, t.offset);
      }), e;
    };

    t.default = a;
  }, function (e, t, n) {
    "use strict";

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var i = n(13),
        r = o(i),
        a = function a(e, t) {
      var n = 0,
          o = 0,
          i = window.innerHeight,
          a = {
        offset: e.getAttribute("data-aos-offset"),
        anchor: e.getAttribute("data-aos-anchor"),
        anchorPlacement: e.getAttribute("data-aos-anchor-placement")
      };

      switch (a.offset && !isNaN(a.offset) && (o = parseInt(a.offset)), a.anchor && document.querySelectorAll(a.anchor) && (e = document.querySelectorAll(a.anchor)[0]), n = (0, r.default)(e).top, a.anchorPlacement) {
        case "top-bottom":
          break;

        case "center-bottom":
          n += e.offsetHeight / 2;
          break;

        case "bottom-bottom":
          n += e.offsetHeight;
          break;

        case "top-center":
          n += i / 2;
          break;

        case "bottom-center":
          n += i / 2 + e.offsetHeight;
          break;

        case "center-center":
          n += i / 2 + e.offsetHeight / 2;
          break;

        case "top-top":
          n += i;
          break;

        case "bottom-top":
          n += e.offsetHeight + i;
          break;

        case "center-top":
          n += e.offsetHeight / 2 + i;
      }

      return a.anchorPlacement || a.offset || isNaN(t) || (o = t), n + o;
    };

    t.default = a;
  }, function (e, t) {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var n = function n(e) {
      for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop);) {
        t += e.offsetLeft - ("BODY" != e.tagName ? e.scrollLeft : 0), n += e.offsetTop - ("BODY" != e.tagName ? e.scrollTop : 0), e = e.offsetParent;
      }

      return {
        top: n,
        left: t
      };
    };

    t.default = n;
  }, function (e, t) {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var n = function n(e) {
      return e = e || document.querySelectorAll("[data-aos]"), Array.prototype.map.call(e, function (e) {
        return {
          node: e
        };
      });
    };

    t.default = n;
  }]);
});
},{}],"app/vendor/aos-config.js":[function(require,module,exports) {
"use strict";

var AOS = _interopRequireWildcard(require("./aos/aos"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

AOS.init({
  once: false
});
},{"./aos/aos":"app/vendor/aos/aos.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("../node_modules/materialize-css/js/cash");

require("../node_modules/materialize-css/js/global");

require("../node_modules/materialize-css/js/anime.min");

require("../node_modules/materialize-css/js/tabs");

require("../node_modules/materialize-css/js/collapsible");

require("./app/vendor/materialize-config");

require("./app/scss/main.scss");

require("./app/vendor/aos/aos.css");

require("./app/vendor/hamburger-config");

require("./app/js/app");

require("./app/vendor/aos-config");
},{"../node_modules/materialize-css/js/cash":"../node_modules/materialize-css/js/cash.js","../node_modules/materialize-css/js/global":"../node_modules/materialize-css/js/global.js","../node_modules/materialize-css/js/anime.min":"../node_modules/materialize-css/js/anime.min.js","../node_modules/materialize-css/js/tabs":"../node_modules/materialize-css/js/tabs.js","../node_modules/materialize-css/js/collapsible":"../node_modules/materialize-css/js/collapsible.js","./app/vendor/materialize-config":"app/vendor/materialize-config.js","./app/scss/main.scss":"app/scss/main.scss","./app/vendor/aos/aos.css":"app/vendor/aos/aos.css","./app/vendor/hamburger-config":"app/vendor/hamburger-config.js","./app/js/app":"app/js/app.js","./app/vendor/aos-config":"app/vendor/aos-config.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54116" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map