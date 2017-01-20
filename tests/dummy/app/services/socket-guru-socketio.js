import SocketGuru from 'ember-socket-guru/services/socket-guru';

export default SocketGuru.extend({
  socketClient: 'socketio',
  config: {
    host: 'http://localhost:3000',
  },
  observedChannels: ['test-event'],
});
