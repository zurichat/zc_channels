import React, { useEffect } from "react"
import {
  Grid,
  Flex,
  Image,
  Text,
  Box,
  Spacer,
  FormControl,
  Select,
  SimpleGrid,
  IconButton
} from "@chakra-ui/react"
import { FiDownloadCloud } from "react-icons/fi"
import { AiOutlineUpload } from "react-icons/ai"
import { BsGrid } from "react-icons/bs"
import { CgList } from "react-icons/cg"

import { bindActionCreators } from "redux"
import { useDispatch } from "react-redux"

import appActions from "../../redux/actions/app"

export default function DisplayFiles() {
  const dispatch = useDispatch()
  const { _getFiles } = bindActionCreators(appActions, dispatch)

  const orgId = "614679ee1a5607b13c00bcb7"
  const channelId = "613f70bd6173056af01b4aba"

  // STEP SIX
  const loadData = async () => {
    await _getFiles(orgId, channelId)
  }

  // STEP SEVEN
  useEffect(() => {
    loadData()
  }, [])

  const handleGrid = () => {
    // console.log("grid")
  }

  const handleList = () => {
    // console.log("list")
  }

  return (
    <>
      <Box bg="#e5e5e5" h="100%">
        <Box>
          <Box ml={3} p={3}>
            <Flex>
              <FormControl w="200px" bg="white" border="1px" borderRadius="5px">
                <Select placeholder="Shared by">
                  <option>Me</option>
                  <option>You</option>
                </Select>
              </FormControl>
              <Spacer />
              <Box display="column" w="60px" mr="40px">
                <Flex>
                  <IconButton
                    icon={<CgList color="#a1a1a1" onClick={handleList} />}
                  />

                  <IconButton
                    icon={<BsGrid color="#a1a1a1" onClick={handleGrid} />}
                  />
                </Flex>
              </Box>
            </Flex>
          </Box>
          {/* display list */}
          <Flex m="10px">
            <Box>
              <Text>4 results</Text>
            </Box>
            <Spacer />
            <Box>
              <Text> Sort: Newest files</Text>
            </Box>
          </Flex>

          <Grid>
            <Box
              w="99%"
              bg="white"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "green.300" }}
            >
              <Flex align="center">
                <Box>
                  <Image
                    m={3}
                    boxSize="70px"
                    objectFit="cover"
                    src="https://bit.ly/dan-abramov"
                    alt="john doe"
                  />
                </Box>
                <Box>
                  <Text color="#333" fontSize="20px">
                    image.png
                  </Text>
                  <Text color="#717171" fontSize="12px">
                    Lorem, ipsum.
                  </Text>
                </Box>
                <Spacer />
                {/* <Box w='60px' m='10px'>
                    <Flex>
                      <Box>
                        <IconButton
                          icon={
                            <FiDownloadCloud onClick={this.handleDownload} />
                          }
                        />
                      </Box>
                      <Spacer />

                      <Box>
                        <AiOutlineUpload />
                      </Box>
                    </Flex>
                  </Box> */}
              </Flex>
            </Box>

            <Box
              bg="white"
              w="99%"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "green.300" }}
            >
              <Flex align="center">
                <Box>
                  <Image
                    m={3}
                    boxSize="70px"
                    objectFit="cover"
                    src="https://bit.ly/dan-abramov"
                    alt="john doe"
                  />
                </Box>
                <Box>
                  <Text color="#333" fontSize="20px">
                    image.png
                  </Text>
                  <Text color="#717171" fontSize="12px">
                    Lorem, ipsum.
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="white"
              w="99%"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "green.300" }}
            >
              <Flex align="center">
                <Box>
                  <Image
                    m={3}
                    boxSize="70px"
                    objectFit="cover"
                    src="https://bit.ly/dan-abramov"
                    alt="john doe"
                  />
                </Box>
                <Box>
                  <Text color="#333" fontSize="20px">
                    image.png
                  </Text>
                  <Text color="#717171" fontSize="12px">
                    Lorem, ipsum.
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="white"
              w="99%"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "green.300" }}
            >
              <Flex align="center">
                <Box>
                  <Image
                    m={3}
                    boxSize="70px"
                    objectFit="cover"
                    src="https://bit.ly/dan-abramov"
                    alt="john doe"
                  />
                </Box>
                <Box>
                  <Text color="#333" fontSize="20px">
                    image.png
                  </Text>
                  <Text color="#717171" fontSize="12px">
                    Lorem, ipsum.
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="white"
              w="99%"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "green.300" }}
            >
              <Flex align="center">
                <Box>
                  <Image
                    m={3}
                    boxSize="70px"
                    objectFit="cover"
                    src="https://bit.ly/dan-abramov"
                    alt="john doe"
                  />
                </Box>
                <Box>
                  <Text color="#333" fontSize="20px">
                    image.png
                  </Text>
                  <Text color="#717171" fontSize="12px">
                    Lorem, ipsum.
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Grid>

          {/* display grid */}
          <SimpleGrid columns={[1, 2, 3, 4]} gap="2px">
            <Box
              w="90%"
              bg="white"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "blue.300" }}
            >
              <Box
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
              >
                <Image src="https://bit.ly/2Z4KKcF" alt="john doe" />
              </Box>
              <Box p="6">
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  isTruncated
                >
                  image.png
                </Box>
                <Box color="#717171">Lorem, ipsum.</Box>
              </Box>
              <Spacer />
              <Box w="60px" m="10px">
                <Flex>
                  <Box>
                    <FiDownloadCloud />
                  </Box>
                  <Spacer />
                  <Box>
                    <AiOutlineUpload />
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Box
              bg="white"
              w="90%"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "blue.300" }}
            >
              <Box
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
              >
                <Image src="https://bit.ly/2Z4KKcF" alt="john doe" />
              </Box>
              <Box p="6">
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  isTruncated
                >
                  image.png
                </Box>
                <Box color="#717171">Lorem, ipsum.</Box>
              </Box>
            </Box>

            <Box
              bg="white"
              w="90%"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "blue.300" }}
            >
              <Box>
                <Image src="https://bit.ly/2Z4KKcF" alt="john doe" />
              </Box>
              <Box p="6">
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  isTruncated
                >
                  image.png
                </Box>
                <Box color="#717171">Lorem, ipsum.</Box>
              </Box>
            </Box>

            <Box
              bg="white"
              w="90%"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "blue.300" }}
            >
              <Box>
                <Image src="https://bit.ly/2Z4KKcF" alt="john doe" />
              </Box>
              <Box p="6">
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  isTruncated
                >
                  image.png
                </Box>
                <Box color="#717171">Lorem, ipsum.</Box>
              </Box>
            </Box>

            <Box
              bg="white"
              w="90%"
              borderRadius="3px"
              m={2}
              _hover={{ border: "2px", borderColor: "blue.300" }}
            >
              <Box
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
              >
                <Image src="https://bit.ly/2Z4KKcF" alt="john doe" />
              </Box>
              <Box p="6">
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  isTruncated
                >
                  image.png
                </Box>
                <Box color="#717171">Lorem, ipsum.</Box>
              </Box>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </>
  )
}
