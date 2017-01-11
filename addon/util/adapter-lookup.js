export default function(owner, adapterName) {
  return owner.lookup(`adapter:${adapterName}`);
}
