import { sendKeyPublicServer } from "../constant/request";

export async function  CreateKey(rnBiometrics,username){
  const rs = await rnBiometrics.createKeys()
  console.log(rs.publicKey);
  sendKeyPublicServer(username,rs.publicKey);

}
