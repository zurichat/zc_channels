/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable camelcase */
import React, { useState, useEffect } from "react"
import {
  Stack,
  StackDivider,
  Spacer,
  Flex,
  HStack,
  List,
  ListItem,
  Heading,
  Box,
  Text,
  Link
} from "@chakra-ui/react"
import axios from "axios"
import moment from "moment"
import instance from "../../utils/api"
import Edit from "./Edit"

const About = index => {
  const [topic, setTopic] = useState("Add a topic")
  const [description, setDescription] = useState("Add description")
  const [owner, setOwner] = useState("owner")
  const [created_on, setCreatedOn] = useState("August 28, 2021")

  // For edit details modal
  const [modalValue, setModalValue] = useState({})
  const [isOpen, setIsOpen] = useState(false)

  const base_url = "https://channels.zuri.chat"
  const org_id = "1"
  const channel_id = "614fd30bcf2c0f1ad758538e"
  const api_url = `${base_url}/api/v1/${org_id}/channels/${channel_id}/`

  // Topic
  useEffect(() => {
    const getTopic = async () => {
      const topicFromServer = await fetchTopic()
      setTopic(topicFromServer)
    }
    getTopic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchTopic = async () => {
    const res = await axios(api_url).catch(err => console.log(err))
    // await instance.getChannelDetails(org_id, channel_id).catch((err) => console.log(err));
    const data = await res.data
    // console.log(data.name);
    return data.topic
  }

  // Description
  useEffect(() => {
    const getDescription = async () => {
      const descriptionFromServer = await fetchDescription()
      setDescription(descriptionFromServer)
    }
    getDescription()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchDescription = async () => {
    const res = await axios(api_url).catch(err => console.log(err))
    const data = await res.data
    // console.log(data.description);
    return data.description
  }

  // channel owner
  useEffect(() => {
    const getOwner = async () => {
      const ownerFromServer = await fetchOwner()
      setOwner(ownerFromServer)
    }
    getOwner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchOwner = async () => {
    const res = await axios(api_url).catch(err => console.log(err))
    const data = await res.data
    // console.log(data.owner);
    return data.owner
  }

  // channel creation date
  useEffect(() => {
    const getCreatedOn = async () => {
      const creationDateFromServer = await fetchCreatedOn()
      setCreatedOn(creationDateFromServer)
    }
    getCreatedOn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCreatedOn = async () => {
    const res = await axios(api_url).catch(err => console.log(err))
    const data = await res.data
    // console.log(data.created_on);
    return data.created_on
  }

  // Edit description
  function clickHandler(name, description) {
    setIsOpen(true)
    setModalValue(name, description)
    console.log(name, description)
  }

  return (
    <List>
      <Stack direction="column" my="1.2rem" spacing={3}>
        <Info
          title="Topic"
          placeholder={topic}
          edit={<Edit clickHandler={clickHandler} />}
        />
        <Info
          title="Description"
          placeholder={description}
          edit={<Edit clickHandler={clickHandler} />}
        />
        <Info
          title="Created by"
          placeholder={`${owner} on ${moment(created_on).format(
            "MMMM Do, YYYY"
          )}`}
        />
      </Stack>
    </List>
  )
}

const Info = ({ title, placeholder, edit, index }) => (
  <ListItem key={index}>
    <>
      <Stack
        border="1px"
        borderColor="gray.200"
        borderRadius="3px"
        p={4}
        bg="white.700"
      >
        <Box px="1rem" py="0.2rem" color="black.800">
          <Flex>
            <Heading
              mb=".32rem"
              fontWeight="normal"
              fontSize="md"
              color="#1D1D1D"
              fontFamily="Lato, sans-serif"
            >
              {title}
            </Heading>
            <Spacer />
            <Box>{edit}</Box>
          </Flex>
          <Text
            fontSize="md"
            height="auto"
            color="#B0AFB0"
            fontFamily="Lato, sans-serif"
          >
            {placeholder}
          </Text>
        </Box>
      </Stack>
    </>
  </ListItem>
)

export default About
