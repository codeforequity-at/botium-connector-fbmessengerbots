const util = require('util')
const fblogin = require('facebook-chat-api')
const debug = require('debug')('botium-connector-fbmessengerbots')
const debugApi = require('debug')('botium-connector-fbmessengerbots-api')

const Capabilities = {
  FB_PAGEID: 'FB_PAGEID',
  FB_USER: 'FB_USER',
  FB_PASSWORD: 'FB_PASSWORD'
}

const promisify = (fnc, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      fnc(...args, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    } catch (err) {
      reject(err)
    }
  })
}

class BotiumConnectorFBMessengerBots {
  constructor ({ queueBotSays, caps }) {
    this.queueBotSays = queueBotSays
    this.caps = caps
    this.fbapi = null
    this.fbapiStopListener = null
  }

  async Validate () {
    if (!this.caps[Capabilities.FB_PAGEID]) throw new Error('FB_PAGEID capability required')
    if (!this.caps[Capabilities.FB_USER]) throw new Error('FB_USER capability required')
    if (!this.caps[Capabilities.FB_PASSWORD]) throw new Error('FB_PASSWORD capability required')
  }

  async Build () {
    this.fbapi = null
    try {
      this.fbapi = await promisify(fblogin,
        {
          email: this.caps[Capabilities.FB_USER],
          password: this.caps[Capabilities.FB_PASSWORD]
        },
        {
          logLevel: debugApi.enabled ? 'info' : 'warn'
        }
      )

      debug(`Login to Facebook page ${this.caps[Capabilities.FB_PAGEID]} with user ${this.caps[Capabilities.FB_USER]} succeeded.`)
    } catch (err) {
      debug(`Login to Facebook page ${this.caps[Capabilities.FB_PAGEID]} with user ${this.caps[Capabilities.FB_USER]} failed: ${err.message || util.inspect(err)}.`)
      if (err.error === 'login-approval') {
        throw new Error('Two-factor authentiction required, which is not supported.')
      } else {
        throw new Error(`Facebook login failed: ${err.message || util.inspect(err)}`)
      }
    }
  }

  async Start () {
    if (this.fbapiStopListener) {
      this.fbapiStopListener()
      this.fbapiStopListener = null
    }
    this.fbapiStopListener = this.fbapi.listenMqtt((err, event) => {
      if (err) {
        debug(`Facebook API Error: ${err.message || err}`)
      } else if (event.type === 'message') {
        debug(`Facebook API received message: ${util.inspect(event)}`)
        const botMsg = { sourceData: event }
        if (event.body) {
          botMsg.messageText = event.body
        }
        this.queueBotSays(botMsg)
      } else {
        debug(`Facebook API ignored event: ${util.inspect(event)}`)
      }
    })
  }

  async UserSays (msg) {
    debug(`UserSays called: ${msg.messageText}`)
    this.fbapi.sendMessage(msg.messageText, `${this.caps[Capabilities.FB_PAGEID]}`)
  }

  async Stop () {
    debug('Stop called')
    if (this.fbapiStopListener) {
      this.fbapiStopListener()
      this.fbapiStopListener = null
    }
  }

  async Clean () {
    if (this.fbapiStopListener) {
      this.fbapiStopListener()
      this.fbapiStopListener = null
    }
    if (this.fbapi) {
      try {
        await promisify(this.fbapi.logout.bind(this.fbapi))
        debug('Logout from Facebook ready.')
      } catch (err) {
        debug(`Logout from Facebook failed: ${err.message || util.inspect(err)}`)
      }
      this.fbapi = null
    }
  }
}

module.exports = BotiumConnectorFBMessengerBots
