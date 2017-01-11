import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const { get, run } = Ember;

moduleFor('service:socket-guru', 'Unit | Service | socket guru');

test('setup function', function(assert) {
  const adapterSetupSpy = sinon.spy();
  const unsubscribeSpy = sinon.spy();
  const adapter = {
    setup: adapterSetupSpy,
    unsubscribe: unsubscribeSpy,
  };
  const adapterLookupSpy = sinon.spy(() => adapter);
  const config = { pusherKey: 'FOO' };
  const service = this.subject({
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

  run(() => {
    service.destroy();
  });

  assert.ok(
    unsubscribeSpy.calledOnce,
    'it calls the unsubscribe function on adapter when destroyed'
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
    client: { subscribe: adapterSubscribeSpy, unsubscribe() {} },
  });

  service.subscribeToChannels();

  assert.ok(adapterSubscribeSpy.calledOnce, 'it calls the subscribe function on adapter');
  assert.deepEqual(
    adapterSubscribeSpy.args[0][0],
    observedChannels,
    'it passes the observed channels to the subscribe function on adapter'
  );
});
