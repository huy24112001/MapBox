import React, { useState } from "react";
import { View, StyleSheet, Alert, Text, Image } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { MapBoxBackEnd } from "./backend";


MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken('pk.eyJ1IjoiemVzdHlwaW5nIiwiYSI6ImNqOG92YzQwbjA4enozOHAxbGszaTFnZXcifQ.rvhtAgbG5cdqaeVqDdgz5w');
// pk.eyJ1IjoiemVzdHlwaW5nIiwiYSI6ImNqOG92YzQwbjA4enozOHAxbGszaTFnZXcifQ.rvhtAgbG5cdqaeVqDdgz5w



export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markListUser : [],
      coordinate_current :[],
      coordinates: [],
      route: {
        featureCollection: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates:  []
              },
            },
          ],
        }
      }

    };

  }




  render() {
const {route} = this.props;

    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}  logoEnabled={true}>

            <MapboxGL.Camera
              zoomLevel={1} followUserLocation={true} centerCoordinate={this.state.coordinate_current}
            />

            <MapboxGL.UserLocation  visible={true} showsUserHeadingIndicator={true} onUpdate={location => {
              // console.log(this.state.route.featureCollection.features[0].geometry.coordinates);
              this.setState({
                coordinate_current: [location.coords.longitude, location.coords.latitude],
                coordinates: this.state.coordinates.concat([[
                  location.coords.longitude,
                  location.coords.latitude
                ]]),
                route: {
                  featureCollection: {
                    type: "FeatureCollection",
                    features: [
                      {
                        type: "Feature",
                        properties: {},
                        geometry: {
                          type: "LineString",
                          coordinates: this.state.coordinates
                          ,
                        },
                      },
                    ],
                  }
                }

              });
              // console.log(route.params.ifUser)
              // console.log(this.state.route.featureCollection.features[0].geometry.coordinates);
                  fetch(MapBoxBackEnd + '/map',{
                    method: "POST",
                    body:  JSON.stringify({
                      "username" :route.params.ifUser.username,
                      "password" : route.params.ifUser.password,
                      "coordinate" : this.state.coordinate_current
                    })
                  })
                      .then((response) => response.json())
                      .then((data) => {
                               // console.log(data.results);
                                this.setState({markListUser : data.results })
                                // console.log(this.state.markListUser);
                          //

                          }
                      ).catch((error) => {
                          console.log('There has been a problem with your fetch operation: ' + error.message);
                      }
                  )

              // axios.get('http://192.168.0.104:3005/').then(function (response) {
              //    console.log(response.data)
              // }).catch(error => console.log(error));




            }

            }/>

            { this.state.markListUser &&
              this.state.markListUser.map((item) => {
               // console.log(item);
                return (
                  <MapboxGL.PointAnnotation title=''  key={item.fullname}  coordinate={item.coordinate}>


                    {/*<View style={{*/}
                    {/*  height: 20,*/}
                    {/*  width: 20,*/}
                    {/*  backgroundColor: '#244791',*/}
                    {/*  borderRadius: 40,*/}
                    {/*  borderColor: '#fff',*/}
                    {/*  borderWidth: 3*/}
                    {/*}} />*/}
                    <View style={{
                      height: 45,
                      width: 45,
                    }}>
                    <Image
                      style={{width:'100%',height:'100%'}}
                      source={require("./img/logo.png")}
                    />
                    </View>
                    <MapboxGL.Callout title={item.fullname} tipStyle={{borderTopColor:'#1de1db'}}
                                      contentStyle={{backgroundColor:'#1de1db',borderRadius:5,
                                        minWidth:60,minHeight:45,borderColor:'#797373'}}
                                      textStyle={{fontSize:13,padding:5 ,textAlign:'center',color:'black'}}
                    />


                </MapboxGL.PointAnnotation>
             )
            })}


            <MapboxGL.ShapeSource id='shapeSource' shape={this.state.route.featureCollection}>
              <MapboxGL.LineLayer id='lineLayer' style={{ lineWidth: 3, lineJoin: 'bevel', lineColor: '#a4963b' }} />
            </MapboxGL.ShapeSource>

          </MapboxGL.MapView>
        </View>
      </View>
    );
  }
}


  const styles = StyleSheet.create({
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      height: '100%',
      width: '100%',
    },
    map: {
      flex: 1
    },
    marker:{
      backgroundColor:'red'
    }



  });

// import React, { Component } from 'react';
// import { View } from 'react-native';
// import MapboxGL from '@rnmapbox/maps';
// import {lineString as makeLineString} from '@turf/helpers';
//
// const layerStyles = MapboxGL.StyleSheet.create({
//   progress: {
//     lineColor: '#314ccd',
//     lineWidth: 3,
//   },
// });
//
// export default class Map extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       recordedPath: [],
//       currentPoint: null,
//     };
//   }
//
//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <MapboxGL.MapView
//           showUserLocation={true}
//           userTrackingMode={MapboxGL.UserTrackingModes.Follow}
//           onUserLocationUpdate={this.onUserLocationUpdate}
//           styleURL={MapboxGL.StyleURL.Street}
//           zoomLevel={15}
//           style={{ flex: 1}}
//         >
//           {this.renderProgressLine()}
//         </MapboxGL.MapView>
//       </View>
//     );
//   }
//
//   onUserLocationUpdate = (e) => {
//     const { longitude, latitude } = e.coords;
//     this.setState({
//       currentPoint: [longitude, latitude],
//     })
//     console.log(JSON.stringify(e))
//   }
//
//   renderProgressLine = () => {
//     if (!this.state.currentPoint) {
//       return null;
//     }
//
//     const coords = this.state.recordedPath;
//     coords.push(this.state.currentPoint)
//
//     if (coords.length < 2) {
//       return null;
//     }
//
//     const lineString = makeLineString(coords);
//
//     return (
//       <MapboxGL.Animated.ShapeSource id="progressSource" shape={lineString}>
//         <MapboxGL.Animated.LineLayer
//           id="progressFill"
//           style={layerStyles.progress}
//         />
//       </MapboxGL.Animated.ShapeSource>
//     );
//   }
// }
