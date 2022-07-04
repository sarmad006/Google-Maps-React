import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { GoogleMap, useJsApiLoader,Marker,Autocomplete,DirectionsRenderer } from '@react-google-maps/api';
import { useRef, useState } from 'react';


function App() {
 const [Map,SetMap]=useState(null);
 const [duration,setDuration]=useState('');
 const [Distance,setDistance]=useState('');
 const [directionResponse,setDirectionResponse]=useState(null); 

 const origin=useRef();
  
 const Destination=useRef();
 
const center = { lat: 48.8584, lng: 2.2945 }

  const containerStyle = {
    width: '100%',
    height: '100%'
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
    libraries:['places']
  })
  if(!isLoaded){
   return <SkeletonText/>
  }
  
  async function CalculateRoute(){
    if(origin.current.value==='' ||Destination.current.value==='')
    {
      return
    }
    // eslint-disable-next-line no-undef
    const DirectionService=new google.maps.DirectionsService()
    const result=await DirectionService.route({
     origin:origin.current.value,
     destination:Destination.current.value,
     // eslint-disable-next-line no-undef
     travelMode:google.maps.TravelMode.DRIVING
    })
    setDirectionResponse(result)
    setDistance(result.routes[0].legs[0].distance.text)
    setDuration(result.routes[0].legs[0].duration.text)
  }
    function clearRoutes(){
      setDirectionResponse(null)
      setDistance('')
      setDuration('')
      origin.current.value=''
      Destination.current.value=''
    }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
      <GoogleMap center={center}
      zoom={10}
      mapContainerStyle={containerStyle}
      options={{
        zoomControl:false,
        mapTypeControl:false,
        fullscreenControl:false
      }}
      onLoad={(map)=>SetMap(map)}
      >
      <Marker position={center}/>
      {directionResponse && <DirectionsRenderer directions={directionResponse}/>}
      </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='modal'
      >
        <HStack spacing={4}>
          <Autocomplete>
          <Input type='text' placeholder='Origin' ref={origin} />
          </Autocomplete>
          <Autocomplete>
          <Input type='text' placeholder='Destination' ref={Destination} />
          </Autocomplete>
          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={CalculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoutes}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: </Text>
          <Text>Duration: </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => Map.panTo(center)}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
