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
    subscribe() {},
    unsubscribe: unsubscribeSpy,
  };
  const adapterLookupSpy = sinon.spy(() => adapter);
  const config = { pusherKey: 'FOO' };
  const service = this.subject({
    config,
    adapter: 'pusher',
    adapterLookup: adapterLookupSpy,
  });

  assert.ok(adapterLookupSpy.calledOnce, 'it uses adapter lookup');
  assert.equal(adapterLookupSpy.args[0][1], 'pusher', 'it passes proper adapter name');
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

test('it delegates subscription to adapter', function(assert) {
  const adapterSubscribeSpy = sinon.spy();
  const observedChannels = [
      { channel1: ['event1'] },
  ];
  const adapterLookup = () => ({
    subscribe: adapterSubscribeSpy,
    setup() {},
    unsubscribe() {},
  });
  this.subject({
    autoConnect: true,
    observedChannels,
    adapterLookup,
    adapter: 'pusher',
  });

  assert.ok(adapterSubscribeSpy.calledOnce, 'it calls the subscribe function on adapter');
  assert.deepEqual(
    adapterSubscribeSpy.args[0][0],
    observedChannels,
    'it passes the observed channels to the subscribe function on adapter'
  );
});

test('it calls subscribe on adapter only if autoConnect true', function(assert) {
  const subscribeSpy = sinon.spy();
  const setupSpy = sinon.spy();
  const adapterLookup = () => ({
    setup: setupSpy,
    subscribe: subscribeSpy,
    unsubscribe() {},
  });
  this.subject({
    adapterLookup,
    adapter: 'pusher',
  });


  assert.ok(
    subscribeSpy.calledOnce && setupSpy.calledOnce,
    'it calls the setup and subscribe functions by default'
  );
});

test('it doesnt call subscribe on on adapter if autoConnect false', function(assert) {
  const subscribeSpy = sinon.spy();
  const setupSpy = sinon.spy();
  const adapterLookup = () => ({
    setup: setupSpy,
    subscribe: subscribeSpy,
    unsubscribe() {},
  });
  this.subject({
    autoConnect: false,
    adapterLookup,
    adapter: 'pusher',
  });


  assert.notOk(
    subscribeSpy.calledOnce || setupSpy.calledOnce,
    'it doesnt call setup and subscribe'
  );
});
