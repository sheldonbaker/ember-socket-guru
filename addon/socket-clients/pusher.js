import Ember from 'ember';
import fetchEvents from 'ember-socket-guru/util/fetch-events';

const { get, set, setProperties, $, run, assert } = Ember;
const pusherService = Pusher;

export default Ember.Object.extend({
  pusherService,
  socketId: null,
  socket: null,
  eventHandler: null,

  setup(pusherKey, config, eventHandler) {
    const PusherService = get(this, 'pusherService');
    this._checkConfig(pusherKey, config);
    setProperties(this, {
      eventHandler,
      socket: new PusherService(pusherKey, config),
    });

    get(this, 'socket').connection
      .bind('connected', () => this._handleConnected());
  },

  subscribe(observedChannels) {
    observedChannels.forEach((singleChannel) => {
      const channelName = Object.keys(singleChannel)[0];
      const channel = get(this, 'socket').subscribe(channelName);
      this._attachEventsToChannel(channel, channelName, observedChannels);
    });
  },

  unsubscribeChannels(observedChannels) {
    observedChannels
      .map(channel => Object.keys(channel)[0])
      .forEach(channel => get(this, 'socket').unsubscribe(channel));
  },

  disconnect() {
    if (get(this, 'socket.disconnect')) {
      get(this, 'socket').disconnect();
    }
  },

  _handleConnected() {
    const socketId = get(this, 'socket').connection.socket_id;
    set(this, 'socketId', socketId);
    $.ajaxPrefilter((options, originalOptions, xhr) => {
      return xhr.setRequestHeader('X-Pusher-Socket', socketId);
    });
  },

  _attachEventsToChannel(channel, channelName, data) {
    fetchEvents(data, channelName)
      .forEach((event) => this._setEvent(channel, event));
  },

  _setEvent(channel, event) {
    channel.bind(event, (data) => {
      run(() => get(this, 'eventHandler')(event, data));
    });
  },

  _checkConfig(pusherKey) {
    assert(
      '[ember-sockets-guru] You need to provide pusher key in the socket-guru service',
      !!pusherKey
    );
    assert(
      '[ember-sockets-guru] You need to include the pusher library',
      !!window.Pusher
    );
  },
});
