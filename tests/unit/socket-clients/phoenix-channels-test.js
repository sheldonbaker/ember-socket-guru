import PhoenixClient from 'ember-socket-guru/socket-clients/phoenix-channels';
import { module, test } from 'qunit';
import sinon from 'sinon';
import Ember from 'ember';

module('Unit | Socket Clients | Phoenix');

const { get } = Ember;
const getPhoenixStub = (
  connect = () => {},
  disconnect = () => {},
  channel = () => {}
) => function() {
  Object.assign(this, {
    connect, disconnect, channel,
  });
};

test('verifies required config options', function(assert) {
  const connectSpy = sinon.spy();
  const client = PhoenixClient.create({
    ChannelService: getPhoenixStub(connectSpy),
  });

  assert.throws(() => {
    client.setup({});
  }, /need to provide host/, 'it throws when no host present');
});

test('setup method', function(assert) {
  const connectSpy = sinon.spy();
  const client = PhoenixClient.create({
    ChannelService: getPhoenixStub(connectSpy),
  });
  const eventHandlerSpy = sinon.spy();

  client.setup({ host: 'http://localhost:3000' }, eventHandlerSpy);
  assert.ok(connectSpy.calledOnce, 'it calls connect on the phoenix service');
  assert.equal(
    get(client, 'eventHandler'),
    eventHandlerSpy,
    'it properly sets passed event handler'
  );
});

test('subscribe method', function(assert) {
  const connectSpy = sinon.spy();
  const onSpy = sinon.spy();
  const joinSpy = sinon.spy();
  const channelSpy = sinon.spy(() => ({
    on: onSpy,
    join: joinSpy,
  }));
  const client = PhoenixClient.create({
    ChannelService: getPhoenixStub(connectSpy, () => {}, channelSpy),
  });

  client.setup({ host: 'http://localhost:3000' });
  client.subscribe([
    { channel1: ['event1', 'event2'] },
    { channel2: ['event3'] },
  ]);

  assert.equal(joinSpy.callCount, 2, 'it calls join for every channel');
  assert.equal(onSpy.callCount, 3, 'it calls on for every event');
  const [[eventName1], [eventName2], [eventName3]] = onSpy.args;
  assert.deepEqual(
    [eventName1, eventName2, eventName3],
    ['event1', 'event2', 'event3']
  );
  assert.deepEqual(
    Object.keys(get(client, 'joinedChannels')),
    ['channel1', 'channel2'],
    'it stores joined chanels in the joinedChannels property'
  );
});

test('unsubscribeChannels method', function(assert) {
  const leaveSpy = sinon.spy();
  const channelSpy = sinon.spy(() => ({
    on() {},
    join() {},
    leave: leaveSpy,
  }));
  const client = PhoenixClient.create({
    ChannelService: getPhoenixStub(() => {}, () => {}, channelSpy),
  });

  client.setup({ host: 'http://localhost:3000' });
  client.subscribe([
    { channel1: ['event1'] },
  ]);
  client.unsubscribeChannels([
    { channel1: ['event1'] },
  ]);
  assert.ok(leaveSpy.calledOnce);
});

test('disconnect method', function(assert) {
  const disconnectSpy = sinon.spy();
  const client = PhoenixClient.create({
    ChannelService: getPhoenixStub(() => {}, disconnectSpy),
  });
  client.setup({ host: 'http://localhost:3000' });
  client.disconnect();

  assert.ok(disconnectSpy.calledOnce);
});
