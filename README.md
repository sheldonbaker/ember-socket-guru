# Ember-socket-guru
Addon for easy integration with Pusher.js, ActionCable, Socket.io and Phoenix Channels. Everything conveniently wrapped in one package.

## Features
- mechanism of integration is based on Ember.Evented
- the functionality is provided through a mixin, which makes it very easy to integrate in your app
- unified API between different socket clients
- you can use more than one client at the same time (i.e. Pusher and Phoenix)

## Contents
- [Installing](#installing)
- [Getting Started](#getting-started)
  - [Setting up socket guru service](#setting-up-socket-guru-service)
  - [Usage](#usage)
    - [Catching Single Event](#catching-single-event)
    - [Specifying Catch-all Function](#specifying-catch-all-function)
- [Observed Channels Structure](#observed-channels-structure)
  - [Channels and Events](#channels-and-events)
  - [Events Only](#events-only)
- [Socket Clients](#socket-clients)
  - [Pusher](#pusher)
  - [Socket.io](#socketio)
  - [Phoenix](#phoenix)
  - [Action Cable](#action-cable)

## Installing
`ember install ember-socket-guru`

## Getting started
### Setting up socket-guru service
To get started you need to create a service that will extend `socket-guru` service that comes with the addon:
```js
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
```
There are few things that have to be provided in order for the addon to work properly:
- `socketClient`: string name of the socket client you want to use. See [Socket Clients](#socket-clients) for list of available options.
- `config`: this hash should contain all required configuration for the used client (for more info [see below](#socket-clients) for documentation for specific clients)
- `observedChannels`: those are the channels and events that you want to listen to ([see below](#observed-channels-structures) for more info)

### Usage
To actually be able to listen to events passed in from the clients, you need to extend `SocketEventHandler` mixin in your component/route/controller, for example like so:
```js
import SocketEventHandler from 'ember-socket-guru/mixins/socket-event-handler';
export default Route.extend(SocketEventHandler, {
  onSocketAction(eventName, eventData) {
  },

  socketActions: {
    catchEvent1(data) {
      doSomething();
    }
  }
});
```
In this example whenever you trigger `event1` a handler `catchEvent1` will be executed. Whenever you trigger any other action it'll execute the `onSocketAction` handler.

#### Catching single event:
This way you can be very specific as to which event you want to handle.
```js
export default Route.extend(SocketEventHandler, {
  socketActions: {
    singleEvent(data) {
     //do something
    }
  }
});
```
This will only execute the handler if action `singleEvent` is triggered.
#### Specifying catch-all function:
If you are not sure which event you want (or you want to catch all of them) you can specify `onSocketAction` method:
```js
export default Route.extend(SocketEventHandler, {
  onSocketAction(eventName) {
    //do something
  }
});
```

## Observed Channels Structures
Due to differences in implementation across the various socket clients there are two basic types of structures for observed channels:
### Channels and events
This allows specifying both which channels you want to watch and which events on those channels are interesting to you
```js
observedChannels: {
  channel1: ['event1', 'event2'],
}
```
The code above would mean that we want to receive events `event1` and `event2` triggered on the channel `channel1`.
### Events only
Unfortunately some implementations do not allow for distinction for events and channels. In those cases we can only listen to events, thus the structure is a flat array:
```js
observedChannels: ['event1', 'event2'],
```
## Socket Clients
### Pusher
**String key:** `pusher`
**Required configuration:**
- `pusherKey`: Key for the Pusher app

**Observed channels structure**: [channels and events](#channels-and-events)

### Socket.io
**String key:** `socketio`
**Required configuration:**
- `host`: App host address, for example: `http://localhost:3000`

**Observed channels structure**: [events only](#events-only)

### Phoenix
**String key:** `phoenix`
**Required configuration:**
- `socketAddress`: Socket address, for example: `ws://localhost:4000/socket`

**Observed channels structure**: [channels and events](#channels-and-events)
### ActionCable
**String key:** `action-cable`
**Required configuration:**
- `socketAddress`: Socket address, for example: `ws://localhost:4000/socket`

**Observed channels structure**: [events only](#events-only)
