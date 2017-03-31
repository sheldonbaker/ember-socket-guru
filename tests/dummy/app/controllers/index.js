import Ember from 'ember';

const { Controller, get, set, computed } = Ember;

export default Controller.extend({
  technologies: [{
    name: 'Phoenix Channels',
    img: 'phoenix-icon.png',
    position: 1,
    url: 'phoenix',
  }, {
    name: 'Socket.io',
    img: 'socket-io-icon.png',
    position: 2,
    url: 'socketio',
  }, {
    name: 'ActionCable',
    img: 'action-cable-icon.png',
    position: 3,
    url: 'action-cable',
  }, {
    name: 'Pusher',
    img: 'pusher-icon.png',
    position: 4,
    url: 'pusher',
  }],

  selectedTechnology: computed('technologies', function() {
    return get(this, 'technologies')[1];
  }),

  upperTechnologies: computed('selectedTechnology', function() {
    const selectedTechnology = get(this, 'selectedTechnology');

    return get(this, 'technologies').filter((technology) => {
      return technology.position < selectedTechnology.position;
    });
  }),

  lowerTechnologies: computed('selectedTechnology', function() {
    const selectedTechnology = get(this, 'selectedTechnology');

    return get(this, 'technologies').filter((technology) => {
      return technology.position > selectedTechnology.position;
    });
  }),

  actions: {
    selectTechnology(name) {
      const technology = get(this, 'technologies')
        .filter(item => item.name === name)[0];

      set(this, 'selectedTechnology', technology);
    },

    onGetStartedClick() {
      this.transitionToRoute(
        'technology.installation',
        get(this, 'selectedTechnology.url')
      );
    },
  },
});
