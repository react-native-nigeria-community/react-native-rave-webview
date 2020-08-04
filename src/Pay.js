import React, { Component } from 'react';
import { StyleSheet,View} from 'react-native';
import {Rave} from './';

export default class Pay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //FLWPUBK_TEST-SANDBOXDEMOKEY-X
      publicKey: 'FLWPUBK-f48d30e6fe40c056caf6b069a1a92a87-X',
      secretKey: 'FLWSECK-6ebb365cd77b2c708817fd15fafbf74e-X',
      error: false,
      loading: false,
    };
  }
  async onSuccess(data){
    console.log(JSON.stringify(data));
  }
  async onCancel(data) {
    console.log(JSON.stringify(data));
  }
  async onError(data) {
    console.log(JSON.stringify(data));
  }
  async onFailed(data) {
    console.log(JSON.stringify(data));
  }
  async onVerifyingError(data) {
    console.log(JSON.stringify(data));
  }
  getReference = () => {
    let text = '';
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=';
    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  render() {
    const {publicKey,secretKey} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.rave}>
            <Rave
                publicKey={publicKey}
                secretKey={secretKey}
                amount='100'
                email='abduljeleelng@gmail.com'
                names='Abduljeleel Ola'
                phone='08037358707'
                //store='Testing Store'
                //storeDetail='Store details'
                //logourl='https://reactjs.org/logo-og.png'
                txref={`Test-V3-${this.getReference()}`}
                onSuccess={(data) => this.onSuccess(data)}
                onCancel={(data) => this.onCancel(data)}
                onVerifyingError={(data) => this.onVerifyingError(data)}
                onError={(data) => this.onError(data)}
                onFailed={(data) => this.onFailed(data)}
                currency="NGN"
                buttonText="Make Payment"
            />
        </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rave:{
    flex:1,
  },
});

