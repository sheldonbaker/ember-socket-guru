export default function(owner, socketClientName) {
  return owner.lookup(`ember-socket-guru@socket-client:${socketClientName}`);
}
