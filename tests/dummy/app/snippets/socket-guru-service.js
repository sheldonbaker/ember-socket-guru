// app/services/socket-guru.js
import SocketGuruService from 'ember-socket-guru/services/socket-guru';

export default SocketGuruService.extend({
  socketClient: 'pusher',
  config: {
    pusherKey: 'PUSHER_KEY',
  },
  observedChannels: {
    channel1: ['event1']
  },
});
