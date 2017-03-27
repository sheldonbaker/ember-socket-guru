import Ember from 'ember';

const { Route, get } = Ember;

export default Route.extend({
  model() {
    return get(this, 'routeName').split('.')[1].replace(/-/g, ' ');
  },
});
