import SocketGuru from 'ember-socket-guru/services/socket-guru';

export default SocketGuru.extend({
  socketClient: 'action-cable',
  config: {
    socketAddress: 'ws://0.0.0.0:28080',
  },
  observedChannels: ['CommentsChannel'],
});
