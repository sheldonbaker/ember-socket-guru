import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const { get, run } = Ember;

moduleFor('service:socket-guru', 'Unit | Service | socket guru');

test('setup function', function(assert) {
  const socketClientSetupSpy = sinon.spy();
  const unsubscribeSpy = sinon.spy();
  const socketClient = {
    setup: socketClientSetupSpy,
    subscribe() {},
    unsubscribe: unsubscribeSpy,
  };
  const socketClientLookupSpy = sinon.spy(() => socketClient);
  const config = { pusherKey: 'FOO' };
  const service = this.subject({
    config,
    socketClient: 'pusher',
    socketClientLookup: socketClientLookupSpy,
  });

  assert.ok(socketClientLookupSpy.calledOnce, 'it uses socketClient lookup');
  assert.equal(socketClientLookupSpy.args[0][1], 'pusher', 'it passes proper socketClient name');
  assert.deepEqual(get(service, 'client'), socketClient, 'it sets the client properly');
  assert.ok(socketClientSetupSpy.calledOnce, 'it calls the setup function on socketClient');
  assert.deepEqual(
    socketClientSetupSpy.args[0][0],
    config,
    'it calls the setup function on socketClient passing the config'
  );

  run(() => {
    service.destroy();
  });

  assert.ok(
    unsubscribeSpy.calledOnce,
    'it calls the unsubscribe function on socketClient when destroyed'
  );
});

test('it delegates subscription to socketClient', function(assert) {
  const socketClientSubscribeSpy = sinon.spy();
  const observedChannels = [
      { channel1: ['event1'] },
  ];
  const socketClientLookup = () => ({
    subscribe: socketClientSubscribeSpy,
    setup() {},
    unsubscribe() {},
  });
  this.subject({
    autoConnect: true,
    observedChannels,
    socketClientLookup,
    socketClient: 'pusher',
  });

  assert.ok(socketClientSubscribeSpy.calledOnce, 'it calls the subscribe function on socketClient');
  assert.deepEqual(
    socketClientSubscribeSpy.args[0][0],
    observedChannels,
    'it passes the observed channels to the subscribe function on socketClient'
  );
});

test('it calls subscribe on socketClient only if autoConnect true', function(assert) {
  const subscribeSpy = sinon.spy();
  const setupSpy = sinon.spy();
  const socketClientLookup = () => ({
    setup: setupSpy,
    subscribe: subscribeSpy,
    unsubscribe() {},
  });
  this.subject({
    socketClientLookup,
    socketClient: 'pusher',
  });


  assert.ok(
    subscribeSpy.calledOnce && setupSpy.calledOnce,
    'it calls the setup and subscribe functions by default'
  );
});

test('it doesnt call subscribe on on socketClient if autoConnect false', function(assert) {
  const subscribeSpy = sinon.spy();
  const setupSpy = sinon.spy();
  const socketClientLookup = () => ({
    setup: setupSpy,
    subscribe: subscribeSpy,
    unsubscribe() {},
  });
  this.subject({
    autoConnect: false,
    socketClientLookup,
    socketClient: 'pusher',
  });


  assert.notOk(
    subscribeSpy.calledOnce || setupSpy.calledOnce,
    'it doesnt call setup and subscribe'
  );
});
