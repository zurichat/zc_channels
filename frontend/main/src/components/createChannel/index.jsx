/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/named */
import React, { useEffect } from "react"
import { Box } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { useDispatch } from "react-redux"
import { bindActionCreators } from "redux"
import MessageInput from "../shared/MessageInput"
import { TobBarMobile, TopBar } from "./TopBar"
import ChannelBody from "./ChannelBody"
// import TopSearch from "./TopSearch";
import appActions from "../../redux/actions/app"
// import { v4 } from "uuid";

const CreateChannel = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: true,
    lg: false,
    xl: false
  })

  const dispatch = useDispatch()

  const { _getChannelDetails } = bindActionCreators(appActions, dispatch)

  const loadData = async () => {
    // todo static data
    await _getChannelDetails(
      "614679ee1a5607b13c00bcb7",
      "614fd412cf2c0f1ad7585394"
    )
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box width="100%" height="100vh" bg="#FFFFFF">
      <Box p={isMobile ? 0 : 6} mb={6}>
        {/* {!isMobile && <TopSearch />} */}
        {isMobile ? <TobBarMobile /> : <TopBar />}
        <ChannelBody />
        <MessageInput />
      </Box>
    </Box>
  )
}

export default CreateChannel
