import SocketGuru from 'ember-socket-guru/services/socket-guru';

export default SocketGuru.extend({
  socketClient: 'phoenix',
  config: {
    socketAddress: 'ws://localhost:4000/socket',
  },
  observedChannels: {
    'event:lobby': ['new_msg'],
  },
});
