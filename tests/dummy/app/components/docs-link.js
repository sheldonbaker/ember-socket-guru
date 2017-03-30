import Ember from 'ember';

const { Component, get, set } = Ember;

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);

    set(this, 'isSelected',
      get(this, 'route') === get(this, 'label').toLowerCase());

    set(this, 'linkClass',
      get(this, 'isSelected') ?
        'links-pane__link links-pane__link--selected' :
        'links-pane__link'
    );
  },
});
