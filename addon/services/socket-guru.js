import Ember from 'ember';
import adapterLookup from 'ember-socket-guru/util/adapter-lookup';

const { Service, get, set, getOwner } = Ember;

export default Service.extend({
  adapterLookup,

  /**
   * Configuration for given client
   *
   * After the actual adapter is resolved this object is then passed into it
   * which allows additional configuration.
   * @param config
   * @type {Object}
   */
  config: null,

  /**
   * Adapter name, that will be used to resolve the actual adapter.
   * @param adapter
   * @type {String}
   */
  adapter: null,

  /**
   * Adapter instance resolved using name.
   * @param client
   * @type {Object}
   */
  client: null,

  autoConnect: true,

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
    if (client) client.unsubscribe();
  },

  /**
   * Deals with instrumentation of the adapter.
   *
   * Looks up the adapter using it's string name and calls it's `setup` method
   * passing in the config object
   */
  setup() {
    const adapter = get(this, 'adapterLookup')(getOwner(this), get(this, 'adapter'));
    set(this, 'client', adapter);
    get(this, 'client').setup(get(this, 'config'));
    get(this, 'client').subscribe(get(this, 'observedChannels'));
  },
});
