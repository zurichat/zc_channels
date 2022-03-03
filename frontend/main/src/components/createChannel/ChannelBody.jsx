import {
  Box,
  Flex,
  Link,
  Text,
  useDisclosure,
  Icon,
  IconButton
} from "@chakra-ui/react"
import React from "react"
import { BiUserPlus } from "react-icons/bi"
import { Circle, HStack } from "@chakra-ui/layout"
import { FiHash } from "react-icons/fi"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { useSelector } from "react-redux"
import AddPeopleModal from "./addPeopleModal"
import Members from "./Members"
import UtilityService from "../../utils/utils"

const ChannelBody = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    channelsReducer: { channelDetails }
  } = useSelector(state => state)

  const isMobile = useBreakpointValue({
    base: true,
    md: true,
    lg: false,
    xl: false
  })

  return (
    <Box width="100%" m="auto" height="sm" fontSize="16px">
      <AddPeopleModal isOpen={isOpen} onClose={onClose} />

      <Flex mt="2rem" px={isMobile ? "24px" : "0"}>
        {!isMobile && (
          <IconButton
            bg="#E7E7E7"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<FiHash color="black" />}
            mx={5}
          />
        )}

        <Box mb="43px" fontSize="15px">
          <Text color="black">
            This is the very beginning of the{" "}
            <Link
              color="#0562ed"
              fontWeight="bold"
              mr="0.3rem"
              textTransform="capitalize"
            >
              #{channelDetails.name}
            </Link>
            channel
          </Text>
          <Text color="grey">
            <Link color="#0562ed" fontWeight="bold" textTransform="capitalize">
              @{channelDetails.owner}
            </Link>{" "}
            created this channel on{" "}
            {UtilityService.formatDate(channelDetails.created_on, "MMM Do")}.
          </Text>

          <HStack mt="6">
            <Circle
              cursor="pointer"
              bg="#00B87C"
              color="white"
              size="35px"
              onClick={onOpen}
            >
              <Icon as={BiUserPlus} />
            </Circle>
            <Text cursor="pointer" onClick={onOpen}>
              Add Members
            </Text>
          </HStack>
        </Box>
      </Flex>

      <Members />
      <Members />
    </Box>
  )
}

export default ChannelBody
