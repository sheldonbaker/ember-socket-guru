import Ember from 'ember';

const { Route, get } = Ember;

export default Route.extend({
  model(params, model) {
    return {
      routeName: get(this, 'routeName').split('.')[1].replace(/-/g, ' '),
      technology: model.resolvedModels.technology,
    };
  },
});
