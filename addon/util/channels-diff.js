function buildChannelsObject(channelsList, reference) {
  return channelsList.reduce((acc, channel) => {
    return Object.assign({}, acc, { [channel]: reference[channel] });
  }, {});
}

export function removeChannel(channelsData, channelName) {
  const newChannels = Object.keys(channelsData)
    .filter(channel => channel !== channelName);

  return buildChannelsObject(newChannels, channelsData);
}

export function channelsDiff(oldChannelsData, newChannelsData) {
  const oldChannels = Object.keys(oldChannelsData);
  const newChannels = Object.keys(newChannelsData);
  const unsubscribeChannelsList = oldChannels
    .filter(channel => !newChannels.includes(channel));
  const subscribeChannelsList = newChannels
    .filter((channel) => !oldChannels.includes(channel));

  const channelsToUnsubscribe = buildChannelsObject(unsubscribeChannelsList, oldChannelsData);
  const channelsToSubscribe = buildChannelsObject(subscribeChannelsList, newChannelsData);

  return { channelsToUnsubscribe, channelsToSubscribe };
}
