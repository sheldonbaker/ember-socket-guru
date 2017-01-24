import { Socket } from 'phoenix';
import Ember from 'ember';
import fetchEvents from 'ember-socket-guru/util/fetch-events';

const { get, set, setProperties, assert, run } = Ember;

export default Ember.Object.extend({
  Socket,
  joinedChannels: {},

  setup(config, eventHandler) {
    this._checkConfig(config);
    const SocketService = get(this, 'Socket');
    const socket = new SocketService(get(config, 'host'));
    socket.connect();
    setProperties(this, { socket, eventHandler });
  },

  subscribe(observedChannels) {
    observedChannels.forEach((singleChannel) => {
      const channelName = Object.keys(singleChannel)[0];
      const channel = get(this, 'socket').channel(channelName);
      const joinedChannels = get(this, 'joinedChannels');
      channel.join();
      set(this, 'joinedChannels', Object.assign({}, joinedChannels, {
        [channelName]: channel,
      }));
      this._attachEventsToChannel(channel, channelName, observedChannels);
    });
  },

  disconnect() {
    get(this, 'socket').disconnect();
  },

  unsubscribeChannels(channelsToUnsubscribe) {
    channelsToUnsubscribe
      .map(channel => Object.keys(channel)[0])
      .forEach(channel => get(this, `joinedChannels.${channel}`).leave());
  },

  _checkConfig(config) {
    assert(
      '[ember-sockets-guru] You need to provide host in the socket-guru service',
      !!get(config, 'host')
    );
  },

  _attachEventsToChannel(channel, channelName, data) {
    fetchEvents(data, channelName)
      .forEach((event) => this._setEvent(channel, event));
  },

  _setEvent(channel, event) {
    channel.on(event, (data) => {
      run(() => get(this, 'eventHandler')(event, data));
    });
  },
});
