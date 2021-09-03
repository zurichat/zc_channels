import { ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import {
  Button,
  Stack,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Text } from '@chakra-ui/layout'
// import { BellIcon, ChevronDownIcon, EmailIcon } from '@chakra-ui/icons'
import TabsRows from './TabsRow'

import React from 'react'

const ChannelDetails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef()
  const finalRef = React.useRef()
  return (
    <>
      {/* <Button onClick={onOpen}size="sm" bg="#00b87c" color="white" pt="2" pb="2" fontSize="14px">View Channel Details</Button> */}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={onOpen}
        onClose={onClose}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent p={0} mt='8rem' borderRadius='2px'>
          <ModalHeader pt={4} pb={2} backgroundColor='#00AD75' color='#fff'>
            <Text fontSize='20px' pb={2} mb={2} color='#fff'>
              # Announcement
            </Text>
            <ModalCloseButton color='#fff' />
            <Stack
              direction='row'
              spacing={4}
              align='center'
              color='#fff'
              my={3}
              py={2}
            >
              <Button
                color='#fff'
                // leftIcon={<BellIcon />}
                // rightIcon={<ChevronDownIcon />}
                colorScheme='whiteAlpha'
                variant='outline'
              >
                Get Notifications for @ mentions
              </Button>
              <Button
                color='#fff'
                // leftIcon={<EmailIcon />}
                colorScheme='whiteAlpha'
                variant='outline'
              >
                Start Meeting
              </Button>
            </Stack>
            <TabsRows />
          </ModalHeader>
          <ModalBody></ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChannelDetails
