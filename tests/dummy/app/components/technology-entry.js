import Ember from 'ember';

const { Component, get } = Ember;

export default Component.extend({
  click() {
    get(this, 'onClick')(get(this, 'technology.name'));
  },
});
