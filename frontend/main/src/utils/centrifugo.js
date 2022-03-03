import { SubscribeToChannel, GetUserInfo } from "@zuri/utilities"

/**
 * Centrifugo class is an adapter class than encapsulate subscription to centrifugo
 */
class Centrifugo {
  constructor() {
    this.listeners = {}
    this.messageListeners = {}
    this.isMessageRTCSet = false
    this.isWorkspaceRTCSet = false
    this.orgId = null
    this.init()
  }

  /**
   * Initialize workspace RTC
   */
  async init() {
    this.orgId = (await GetUserInfo())["0"].org_id
    this.subscribeToAllEvents()
    this.isWorkspaceRTCSet = true
  }

  /**
   * Initialize RTC for messages
   * @param {string} socketName
   */
  async initForMessage(socketName) {
    this.socket_name = socketName
    this.subscribeToMessageEvents()
    this.isMessageRTCSet = true
  }

  subscribeToAllEvents() {
    SubscribeToChannel(`organizations_${this.orgId}`, ctx => {
      this.listenToEvents(ctx)
    })
  }

  subscribeToMessageEvents() {
    SubscribeToChannel(this.socket_name, ctx => {
      this.listenToMessageEvents(ctx)
    })
  }

  addListener(event, callback) {
    this.listeners[event] = callback
  }

  /**
   * Add a message listener
   * @param {string} event - the event type
   * @param {function} callback - the listener
   */
  addMessageListener(event, callback) {
    this.messageListeners[event] = callback
  }

  /**
   * Listens to workspace events
   * @param {object} ctx - The payload from the emitted workspace event
   */
  listenToEvents(ctx) {
    const { event, id, type } = ctx.data
    if (this.listeners[event]) {
      this.listeners[event](id, type, this.orgId)
    }
  }

  /**
   * Listens to message events
   * @param {object} ctx - The payload from the emitted message event
   */
  listenToMessageEvents(ctx) {
    const {
      event: { action }
    } = ctx.data
    if (this.messageListeners[action]) {
      this.messageListeners[action](ctx)
    }
  }
}

export default new Centrifugo()
