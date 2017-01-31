import Ember from 'ember';

const { set, get, getProperties, assert, setProperties } = Ember;

export default Ember.Object.extend({
  actionCableService: ActionCable,
  actionCable: null,
  eventHandler: null,
  joinedChannels: null,

  setup(config, eventHandler) {
    assert(
      '[ember-sockets-guru] You need to provide url in config in the socket-guru service',
      !!get(config, 'url')
    );
    assert(
      '[ember-sockets-guru] You need to provide eventHandler in the socket-guru service',
      typeof eventHandler === 'function'
    );

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

  unsubscribeChannels(channels) {
    const joinedChannels = get(this, 'joinedChannels');

    channels.forEach((channel) => {
      const selectedChannel = joinedChannels[channel];

      if (selectedChannel) {
        const newJoinedChannels = Object.assign({}, joinedChannels);

        selectedChannel.unsubscribe();
        delete newJoinedChannels[channel];
        set(this, 'joinedChannels', newJoinedChannels);
      }
    });
  },

  disconnect() {
    get(this, 'actionCable').disconnect();
  },
});
