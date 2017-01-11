import adapterLookup from 'ember-socket-guru/util/adapter-lookup';
import sinon from 'sinon';
import { module, test } from 'qunit';

module('Unit | Utility | adapter lookup');

test('it looks up adapter', function(assert) {
  const adapter = adapterLookup({ lookup: () => true }, 'socket-io');
  assert.ok(adapter);
});

test('it uses the container to look up adapter', function(assert) {
  const lookupSpy = sinon.spy();
  adapterLookup({ lookup: lookupSpy }, 'socket-io');
  assert.ok(lookupSpy.withArgs('adapter:socket-io').calledOnce);
});
