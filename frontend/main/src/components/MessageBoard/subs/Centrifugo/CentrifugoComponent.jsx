import React, { useEffect, useState } from "react"

// Redux
import { useDispatch, useSelector } from "react-redux"
import { bindActionCreators } from "redux"
import { useParams } from "react-router"
import { SubscribeToChannel } from "@zuri/control"
import appActions from "../../../../redux/actions/app"
import { GET_RENDEREDMESSAGES } from "../../../../redux/actions/types"

// Centrifugo
// import Centrifuge from 'centrifuge';

const CentrifugoComponent = () => {
  // WHERE WE DO THE PREVIOUS CONNECTION

  // let socketUrl = "";

  // if (window.location.hostname == "127.0.0.1")
  // {
  //   socketUrl = "ws://localhost:8000/connection/websocket";
  // } else {
  //   socketUrl = "wss://realtime.zuri.chat/connection/websocket";
  // }

  // const centrifuge = new Centrifuge(socketUrl);
  // centrifuge.connect();

  // centrifuge.on('connect', function(ctx) {
  //   console.log("connected", ctx);
  // });

  // centrifuge.on('disconnect', function(ctx) {
  //   console.log("disconnected", ctx);
  // });

  // centrifuge.on('publish', (ctx) => {
  //   console.log("Publishing: ", ctx);
  // });

  const dispatch = useDispatch()
  const { _getChannelMessages, _getSocket } = bindActionCreators(
    appActions,
    dispatch
  )

  const { channelMessages, sockets, renderedMessages, users } = useSelector(
    state => state.appReducer
  )
  const { channelDetails, sendMessages } = useSelector(
    state => state.channelsReducer
  )

  console.log("ChannelMessages: ", channelMessages)
  console.log("Sockets: ", sockets)

  const { channelId } = useParams()

  const loadData = async () => {
    await _getChannelMessages(users.currentWorkspace, channelId)
    await _getSocket(users.currentWorkspace, channelId)
  }

  // centrifuge.subscribe(sockets.socket_name, function(messageCtx) {
  //   console.log("from centrifugo: ", messageCtx);
  //   dispatch({ type: GET_RENDEREDMESSAGES, payload: [...renderedMessages, messageCtx.data] })
  //   console.log("Testing rendered messages: ", renderedMessages);

  //   let eventType = messageCtx.data.event.action
  //   let eventNumber = messageCtx.data.event.recipients
  //   // switch (eventType) {
  //   //     case "join:channel":
  //   //       dispatch({ type: GET_RENDEREDMESSAGES, payload: renderedMessages.push(messageCtx.data) })
  //   //       console.log("Testing switch statement: ", renderedMessages);
  //   //         break;

  //   //     default:
  //   //         break;
  //   // }
  // })

  useEffect(() => {
    loadData()

    SubscribeToChannel(sockets.socket_name, messageCtx => {
      console.log("from centrifugo: ", messageCtx)
      dispatch({
        type: GET_RENDEREDMESSAGES,
        payload: [...renderedMessages, messageCtx.data]
      })
      console.log("Testing rendered messages: ", renderedMessages)

      const eventType = messageCtx.data.event.action
      const eventNumber = messageCtx.data.event.recipients
      // switch (eventType) {
      //     case "join:channel":
      //       dispatch({ type: GET_RENDEREDMESSAGES, payload: renderedMessages.push(messageCtx.data) })
      //       console.log("Testing switch statement: ", renderedMessages);
      //         break;

      //     default:
      //         break;
      // }
    })
  }, [dispatch, loadData, renderedMessages, sockets.socket_name])

  return <></>
}

export default CentrifugoComponent
