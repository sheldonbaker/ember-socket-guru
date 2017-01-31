/* eslint-disable netguru-ember/alias-model-in-controller */
import Ember from 'ember';
import SocketEventHandler from 'ember-socket-guru/mixins/socket-event-handler';

const { get, Controller, inject: { service } } = Ember;

export default Controller.extend(SocketEventHandler, {
  socketGuru: service('socket-guru-socketio'),

  actions: {
    emitClickEvent() {
      get(this, 'socketGuru').emit('button-click', {});
    },

    addObservedChannels() {
      get(this, 'socketGuru').addObservedChannels(['event1']);
    },
  },

  onSocketAction(action, data) {
    console.log('socket action', action, data);
  },
});
