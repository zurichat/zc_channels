import {
  Tabs,
  TabPanels,
  TabPanel,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Spacer,
  Box,
  Button,
  Stack,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react"
import { Text } from "@chakra-ui/layout"
import {
  FaPhoneAlt,
  FaRegBell,
  FaChevronDown,
  FaRegStar,
  FaHashtag
} from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { bindActionCreators } from "redux"
import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"
import TabsRows from "./TabsRow"

import appActions from "../../redux/actions/app"

import About from "./about"
import FileList from "./fileList"
import NotificationModal from "./NotificationModal"

import OrganisationMembersList from "./organisationMembersList"

const ChannelDetails = ({ onClose, isOpen }) => {
  const initialRef = useRef()

  const [showModal, setShowModal] = useState(false)

  const openModal = () => {
    setShowModal(prev => !prev)
  }

  const { channelId } = useParams()
  const orgId = "614679ee1a5607b13c00bcb7"

  const dispatch = useDispatch()

  const { _getChannelDetails } = bindActionCreators(appActions, dispatch)

  // -------getting channel details.........//
  const { channelDetails } = useSelector(state => state.channelsReducer) // extract redux state

  useEffect(() => {
    _getChannelDetails(orgId, channelId)
  }, [_getChannelDetails, channelId])

  // const isPrivate = channelDetails.private

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent p={0} mt="8rem" maxW="700px" height="834px">
          <Tabs colorScheme="" borderBottomColor="green" color="#fff">
            <ModalHeader
              pt={3}
              pb={2}
              backgroundColor="#F6F6F6"
              color="#000"
              height="191px"
            >
              <Box px={6}>
                <Flex>
                  <Box pe={2} pt={1.5}>
                    <FaHashtag
                      color="#000"
                      fontSize="1.2em"
                      width="18px"
                      height="32"
                      display="inline-block"
                    />
                  </Box>
                  <Text fontSize="20px" pb={2} mb={2} color="#000">
                    {channelDetails.name}
                  </Text>
                  <Box ps={2} pt={1.5}>
                    <FaRegStar
                      color="#000"
                      fontSize="1.2em"
                      width="18px"
                      height="32.4px"
                      display="inline-block"
                    />
                  </Box>
                  <Spacer />
                  <ModalCloseButton
                    color="#000"
                    // border="1px"
                    // borderColor="#000"
                  />
                </Flex>
                <Stack direction="row" my={1} py={2}>
                  <Box>
                    <Button
                      color="#000"
                      colorScheme="whiteAlpha"
                      variant="outline"
                      mr={2}
                    >
                      <Box mr={2} mt={1}>
                        <FaRegBell color="#000" mr={6} />
                      </Box>
                      <Text color="#000">Get Notifications for @ mentions</Text>
                      <Box ml={2} mt={1}>
                        <FaChevronDown
                          color="#000"
                          mt={4}
                          ml={5}
                          onClick={openModal}
                        />
                        <NotificationModal />
                      </Box>
                    </Button>
                    <Button
                      color="#000"
                      colorScheme="whiteAlpha"
                      variant="outline"
                      ml={2}
                    >
                      <Box mr={2} mt={1}>
                        <FaPhoneAlt color="#FFFFF" w={2} />
                      </Box>
                      <Text color="#000">Start a Call</Text>
                    </Button>
                  </Box>
                </Stack>
                <Box w={400}>
                  <TabsRows colorScheme="WhatsApp" />
                </Box>
              </Box>
            </ModalHeader>
            <ModalBody height="703px" backgroundColor="#f9f9f9">
              <Box px={6}>
                <TabPanels>
                  <TabPanel>
                    <About />
                    {/* <FileList /> */}
                  </TabPanel>
                  <TabPanel>{/* <OrganisationMembersList /> */}</TabPanel>
                  <TabPanel />
                  <TabPanel />
                </TabPanels>
              </Box>
            </ModalBody>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChannelDetails
