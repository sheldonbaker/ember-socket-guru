import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const { setProperties, get } = Ember;

moduleFor('service:socket-guru', 'Unit | Service | socket guru');

test('it exists', function(assert) {
  const service = this.subject();
  assert.ok(service);
});

test('setup function', function(assert) {
  const adapterSetupSpy = sinon.spy();
  const adapter = { setup: adapterSetupSpy };
  const adapterLookupSpy = sinon.spy(() => adapter);
  const service = this.subject();
  const config = { pusherKey: 'FOO' };
  setProperties(service, {
    config,
    adapter: 'pusher',
    adapterLookup: adapterLookupSpy,
  });
  service.setup();

  assert.ok(adapterLookupSpy.withArgs('pusher').calledOnce, 'it uses adapter lookup');
  assert.deepEqual(get(service, 'client'), adapter, 'it sets the client properly');
  assert.ok(adapterSetupSpy.calledOnce, 'it calls the setup function on adapter');
  assert.deepEqual(
    adapterSetupSpy.args[0][0],
    config,
    'it calls the setup function on adapter passing the config'
  );
});

test('subscribing to channels', function(assert) {
  const adapterSubscribeSpy = sinon.spy();
  const observedChannels = [
      { channel1: ['event1'] },
  ];
  const service = this.subject({
    observedChannels,
    adapter: 'pusher',
    client: { subscribe: adapterSubscribeSpy },
  });

  service.subscribeToChannels();

  assert.ok(adapterSubscribeSpy.calledOnce);
  assert.deepEqual(adapterSubscribeSpy.args[0][0], observedChannels);
});
