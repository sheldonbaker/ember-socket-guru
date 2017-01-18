export default function fetchEvents(data, channelName) {
  const channel = data.find((channel) => {
    return Object.keys(channel)[0] === channelName;
  });
  return channel[channelName];
}
