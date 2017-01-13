import Ember from 'ember';
import socketClientLookup from 'ember-socket-guru/util/socket-client-lookup';
import { channelsDiff, removeChannel } from 'ember-socket-guru/util/channels-diff';

const {
  Service,
  get,
  set,
  getOwner,
  Evented,
  isArray,
} = Ember;

export default Service.extend(Evented, {
  socketClientLookup,

  /**
   * Configuration for given client
   *
   * After the actual socketClient is resolved this object is then passed into it
   * which allows additional configuration.
   * @param config
   * @type {Object}
   */
  config: null,

  /**
   * Socket client name, that will be used to resolve the actual socketClient.
   * @param socketClient
   * @type {String}
   */
  socketClient: null,

  /**
   * Socket client instance resolved using name.
   * @param client
   * @type {Object}
   */
  client: null,

  /**
   * Determines whether service should connect to client on startup.
   * @param autConnect
   * @type {Boolean}
   */
  autoConnect: true,

  /**
   * Array containing all channels and events.
   *
   * Array containing objects, where the key name is the channel name
   * and the value a list of observed events
   * @param observedChannels
   * @type {Array[Object]}
   */
  observedChannels: null,

  init() {
    this._super(...arguments);
    if (get(this, 'autoConnect')) {
      this.setup();
    }
  },

  willDestroy() {
    this._super(...arguments);
    const client = get(this, 'client');
    if (client) {
      client.unsubscribe();
    }
  },

  /**
   * Deals with instrumentation of the socketClient.
   *
   * Looks up the socketClient using it's string name and calls it's `setup` method
   * passing in the config object
   */
  setup() {
    const socketClient = get(this, 'socketClientLookup')(getOwner(this), get(this, 'socketClient'));
    set(this, 'client', socketClient);
    get(this, 'client').setup(get(this, 'config'));
    get(this, 'client').subscribe(get(this, 'observedChannels'));
  },

  addObservedChannels(newObservedChannels) {
    const channelData = get(this, 'observedChannels');
    const updatedChannelsData = isArray(newObservedChannels) ?
      [...channelData, ...newObservedChannels] :
      [...channelData, newObservedChannels];
    this._manageChannelsChange(channelData, updatedChannelsData);
  },

  removeObservedChannel(channelName) {
    const observed = get(this, 'observedChannels');
    this._manageChannelsChange(
      observed,
      removeChannel(observed, channelName)
    );
  },

  updateObservedChannels(newObservedChannels) {
    this._manageChannelsChange(get(this, 'observedChannels'), newObservedChannels);
  },

  _manageChannelsChange(oldChannelsData, newChannelsData) {
    const {
      channelsToSubscribe,
      channelsToUnsubscribe,
    } = channelsDiff(oldChannelsData, newChannelsData);
    get(this, 'client').subscribe(channelsToSubscribe);
    get(this, 'client').unsubscribeChannels(channelsToUnsubscribe);
  },
});
