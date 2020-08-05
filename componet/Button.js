import React from 'react';
import {StyleSheet,Text,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import PropsTypes from 'prop-types';
import Indicator from './Indicator'

Button.prototype={
    onPress:PropsTypes.func.isRequired,
    small:PropsTypes.bool.isRequired,
    title:PropsTypes.string.isRequired,
    color:PropsTypes.string.isRequired,
    loading:PropsTypes.bool.isRequired
};
Button.defaultProps={
    small:false,
    title:"Button 1",
    color:"#EDB107",
    onPress:(()=>console.log("Button is press")),
    loading:false,
    indicatorColor:"#EDB107",
    indicatorHeight:20,
    indicatorWidth:20,
}
export default function Button({title,color,onPress,small,loading, indicatorColor,indicatorWidth,indicatorHeight}){
    return(
        <>
        {
            loading ? (
                <TouchableWithoutFeedback
                style={[styles.button,{borderColor:color}]}
                disabled={loading}
                >
                    <Text 
                    style={[styles.buttonText, small ? styles.small : styles.large,{color}]}
                    >
                            <Indicator color={indicatorColor} width={indicatorWidth} height={indicatorHeight} />
                    </Text>
                </TouchableWithoutFeedback>
            ):(
                <TouchableOpacity
                onPress={onPress}
                style={[styles.button,{borderColor:color}]}
                >
                    <Text 
                    style={[styles.buttonText, small ? styles.small : styles.large,{color}]}
                    >
                        {title}
                    </Text>
                </TouchableOpacity>
            )
        }
        </>
    )
};

const styles = StyleSheet.create({
    button:{
        marginTop:10,
        minWidth:100,
        borderWidth:2,
        borderRadius:3,
    },
    small:{
        fontSize:12,
        padding:5,
    },
    large:{
        fontSize:14,
        padding:5,
    },
    buttonText:{
        textAlign:'center',
        fontWeight:'bold',
    }
});