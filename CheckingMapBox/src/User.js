import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MapBoxBackEnd } from "./backend";
import DialogContainer from "react-native-dialog/lib/Container";
import DialogTitle from "react-native-dialog/lib/Title";
import DialogButton from "react-native-dialog/lib/Button";
import DialogDescription from "react-native-dialog/lib/Description";
import DialogInput from "react-native-dialog/lib/Input";
import { useFocusEffect } from "@react-navigation/native";
import CustomAlert from "./components/CustomAlert";
import axios from "axios";
import { CreateKey } from "./biometric/CreateKey";
import { CreateSign } from "./biometric/CreateSign";
import { sendKeyPublicServer } from "./constant/request";


function User({ route, navigation }) {
  let [show, setShow] = useState(false);
  let [user, setUser] = useState({ name: "", username: "", password: "" });
  let [isCreateKey, setIsCreateKey] = useState("false");
  let [isSave, setIsSave] = useState(false);
  let [dialogLogin, setDialogLogin] = useState(false);
  let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString();
  let payload = epochTimeSeconds + " some message";

  const removeItemValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      // Error retrieving data
      return false;
    }
  };

  const setDataStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDataStorage = async (key) => {
    try {
      let value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        if (!key.localeCompare("user")) {
          value = JSON.parse(value);
          console.log(value.fullname);
          setUser({ name: value.fullname, username: value.username, password: "" });
          setIsSave(true);
        } else
          setIsCreateKey(value);

      } else {
        console.log("Value Null");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useFocusEffect(React.useCallback(() => {
    getDataStorage("user").then(r => console.log("Get Value user"));
    getDataStorage("key").then(r => console.log("Get Value key"));
  }, []));



  function verifySignatureWithServer(s, p) {
    fetch(MapBoxBackEnd + "/biometrics", {
      method: "POST",
      body: JSON.stringify({ signature: s, payload: p, username: user.username }),
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data.results);
          if (!data.results.localeCompare("Verify Successfully")) {
            if (isCreateKey === "false") {
              console.log("false");
              setDialogLogin(true);
            } else
              navigation.navigate("Map", { ifUser: user });
          } else {

          }

        },
      ).catch((error) => {
        console.log("There has been a problem with your fetch operation: " + error.message);
      },
    );
  }

  async function HandlerBiometrics() {

    if (!isSave) {
      CustomAlert("Failed", "You must login to active biometric");
    } else {
        console.log("ELSE");

        const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

        rnBiometrics.isSensorAvailable()
          .then((resultObject) => {
            const { available, biometryType } = resultObject;

            if (available && biometryType === BiometryTypes.TouchID) {
              console.log("TouchID is supported");
            } else if (available && biometryType === BiometryTypes.FaceID) {
              console.log("FaceID is supported");
            } else if (available && biometryType === BiometryTypes.Biometrics) {
              console.log("Biometrics is supported");
            } else {
              console.log("Biometrics not supported");
            }
          });


        // Check User Register Biometrics
        if (isCreateKey === "false") {
          // console.log("create key");
          //     const keyPublic = CreateKey(rnBiometrics)
          // // rnBiometrics.createKeys()
          // //   .then((resultObject) => {
          // //     const { publicKey } = resultObject;
          // //     console.log(publicKey);
          //
          //     sendPublicKeyToServer(keyPublic);
          //
          //     rnBiometrics.createSignature({
          //       promptMessage: "Sign in",
          //       payload: payload,
          //     })
          //       .then((resultObject) => {
          //         const { success, signature, error } = resultObject;
          //         console.log(error + " huy");
          //         if (success) {
          //           // console.log(signature)
          //           // console.log(payload);
          //
          //         }
          //       });
          //
          //
          //   });
          console.log("create key");
          await CreateKey(rnBiometrics, user.username)
          const rs =  await CreateSign(rnBiometrics, payload)
          if(rs.success)
            verifySignatureWithServer(rs.signature, payload);

        } else {

          try {
            const rs =  await CreateSign(rnBiometrics, payload)
            if(rs.success)
              verifySignatureWithServer(rs.signature, payload);

          } catch (e) {
          console.error(e.message);

          if(e.message === "Error generating signature: Key permanently invalidated") {
            await CreateKey(rnBiometrics, user.username)
            const rs =  await CreateSign(rnBiometrics, payload)
            if(rs.success)
              verifySignatureWithServer(rs.signature, payload);

          }

        }
        }

    }
  }


  function HandlerLogin() {

    if (!user.username.localeCompare("") || !user.password.localeCompare("")) {
      CustomAlert("Login failed", "You have not entered your username or password");
    } else
      fetch(MapBoxBackEnd + "/login", {
        method: "POST",
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data.user);
            if (!data.results.localeCompare("Login Successfully")) {

              navigation.navigate("Map", { ifUser: user });
              setDataStorage("user", JSON.stringify(data.user)).then(r => console.log("OK"));
              if (dialogLogin) {
                setDataStorage("key", "true").then(r => console.log("Set Key true"));
                isCreateKey = "true";
              }
            } else {
              CustomAlert("Login Failed", "Incorrect username or password");
            }
          },
        ).catch((error) => {
          console.log("There has been a problem with your fetch operation: " + error.message);
        },
      );

  }

  function HandlerRegister() {

    if (!user.username.localeCompare("") || !user.password.localeCompare("")) {
      CustomAlert("Register Failed", "You have not entered your username or password");
    } else
      fetch(MapBoxBackEnd + "/register", {
        method: "POST",
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.results);
            // resdata = data.results;
            if (!data.results.localeCompare("Register Successfully")) {
              handleCancel();
              CustomAlert("Register Successfully ", "You have successfully registered");
            } else
              CustomAlert("Register Failed ", "Your username have already exist ");
          },
        ).catch((error) => {
          console.log("There has been a problem with your fetch operation: " + error.message);
        },
      );

  }

  function showSignUp() {
    setUser({ name: "", username: "", password: "" });
    setShow(true);
  }

  const handleCancel = () => {
    setShow(false);
  };
  const handleCancel1 = () => {
    setDialogLogin(false);
  };

  function SwitchLogin() {
    removeItemValue("user").then(r => {
        if (r) {
          setIsSave(false);
          setUser({ name: "", username: "", password: "" });
        }
      },
    );

    removeItemValue("key").then(r => {
        if (r) {
          setIsCreateKey("false");
          setDialogLogin(false);
        }
      },
    );

  }


  return <View style={styles.container}>

    <DialogContainer contentStyle={{ backgroundColor: "white", borderRadius: 6 }} visible={dialogLogin}>
      <DialogTitle style={{ color: "black" }}>Thong Bao</DialogTitle>
      <DialogDescription style={{ color: "black" }}>
        Quy khach vui long dang nhap de kich hoat tinh nang Biometrics
      </DialogDescription>

      <DialogInput style={{ color: "#4b4949" }} placeholder={"Username"} value={user.username}
                   onChangeText={(u) => setUser({ name: user.name, username: u, password: user.password })}
                   placeholderTextColor={"#8c8888"} />
      <DialogInput secureTextEntry={true} style={{ color: "#4b4949" }} placeholder={"Password"} value={user.password}
                   placeholderTextColor={"#8c8888"}
                   onChangeText={(p) => setUser({ name: user.name, username: user.username, password: p })} />

      <DialogButton style={{ color: "#151c94" }} label="Submit" onPress={HandlerLogin} />
      <DialogButton style={{ color: "#151c94" }} label="Cancel" onPress={handleCancel1} />
    </DialogContainer>


    <DialogContainer contentStyle={{ backgroundColor: "white", borderRadius: 6 }} visible={show}>
      <DialogTitle style={{ color: "black" }}>Register</DialogTitle>
      <DialogDescription style={{ color: "black" }}>
        Nhap thong tin de dang ky
      </DialogDescription>

      <DialogInput style={{ color: "#4b4949" }} placeholder={"FullName"} value={user.name}
                   onChangeText={(n) => setUser({ name: n, username: user.username, password: user.password })}
                   placeholderTextColor={"#8c8888"} />
      <DialogInput style={{ color: "#4b4949" }} placeholder={"Username"} value={user.username}
                   onChangeText={(u) => setUser({ name: user.name, username: u, password: user.password })}
                   placeholderTextColor={"#8c8888"} />
      <DialogInput secureTextEntry={true} style={{ color: "#4b4949" }} placeholder={"Password"} value={user.password}
                   placeholderTextColor={"#8c8888"}
                   onChangeText={(p) => setUser({ name: user.name, username: user.username, password: p })} />

      <DialogButton style={{ color: "#151c94" }} label="Submit" onPress={HandlerRegister} />
      <DialogButton style={{ color: "#151c94" }} label="Cancel" onPress={handleCancel} />
    </DialogContainer>


    {
      isSave ? <View style={styles.username1}><Text style={{ color: "black", textAlign: "center", fontSize: 18 }}>Welcome
          , {user.name}</Text>
          <TouchableOpacity style={styles.button2} underlayColor="#00331a" onPress={SwitchLogin}>
            <Text style={styles.buttonText1}>
              Login with other account
            </Text>
          </TouchableOpacity>
        </View> :
        <TextInput style={styles.username} placeholder={"Username"} value={user.username}
                   onChangeText={(u) => setUser({ name: user.name, username: u, password: user.password })}
                   placeholderTextColor={"#8c8888"} />
    }

    <TextInput style={styles.password} placeholder={"Password"} value={user.password} placeholderTextColor={"#8c8888"}
               onChangeText={(p) => setUser({ name: user.name, username: user.username, password: p })}
               secureTextEntry={true} />
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity style={styles.button} underlayColor="#00331a" onPress={HandlerLogin}>
        <Text style={styles.buttonText}>
          Sign in
        </Text>
      </TouchableOpacity>

      {!isSave ? <TouchableOpacity style={styles.button} underlayColor="red" onPress={showSignUp}>
        <Text style={styles.buttonText}>
          Sign Up
        </Text>
      </TouchableOpacity> : null}

      <TouchableOpacity style={styles.button1} underlayColor="#00331a" onPress={HandlerBiometrics}>
        <Image
          source={require("./img/Biometrics1.png")}
          style={{
            width: "100%",
            height: 30,
          }}
        />
      </TouchableOpacity>

    </View>
  </View>;
}

export default User;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  username: {
    color: "#212020",
    backgroundColor: "white",
    width: "60%",
    height: 40,
    borderWidth: 1,
    borderColor: "#464444",
    marginBottom: 10,
    borderRadius: 5,

  },
  username1: {
    color: "#212020",
    width: "60%",
    height: 40,
    marginBottom: 30,


  },

  password: {
    color: "#212020",
    backgroundColor: "white",
    width: "60%",
    height: 40,
    borderWidth: 1,
    borderColor: "#464444",
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    alignItems: "center",
    borderRadius: 6,
    paddingTop: 10,
    paddingBottom: 5,
    marginRight: 10,
    marginLeft: 5,
    marginTop: 10,
    backgroundColor: "#8fbee0",
    width: 80,
  },
  button1: {
    alignItems: "center",
    borderRadius: 6,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 10,
    marginLeft: 5,
    marginTop: 10,
    backgroundColor: "#8fbee0",
    width: 50,
  },
  buttonText: {
    color: "#262525",
    textAlign: "center",
    fontSize: 15,
  },
  buttonText1: {
    color: "#262525",
    textAlign: "center",
    fontSize: 13,
    textDecorationLine: "underline",
    marginTop: 5,
  },


});
