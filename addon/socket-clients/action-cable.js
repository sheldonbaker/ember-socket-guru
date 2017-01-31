import Ember from 'ember';

const { set, get, getProperties, assert, setProperties } = Ember;

export default Ember.Object.extend({
  actionCableService: ActionCable,
  actionCable: null,
  eventHandler: null,
  joinedChannels: null,

  setup(config, eventHandler = function() {}) {
    this._checkConfig(config);
    const url = get(config, 'url');
    const actionCable = get(this, 'actionCableService').createConsumer(url);
    setProperties(this, { actionCable, eventHandler, joinedChannels: {} });
  },

  subscribe(channels) {
    const { actionCable, eventHandler, joinedChannels }
      = getProperties(this, 'actionCable', 'eventHandler', 'joinedChannels');
    const newChannels = Object.assign({}, joinedChannels);

    channels.forEach((channel) => {
      newChannels[channel] = actionCable.subscriptions.create(channel, {
        initialized() {
          eventHandler('initialized');
        },
        connected() {
          eventHandler('connected');
        },
        rejected() {
          eventHandler('rejected');
        },
        received(data) {
          eventHandler('received', data);
        },
      });
    });

    set(this, 'joinedChannels', newChannels);
  },

  emit(channelName, data) {
    const joinedChannel = get(this, `joinedChannels.${channelName}`);
    if (joinedChannel) joinedChannel.send(data);
  },

  unsubscribeChannels() {
    const joinedChannels = get(this, 'joinedChannels');

    Object.keys(joinedChannels).forEach((channel) => {
      joinedChannels[channel].unsubscribe();
    });

    set(this, 'joinedChannels', {});
  },

  disconnect() {
    get(this, 'actionCable').disconnect();
  },

  _checkConfig(config) {
    assert(
      '[ember-sockets-guru] You need to provide url in the socket-guru service',
      !!get(config, 'url')
    );
  },
});
