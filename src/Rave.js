import React,{useState,useEffect,forwardRef,useImperativeHandle,} from 'react';
import {SafeAreaView, Modal, Text, View, ActivityIndicator, Button } from 'react-native';
import {WebView} from 'react-native-webview';
import {verifyPayment} from './api'

function Rave(props, ref) {
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
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
    

    const htmlRave =`
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
            <body  onload="makePayment()" style="background-color:#fff;height:100vh ">
                <form>
                    <script src="https://checkout.flutterwave.com/v3.js"></script>
                </form>
                <script>
                    window.onload = makePayment();
                    function makePayment() {
                        FlutterwaveCheckout({
                        public_key: "${props.publicKey}",
                        tx_ref: "${props.txref}",
                        amount: "${props.amount}",
                        currency: "${props.currency}",
                        //payment_options: "card, bank, ussd",
                        meta:
                            {
                                consumer_id: 23,
                                consumer_mac: "92a3-912ba-1192a",
                                customer: {
                                    email: "${props.email}",
                                    phone_number: "${props.phone}",
                                    name: "${props.names}",
                                },
                            },
                        customer: {
                            email: "${props.email}",
                            phone_number: "${props.phone}",
                            name: "${props.names}",
                        },
                        callback: function (data) {
                            console.log(data);
                            var txid = data.transaction_id
                            var resp = {event:data.status, transactionRef:data, txid};
                            console.log(JSON.stringify(resp));
                            window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                        },
                        onclose: function() {
                            // close modal
                            var resp = {event:'cancelled'};
                            window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                        },
                        customizations: {
                            title: "${props.store}",
                            description: "${props.storeDetail}",
                            logo: "${props.logourl}",
                        },
                        });
                    }
                </script>
            </body>
    </html>`;

    const messageRecived =async (data) => {
        var webResponse = JSON.parse(data);
        console.log(JSON.stringify(webResponse));
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
            case "failed":
                {
                    try {
                        setModalVisible(false),
                        console.log(`Cancelled the Transaction of ${props.amount}`),
                        props.onFailed({"error":"Transaction was Failed", data:webResponse});
                    } catch (error) {console.log(error)}
                }
            break;
            case "successful":
                {
                    try {
                        setModalVisible(false);
                        setVerifying(true)
                        const ref = webResponse.txid;
                        const key =props.secretKey;
                        const verify = await verifyPayment(key,ref);
                        //console.log(JSON.stringify(verify));
                        if (verify.data.status === "successful" && verify.data.currency === props.currency){ 
                            setVerifying(false)
                            return props.onSuccess({data: verify.data, deposit:verify.data.amount_settled})
                        }else{
                            setVerifying(false)
                            return props.onVerifyingError({"error":"Error in verifying user payment, However, user may bill"});
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            break;
          default:
            setModalVisible(false);
            setVerifying(false)
            props.onCancel({"error":"Transaction errors"});
            break;
        }
    };
    return (
        <SafeAreaView style={{flex:1}}>
            <Modal
            style={{flex:1}}
            visible={modalVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={()=>setModalVisible(false)}
            >
                <SafeAreaView style={[{ flex: 1 }]}>
                    <WebView
                        source={{ html: htmlRave }}
                        onMessage={e => { messageRecived(e.nativeEvent.data);}}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                    />
                    {
                        loading && <ActivityIndicator size="large" color={props.color} />
                    }
                </SafeAreaView>
            </Modal>
            <View>
                {
                    verifying ? 
                    <View style={{flexDirection:'row'}}>
                        <Text> Wait!, Verifying your Transaction </Text> 
                        <ActivityIndicator size="large" color={props.color} />
                    </View>
                        : <Button title={props.buttonText} color="blue" onPress={()=>setModalVisible(true)} />
                }
                
            </View>
        </SafeAreaView>
    )
}

export default forwardRef(Rave);

Rave.defaultProps = {
    buttonText: "Pay Now",
    color:'#EDB107',
    amount: 10,
    autoStart: false,
    currency:"NGN",
};
