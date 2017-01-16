import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const { get, run } = Ember;

moduleFor('service:socket-guru', 'Unit | Service | socket guru');

test('setup function', function(assert) {
  const socketClientSetupSpy = sinon.spy();
  const disconnectSpy = sinon.spy();
  const socketClient = {
    setup: socketClientSetupSpy,
    subscribe() {},
    disconnect: disconnectSpy,
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
    disconnectSpy.calledOnce,
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
    disconnect() {},
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
    disconnect() {},
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
    disconnect() {},
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

test('adding observed channels', function(assert) {
  const subscribeSpy = sinon.spy();
  const unsubscribeChannelsSpy = sinon.spy();
  const socketClientLookup = () => ({
    setup: sinon.spy(),
    subscribe: subscribeSpy,
    disconnect() {},
    unsubscribeChannels: unsubscribeChannelsSpy,
  });
  const service = this.subject({
    client: socketClientLookup(),
    autoConnect: false,
    observedChannels: [{ oldChannel: ['oldData'] }],
    socketClient: 'pusher',
  });

  const channelsToAdd = { testChannel: ['event1'] };
  service.addObservedChannels(channelsToAdd);

  assert.ok(subscribeSpy.calledOnce, 'it calls the subscribe method on the client');
  assert.deepEqual(
    subscribeSpy.args[0][0],
    [channelsToAdd],
    'it passes proper arguments to the client'
  );
});

test('updating existing channels', function(assert) {
  const subscribeSpy = sinon.spy();
  const unsubscribeChannelsSpy = sinon.spy();
  const socketClientLookup = () => ({
    setup: sinon.spy(),
    subscribe: subscribeSpy,
    disconnect() {},
    unsubscribeChannels: unsubscribeChannelsSpy,
  });
  const service = this.subject({
    client: socketClientLookup(),
    autoConnect: false,
    observedChannels: [{ oldChannel: ['oldData'] }],
    socketClient: 'pusher',
  });

  const channelsToUpdate = { testChannel: ['event1'] };
  service.updateObservedChannels([channelsToUpdate]);

  assert.ok(subscribeSpy.calledOnce, 'it calls the subscribe method on the client');
  assert.deepEqual(
    subscribeSpy.args[0][0],
    [channelsToUpdate],
    'it passes proper channels to unsubscribe'
  );

  assert.ok(unsubscribeChannelsSpy.calledOnce, 'it calls the unsubscribe method on the client');
  assert.deepEqual(
    unsubscribeChannelsSpy.args[0][0],
    [{ oldChannel: ['oldData'] }],
    'it passes proper channels for the client to unsubscribe'
  );
});

test('removing channels', function(assert) {
  const subscribeSpy = sinon.spy();
  const unsubscribeChannelsSpy = sinon.spy();
  const socketClientLookup = () => ({
    setup: sinon.spy(),
    subscribe: subscribeSpy,
    disconnect() {},
    unsubscribeChannels: unsubscribeChannelsSpy,
  });
  const service = this.subject({
    client: socketClientLookup(),
    autoConnect: false,
    observedChannels: [{ oldChannel: ['oldData'] }, { oldChannel2: ['oldEvent2'] }],
    socketClient: 'pusher',
  });

  service.removeObservedChannel('oldChannel');

  assert.ok(unsubscribeChannelsSpy.calledOnce, 'it calls the unsubscribe method on the client');
});
