export default function(owner, socketClientName) {
  return owner.lookup(`socket-client:${socketClientName}`);
}
