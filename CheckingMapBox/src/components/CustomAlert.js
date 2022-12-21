import { Alert } from "react-native";


function CustomAlert(title, message){
Alert.alert(title , message, [
  { text: "OK" }
])
}
export default CustomAlert;
