# Botium Connector for Facebook Messenger Bots 

[![NPM](https://nodei.co/npm/botium-connector-fbmessengerbots.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fbmessengerbots-connector-fbmessengerbots/)

[![npm version](https://badge.fury.io/js/botium-connector-fbmessengerbots.svg)](https://badge.fury.io/js/botium-connector-fbmessengerbots)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This is a [Botium](https://github.com/codeforequity-at/botium-core) connector for testing your Facebook Messenger Bots.

__Did you read the [Botium in a Nutshell](https://medium.com/@floriantreml/botium-in-a-nutshell-part-1-overview-f8d0ceaf8fb4) articles ? Be warned, without prior knowledge of Botium you won't be able to properly use this library!__

## How it works ?
Botium uses the [_Unofficial Facebook Chat API_](https://github.com/Schmavery/facebook-chat-api) to connect to your chatbot on Facebook Messenger.

It can be used as any other Botium connector with all Botium Stack components:
* [Botium CLI](https://github.com/codeforequity-at/botium-cli/)
* [Botium Bindings](https://github.com/codeforequity-at/botium-bindings/)
* [Botium Box](https://www.botium.at)

## Requirements

* __Node.js and NPM__
* a __Facebook Messenger Bot__
* a __project directory__ on your workstation to hold test cases and Botium configuration

## Install Botium and Facebook Messenger Bots Connector

When using __Botium CLI__:

```
> npm install -g botium-cli
> npm install -g botium-connector-fbmessengerbots
> botium-cli init
> botium-cli run
```

When using __Botium Bindings__:

```
> npm install -g botium-bindings
> npm install -g botium-connector-fbmessengerbots
> botium-bindings init mocha
> npm install && npm run mocha
```

When using __Botium Box__:

_Already integrated into Botium Box, no setup required_

## Connecting your Facebook bot to Botium

```
{
  "botium": {
    "Capabilities": {
      "PROJECTNAME": "<whatever>",
      "CONTAINERMODE": "fbmessengerbots",
      "FB_PAGEID": "...",
      "FB_USER": "...",
      "FB_PASSWORD": "..."      
    }
  }
}
```
Botium setup is ready, you can begin to write your [BotiumScript](https://github.com/codeforequity-at/botium-core/wiki/Botium-Scripting) files.

## Supported Capabilities

Set the capability __CONTAINERMODE__ to __fbmessengerbots__ to activate this connector.

### FB_PAGEID
Facebook page id

### FB_USER
Faceboook username (email)

### FB_PASSWORD
Facebook password
