import SocketGuru from 'ember-socket-guru/services/socket-guru';

export default SocketGuru.extend({
  socketClient: 'pusher',
  config: {
  },
  observedChannels: [
    { channel1: ['event1'] },
  ],
});
