import React from "react";
import { View } from "react-native";
import Map from "./src/Map";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import User from "./src/User";



const Stack = createNativeStackNavigator()

const App = () => {
  return (

      <NavigationContainer>
       <Stack.Navigator>
        <Stack.Screen options={{
          headerShown:false
        }} name={"User" } component={User}/>
        <Stack.Screen options={{
          headerTitleAlign:'center',
          headerTitle:'Checking Map'
        }} name={"Map"}  component={Map}/>
       </Stack.Navigator>
      </NavigationContainer>

  );
};

export default App;
//
// import React, { useEffect, useState } from "react";
// import { Alert, StyleSheet, View } from "react-native";
// import MapboxGL from '@rnmapbox/maps';
// import Geolocation from "react-native-geolocation-service";
// import makeLineString = MapboxGL.geoUtils.makeLineString;
// import { Feature, FeatureCollection } from "@turf/helpers";
// const mapClient = require('@mapbox/mapbox-sdk');
// const directionsClient = require('@mapbox/mapbox-sdk/services/directions');
//
// MapboxGL.setWellKnownTileServer('Mapbox');
// MapboxGL.setAccessToken('pk.eyJ1IjoiemVzdHlwaW5nIiwiYSI6ImNqOG92YzQwbjA4enozOHAxbGszaTFnZXcifQ.rvhtAgbG5cdqaeVqDdgz5w');
// // pk.eyJ1IjoiemVzdHlwaW5nIiwiYSI6ImNqOG92YzQwbjA4enozOHAxbGszaTFnZXcifQ.rvhtAgbG5cdqaeVqDdgz5w
// mapClient({accessToken : 'pk.eyJ1IjoiemVzdHlwaW5nIiwiYSI6ImNqOG92YzQwbjA4enozOHAxbGszaTFnZXcifQ.rvhtAgbG5cdqaeVqDdgz5w'})
//   const  directionsClient1 = directionsClient(mapClient);
//
//  const App = () => {
//
//   // const [userLatitude, setUserLatitude ] = useState(0);
//   // const [userLongitude,setUserLongitude] = useState(0);
//   const [coordinates,setCoordinates] =  useState([{}])
//   // const [check,setUserCheck] = useState(true);
//   const [route,setRoute] = useState(null);
//    const [userLocation,setUserLocation] =  useState<number[]>([] )
//
//
// useEffect(()=>{
//
//     Geolocation.getCurrentPosition(
//       position => {
//           setUserLocation(  [position.coords.longitude ,position.coords.latitude])
//           setCoordinates(coordinates.concat({
//             latitude  :  position.coords.latitude,
//             longitude :  position.coords.longitude
//           }));
//       },
//       error => {
//         Alert.alert(error.message.toString());
//       },
//       {
//         showLocationDialog: true,
//         enableHighAccuracy: true,
//         timeout: 20000,
//         maximumAge: 0,
//       },
//     );
//
//     Geolocation.watchPosition(
//       position => {
//         setCoordinates(coordinates.concat({
//           latitude  :  position.coords.latitude,
//           longitude :  position.coords.longitude
//         }))
//       },
//       error => {
//         console.log(error);
//       },
//       {
//         showLocationDialog: true,
//         enableHighAccuracy: true,
//         timeout: 20000,
//         maximumAge: 0,
//         distanceFilter: 0,
//       },
//     );
//
// },[]);
//
//
//   const fetchRoute = async () => {
//     const reqOptions = {
//       waypoints: [
//       coordinates
//       ],
//       profile: 'driving-traffic',
//       geometries: 'geojson',
//     };
//
//     const res = await directionsClient1.getDirections(reqOptions).send();
//
//     const newRoute = makeLineString(res.body.routes[0].geometry.coordinates);
//     setRoute(newRoute);
//   };
//
//
//
//   return (
//     <View style={styles.page}>
//       <View style={styles.container}>
//         <MapboxGL.MapView style={styles.map} zoomEnabled={true} logoEnabled={true}   >
//
//           <MapboxGL.Camera followUserLocation={true} centerCoordinate={userLocation} />
//
//           <MapboxGL.UserLocation
//             // onUpdate={ location =>
//             //    setUserLocation([location.coords.longitude,location.coords.latitude])
//               // if(check) {
//               //   setUserLongitude(location.coords.longitude);
//               //   setUserLatitude(location.coords.latitude);
//               //   setUserCheck(false);
//               // }
//
//
//
//             />
//
//
//           {route &&
//             <MapboxGL.ShapeSource id='shapeSource' shape={route}>
//               <MapboxGL.LineLayer id='lineLayer' style={{ lineWidth: 5, lineJoin: 'bevel', lineColor: '#ff0000' }} />
//             </MapboxGL.ShapeSource>
//           }
//
//         </MapboxGL.MapView>
//       </View>
//     </View>
//   );
// }
//
// export default App;
//
// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     height: '100%',
//     width: '100%',
//   },
//   map: {
//     flex: 1
//   },
//
//
//
// });
