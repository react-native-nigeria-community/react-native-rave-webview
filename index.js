/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {useState,useEffect,forwardRef,useImperativeHandle,} from "react";
import {Modal,Text,View,SafeAreaView,} from "react-native";
import { WebView } from "react-native-webview";
import { Indicator, Button } from "./componet";
import {verifyPayment} from './api';
  
  function Rave(props, ref) {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
      autoStartCheck();
    }, []);
  
    const autoStartCheck = () => {
      if (props.autoStart) {
        setModalVisible(true);
      }
    };
  
    useImperativeHandle(ref, () => ({
      StartTransaction() {
        setModalVisible(true);
      },
    }));
  
    const RaveWeb = `   
    <!DOCTYPE html>
    <html lang="en">
            <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <!-- Latest compiled and minified CSS -->
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                    <!-- Fonts -->
                    <link rel="dns-prefetch" href="//fonts.gstatic.com">
                    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
                    <title>Fund Wallet</title>
            </head>
            <body  onload="payWithRave()" style="background-color:#fff;height:100vh ">
            <form>
              <script src="https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>
             </form>
        <script>
            window.onload = payWithRave;
            function payWithRave() {
                var x = getpaidSetup({
                    PBFPubKey: "${props.publicKey}",
                    customer_email: "${props.email}",
                    amount: ${props.amount},
                    customer_phone: "${props.phone}",
                    currency: "NGN",
                    txref: "${props.txref}",
                    meta: [{
                        metaname: "${"names"}",
                        metavalue: "${props.name}"
                    }],
                    onclose: function() {
                      var resp = {event:'cancelled'};
                      window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                    },
                    callback: function(response) {
                        var txref = response.tx.txRef; 
                         if (
                            response.tx.chargeResponseCode == "00" ||
                            response.tx.chargeResponseCode == "0"
                        ) {
                              var resp = {event:'successful', transactionRef:txref};
                              window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                        } else {
                          var resp = {event:'error'};
                          window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                        }
                        x.close(); 
                    }
                });
            }
        </script>
            </body>
    </html>`;
  
    const messageRecived =async (data) => {
      var webResponse = JSON.parse(data);
      switch (webResponse.event) {
        case "cancelled":
            {
                try {
                    setModalVisible(false),
                    console.log(`Cancelled the Transaction of ${props.amount}`),
                    props.onCancel({"error":"Transaction was cancelled"});
                } catch (error) {console.log(error)}
            }
          break;
  
        case "successful":{
            try {
                setModalVisible(false);
                const txref = webResponse.transactionRef;
                const SECKEY=props.SecretKey;
                const veri = {txref,SECKEY}
                const verifyP = await verifyPayment(veri);
                if (verifyP.data.status === "successful" && verifyP.data.chargecode == "00") return props.onSuccess({status: verifyP.status,message:verifyP.message,data: verifyP.data,deposit:verifyP.data.amountsettledforthistransaction,cardDetails: verifyP.data.account,})
                props.onVerifyingError({"error":"Error in verifying user payment, However, user may bill"});
            } catch (error) {console.log(error)}
        }
          break;
  
        default:
          setModalVisible(false);
          props.onCancel({"error":"Transaction was cancelled"});
          break;
      }
    };
  
    return (
      <SafeAreaView style={[{ flex: 1 }, props.SafeAreaViewContainer]}>
        <Modal
          style={[{ flex: 1 }]}
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={()=>setModalVisible(false)}
        >
          <SafeAreaView style={[{ flex: 1 }, props.SafeAreaViewContainerModal]}>
            <WebView
              style={[{ flex: 1 }]}
              source={{ html: RaveWeb }}
              onMessage={e => { messageRecived(e.nativeEvent.data);}}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
            {
                 loading && <Indicator />
            }
       </SafeAreaView>
        </Modal>
        {
            props.showPayButton && props.showPayButton ? 
            <View style={[{justifyContent:'flex-end',alignItems:'flex-end',}]}>
                <Button title={props.buttonText} color={props.color} onPress={()=>setModalVisible(true)} loading={loading} />
            </View> 
        :<>
        <Indicator />
        <Text style={[{fontSize:14, fontWeight:'bold', marginBottom:5,color:'#EDB107'},]}> Verifying your Transaction, wait a momment</Text>
        </>
        }
      </SafeAreaView>
    );
  }
  
  export default forwardRef(Rave);
  
  Rave.defaultProps = {
    buttonText: "Pay Now",
    color:'#EDB107',
    amount: 10,
    autoStart: false,
    showPayButton: true,
    currency: "NGN",
    buttonView:{justifyContent:'flex-end',alignItems:'flex-end'}
  };
