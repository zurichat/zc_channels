/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
import { AddIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/layout"
import React, { useEffect, useState } from "react"
import { bindActionCreators } from "redux"
import { useDispatch, useSelector } from "react-redux"
import ChannelBrowserHeader from "./ChannelBrowserHeader"
import appActions from "../../redux/actions/app"
import SearchMenu from "./SearchMenu"
import ChannelList from "./ChannelList"

const ChannelBrowser = () => {
  const { users } = useSelector(state => state.appReducer)
  const dispatch = useDispatch()
  const [orgId, setOrgId] = useState("")
  const { _getChannels } = bindActionCreators(appActions, dispatch)

  const loadChannels = async () => {
    await _getChannels(orgId.org_id)
  }

  useEffect(() => {
    if (users) {
      setOrgId(users[0])
    }
  }, [users])

  useEffect(() => {
    if (orgId) {
      loadChannels()
    }
  }, [orgId])

  const originalChannel = useSelector(state => state.appReducer).channels
  const [channels, setChannel] = useState([...originalChannel])

  useEffect(() => {
    setChannel([...originalChannel])
  }, [originalChannel])

  const searchChannel = param => {
    if (!channels) return
    param = param.trim().toLowerCase()
    if (param) {
      setChannel(
        originalChannel.filter(
          chan =>
            chan.name.toLowerCase().includes(param) ||
            chan.description.toLowerCase().includes(param)
        )
      )
    } else {
      setChannel([...originalChannel])
    }
  }

  const sortBy = param => {
    if (!channels) return
    const newChannel = channels.sort((chan1, chan2) => {
      let prop1 = 0
      let prop2 = 0

      switch (param) {
        case "recommended":
          prop1 = chan1._id
          prop2 = chan2._id
          break

        case "newest":
          prop1 = new Date(chan1.created_on).getTime()
          prop2 = new Date(chan2.created_on).getTime()
          break

        case "oldest":
          prop1 = new Date(chan2.created_on).getTime()
          prop2 = new Date(chan1.created_on).getTime()
          break

        case "leastMembers":
          prop1 = chan1.members
          prop2 = chan2.members
          break

        case "mostMembers":
          prop1 = chan2.members
          prop2 = chan1.members
          break

        case "name":
          prop1 = chan1.name
          prop2 = chan2.name
          break

        case "nameReverse":
          prop1 = chan2.name
          prop2 = chan1.name
          break

        default:
          prop1 = chan1._id
          prop2 = chan2._id
          break
      }
      if (typeof prop1 === "number") {
        return prop1 - prop2
      }

      return prop1 > prop2 ? 1 : prop1 == prop2 ? 0 : -1
    })
    setChannel([...newChannel])
  }
  return (
    <Box mt="0" bgColor="#E5E5E5" height="100vh">
      <ChannelBrowserHeader />
      <Box
        bgColor="white"
        h="full"
        mr={2}
        p={4}
        pt="16px"
        sx={{ "@media screen and (max-width: 768.5px)": { marginRight: "0" } }}
      >
        <SearchMenu
          channels={channels}
          sortBy={sortBy}
          searchChannel={searchChannel}
        />
        <ChannelList orgId={orgId} channels={channels} />
      </Box>

      {/* Mobile View to Add Channel */}
      <AddIcon
        bgColor="#00B87C"
        color="white"
        w="50px"
        h="50px"
        p="3"
        borderRadius="50%"
        display="none"
        sx={{ "@media screen and (max-width: 768.5px)": { display: "block" } }}
      />
    </Box>
  )
}

export default ChannelBrowser
