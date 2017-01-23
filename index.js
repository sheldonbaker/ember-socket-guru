/* eslint-disable */
'use strict';
var BabelTranspiler = require('broccoli-babel-transpiler');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-socket-guru',

  treeForAddon: function() {
    var addonTree = this._super.treeForAddon.apply(this, arguments);
    var transpiled = new BabelTranspiler('vendor', {
      loose: true,
      blacklist: ['es6.modules']
    });
    var phoenixVendor = new Funnel(transpiled, {
      destDir: 'modules'
    });

    return new MergeTrees([addonTree, phoenixVendor]);
  }
};
