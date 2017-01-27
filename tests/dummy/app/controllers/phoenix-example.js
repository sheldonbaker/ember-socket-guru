/* eslint-disable netguru-ember/alias-model-in-controller */
import Ember from 'ember';
import SocketEventHandler from 'ember-socket-guru/mixins/socket-event-handler';

const { Controller, get, inject: { service } } = Ember;

export default Controller.extend(SocketEventHandler, {
  socketGuru: service('socket-guru-phoenix'),

  actions: {
    onButtonClick() {
      get(this, 'socketGuru').emit('event:lobby', 'button-clicked', {});
    },
  },

  onSocketAction(name, data) {
    console.log('socket action', name, data);
  },
});
