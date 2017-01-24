import SocketGuru from 'ember-socket-guru/services/socket-guru';

export default SocketGuru.extend({
  socketClient: 'phoenix-channels',
  config: {
    host: 'ws://localhost:4000/socket',
  },
  observedChannels: [
    { 'event:lobby': ['new_msg'] },
  ],
});
