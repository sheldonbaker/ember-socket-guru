module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    'ember-socket-guru': {
      includeOnly: ['pusher'],
    },
  });
};
