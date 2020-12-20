/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Modal, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';  
import {WebView} from 'react-native-webview'
  
export default class Rave extends Component {
    constructor(props){
        super(props);
        this.state = {
           showModal:false,
         }
    }
  
Rave ={
      html:  `  
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
                      <title>SUBSCRIPTION</title>
              </head>
              <body  onload="payWithRave()" style="background-color:#fff;">
              <form>
                <script src="https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>
               </form>
          
          <script>
              const API_publicKey = "${this.props.raveKey}";
              window.onload = payWithRave;
              function payWithRave() {
                  var x = getpaidSetup({
                      PBFPubKey: API_publicKey,
                      customer_email: "${this.props.billingEmail}",
                      amount: ${this.props.amount},
                      customer_phone: "${this.props.billingMobile}",
                      currency: "${this.props.currency || 'NGN'}",
                      txref: "${this.props.txref}",
                      meta: [{
                          metaname: "${this.props.billingName}",
                          metavalue: "${this.props.billingMobile}"
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
      </html> 
      `
    }

    messageRecived=(data)=>{
          var webResponse = JSON.parse(data);
          switch(webResponse.event){
                case 'cancelled':
                    this.setState({showModal:false},()=>{
                      this.props.onCancel();
                   })    
                break;

                case 'successful':
                    this.setState({showModal:false},()=>{
                      this.props.onSuccess(webResponse.transactionRef);
                    })    
                break;
                
                default:
                    this.setState({showModal:false},()=>{
                      this.props.onError();
                   })    
                break;
          }
      }

render() {
    return (
      <View>
          <Modal 
              visible={this.state.showModal}
              animationType="slide"
              transparent={false}>
                  <WebView
                      javaScriptEnabled={true}
                      javaScriptEnabledAndroid={true}
                      originWhitelist={['*']}
                      ref={( webView ) => this.MyWebView = webView}
                      source={this.Rave}
                      onMessage={(e)=>{this.messageRecived(e.nativeEvent.data)}}
                      onLoadStart={()=>this.setState({isLoading:true})}
                      onLoadEnd={()=>this.setState({isLoading:false})}
                      scalesPageToFit={false}
                    />
                    {/*Start of Loading modal*/}
                      {
                          this.state.isLoading &&
                          <View>
                            <ActivityIndicator size="large" color={this.props.ActivityIndicatorColor} />
                          </View>
                        }
            </Modal>
             <TouchableOpacity style={this.props.btnStyles} onPress={()=> this.setState({showModal:true})}>
                <Text style={this.props.textStyles}  >{this.props.buttonText}</Text>
            </TouchableOpacity>
      </View>
    );
  }
}


Rave.defaultProps = {
  buttonText: "Pay Now",
  amount:10,
  ActivityIndicatorColor:'green'
}