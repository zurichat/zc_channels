import React, { useEffect } from "react";
import { Box, Stack, Text } from "@chakra-ui/layout";
import appActions from "../../redux/actions/app";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { Heading } from "@chakra-ui/react";
import { BiBox, BiChevronDown } from "react-icons/bi";
import { Flex, Spacer, Button } from "@chakra-ui/react";
import CreateChannelModal from "../createChannel/createChannelModal";
import TopSearch from "../createChannel/TopSearch";
import { Link } from "react-router-dom";

const Home = () => {
  // STEP FIVE (Extract redux function)
  const dispatch = useDispatch();
  const { _getUsers } = bindActionCreators(appActions, dispatch);

  // STEP EIGHT (Extract redux state)
  const { users } = useSelector((state) => state.appReducer);
  console.log(users);

  // STEP SIX
  const loadData = async () => {
    await _getUsers();
  };

  // STEP SEVEN
  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box width="100%" height="100vh" bg="#E5E5E5" pt={4}>
      <Box width="95%" ml={8}>
        <TopSearch />
      </Box>
      <Box bg="white" w="95%" p={4} color="black" ml="8" borderRadius="2px">
        <Flex cursor="pointer" alignItems="center">
          <Heading as="h5" size="sm" fontWeight="semibold">
            # New Channel
          </Heading>
          <BiChevronDown />
          <Spacer />
          <CreateChannelModal />
          <organisationMembersList />
        </Flex>
      </Box>{" "}
      <Box
        bg="white"
        mt="20px"
        w="95%"
        p={4}
        color="black"
        ml="8"
        borderRadius="2px"
      >
        <Stack direction={["column", "row"]} spacing={4} align="center">
          <Button colorScheme="teal" bg="#00b87c" variant="solid">
            <Link to="/create-channel">Empty Channel</Link>
          </Button>
          <Button colorScheme="teal" bg="#00b87c" variant="solid">
            <Link to="/admin">Admin</Link>
          </Button>
          <Button colorScheme="teal" bg="#00b87c" variant="solid">
            <Link to="/message-board">Message Board</Link>
          </Button>
          <Button colorScheme="teal" bg="#00b87c" variant="solid">
            <Link to="/channel-detail">Channel Detail</Link>
          </Button>
          {/* <Button colorScheme="teal" variant="solid">
            <Link to="/user-profile"> User Profile</Link>
          </Button> */}
          <Button colorScheme="teal" bg="#00b87c" variant="solid">
            <Link to="/thread"> Threads</Link>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
