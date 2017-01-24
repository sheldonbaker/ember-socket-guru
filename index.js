/* eslint-env node */

const BabelTranspiler = require('broccoli-babel-transpiler');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-socket-guru',

  treeForAddon() {
    const addonTree = this._super.treeForAddon.apply(this, arguments);
    const transpiled = new BabelTranspiler('vendor', {
      loose: true,
      blacklist: ['es6.modules'],
    });
    const phoenixVendor = new Funnel(transpiled, {
      destDir: 'modules',
    });

    return new MergeTrees([addonTree, phoenixVendor]);
  },
};
