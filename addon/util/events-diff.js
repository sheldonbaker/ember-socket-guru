const removeEvent = (eventsList, eventToDelete) => {
  return eventsList
    .filter(event => event !== eventToDelete);
};

const eventsDiff = (oldEvents, newEvents) => {
  const channelsToSubscribe = newEvents
    .filter(event => !oldEvents.includes(event));
  const channelsToUnsubscribe = oldEvents
    .filter(event => !newEvents.includes(event));
  return { channelsToSubscribe, channelsToUnsubscribe };
};

export { eventsDiff, removeEvent };
