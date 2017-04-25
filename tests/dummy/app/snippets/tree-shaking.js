module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'ember-socket-guru': {
      includeOnly: ['pusher'],
    },
  });
}
