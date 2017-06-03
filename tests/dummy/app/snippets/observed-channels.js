import SocketGuru from 'ember-socket-guru/services/socket-guru';

export default SocketGuru.extend({
  // other config goes here ...
  observedChannels: {
    channel1: ['event1', 'event2'],
  },
});
