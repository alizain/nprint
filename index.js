(function exporter(root, factory) {

  'use strict';

  /* eslint-disable */

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    root.nPrint = factory();
  }

  /* eslint-enable */

}(this, function factory() {

  'use strict';

  function nPrint(hasher, getters, node) {
    var str = '';
    if (!hasher || typeof hasher !== 'function') {
      throw new Error('hasher required');
    }
    if (!getters || !Array.isArray(getters) || getters.length === 0) {
      throw new Error('array of getters required');
    }
    if (!(node instanceof Node) && !(node instanceof HTMLElement)) {
      throw new Error('node must be provided');
    }
    getters.forEach(function runGetter(f) {
      if (typeof f === 'function') {
        str += f(node);
      }
    });
    return hasher(str);
  }

  nPrint.hash = {

    basic: function basic(str) {
      // http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
      /* eslint-disable */
      if (Array.prototype.reduce) {
        return Math.abs(str.split('').reduce(function(a, b) {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a
        }, 0));
      }
      var hash = 0;
      if (str.length === 0) {
        return hash;
      }
      for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
      /* eslint-enable */
    }

  };

  nPrint.get = {

    text: function getText(node) {
      return node.textContent.trim();
    },

    ancestry: function getAncestry(node) {
      var str = '';
      if (node && node.nodeName) {
        str = node.nodeName;
        if (node.parentNode) {
          str += getAncestry(node.parentNode);
        }
      }
      return str;
    },

    nearestSiblingText: function getNearestSiblingText(node) {
      var prevText = node.prevElementSibling
        ? nPrint.get.text(node.prevElementSibling)
        : '';
      var nextText = node.nextElementSibling
        ? nPrint.get.text(node.nextElementSibling)
        : '';
      if (node.parentNode && prevText.length === 0 && nextText.length === 0) {
        return getNearestSiblingText(node.parentNode);
      }
      return prevText + nextText;
    }

  };

}));
