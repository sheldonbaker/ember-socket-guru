import { Socket } from 'phoenix';
import Ember from 'ember';

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
    Object.keys(observedChannels).forEach((channelName) => {
      const channel = get(this, 'socket').channel(channelName);
      const joinedChannels = get(this, 'joinedChannels');
      channel.join();
      set(this, 'joinedChannels', Object.assign({}, joinedChannels, {
        [channelName]: channel,
      }));
      this._attachEventsToChannel(channel, channelName, observedChannels[channelName]);
    });
  },

  disconnect() {
    get(this, 'socket').disconnect();
  },

  unsubscribeChannels(channelsToUnsubscribe) {
    Object.keys(channelsToUnsubscribe)
      .forEach(channel => get(this, `joinedChannels.${channel}`).leave());
  },

  _checkConfig(config) {
    assert(
      '[ember-sockets-guru] You need to provide host in the socket-guru service',
      !!get(config, 'host')
    );
  },

  _attachEventsToChannel(channel, channelName, events) {
    events.forEach((event) => {
      channel.on(event, (data) => {
        run(() => get(this, 'eventHandler')(event, data));
      });
    });
  },
});
