

import { Animated, Easing } from 'react-native';



export const fadeIn = (fadeAnim) =>
{
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
    }).start();
};

export const fadeOut = () =>
{
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
    }).start();
};