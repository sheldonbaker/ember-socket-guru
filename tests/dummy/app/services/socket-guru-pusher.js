import SocketGuru from 'ember-socket-guru/services/socket-guru';

export default SocketGuru.extend({
  socketClient: 'pusher',
  config: {
    pusherKey: 'PUSHER_KEY',
  },
  observedChannels: [
    { channel1: ['event1'] },
  ],
});
