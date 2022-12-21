export async function CreateSign(rnBiometrics,payload){
  const rs = await rnBiometrics.createSignature({
    promptMessage: "Sign in",
    payload: payload,
  });
  console.log(rs);
  return rs;

}
