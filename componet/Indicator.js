import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import PropTypes from 'prop-types';

Indicator.propTypes = {
    size:PropTypes.string.isRequired,
    color:PropTypes.string.isRequired,
    animating:PropTypes.bool.isRequired,
    width:PropTypes.number.isRequired,
    height:PropTypes.number.isRequired,
};
Indicator.defaultProps = {
    size:'large',
    color:'#EDB107',
    animating:true,
    width:20,
    height:20,
};
/*customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
  */
    /*customProp:function(props,propName,Indicator){
        if(!/matchme/.test(props[propName])){
            return new Error(`Inavlid prop ${propName} supplied to ${Indicator} validation failed`);
        }
    },
    */

export default function Indicator({size,color,animating,width,height}) {
  return (
    <View style={[styles.container, styles.horizontal,{width,height}]}>
      <ActivityIndicator size={size} color={color} animating={animating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    margin:10,
    marginBottom:1,
  }
});