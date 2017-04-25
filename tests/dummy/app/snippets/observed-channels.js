import SocketGuru from 'ember-socket-guru/services/socket-guru';

export default SocketGuru.extend({
  // other config goes here ...
  observedChannels: ['event1', 'event2'],
});
