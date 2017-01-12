import socketClientLookup from 'ember-socket-guru/util/socket-client-lookup';
import sinon from 'sinon';
import { module, test } from 'qunit';

module('Unit | Utility | socketClient lookup');

test('it looks up socketClient', function(assert) {
  const socketClient = socketClientLookup({ lookup: () => true }, 'socket-io');
  assert.ok(socketClient);
});

test('it uses the container to look up socketClient', function(assert) {
  const lookupSpy = sinon.spy();
  socketClientLookup({ lookup: lookupSpy }, 'socket-io');
  assert.ok(lookupSpy.withArgs('socket-client:socket-io').calledOnce);
});
