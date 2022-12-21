
import { MapBoxBackEnd } from "../backend";

export function sendKeyPublicServer(username, pbKey){
  fetch(MapBoxBackEnd + "/publicKey", {
    method: "POST",
    body: JSON.stringify({
      "username": username,
      "publicKey": pbKey,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.results);
        /*  if(data.results.localeCompare("Account have not register biometrics"))
                  setIsBiometric(true);*/
      },
    ).catch((error) => {
      console.log("There has been a problem with your fetch operation: " + error.message);
    },
  );
}

