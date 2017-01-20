import Ember from 'ember';

const {
  Mixin,
  get,
  inject: { service },
} = Ember;

export default Mixin.create({
  socketGuru: service(),

  init() {
    this._super(...arguments);
    get(this, 'socketGuru').on('newEvent', this, this._handleEvent);
  },

  willDestroy() {
    this._super(...arguments);
    get(this, 'socketGuru').off('newEvent', this, this._handleEvent);
  },

  _handleEvent(event, data) {
    const method = this._getEventMethod(event);
    if (method) return method(data);
    if (this.onSocketAction && this.onSocketAction.apply) {
      this.onSocketAction(event, data);
    }
  },

  _getEventMethod(methodName) {
    const pusherActions = get(this, 'pusherActions') || [];
    const method = Object.keys(pusherActions)
      .find((key) => key === methodName);
    if (method) {
      return get(this, `pusherActions.${methodName}`).bind(this);
    }
  },
});
