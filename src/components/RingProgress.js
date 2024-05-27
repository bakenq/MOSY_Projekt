import { View, Text } from 'react-native';
import SVG, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const color = '#EE0F55';

const RingProgress = ({ radius = 125, strokeWidth = 35, progress }) => {

    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;

    const isFocused = useIsFocused();
    const fill = useSharedValue(0);

    useEffect(() => {
        if (isFocused) {
            fill.value = withTiming(progress, { duration: 1000 });
        } else {
            fill.value = 0; // Animation plays again after switching Tabs, idk if we want this
        }
    }, [isFocused, progress]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDasharray: [circumference * fill.value, circumference],
    }));


    const circleDefaultProps = {
        r: innerRadius,
        cx: radius,
        cy: radius,
        originX: radius,
        originY: radius,
        fill: 'transparent',
        strokeWidth: strokeWidth,
        stroke: color,
        strokeLinecap: 'round',
        rotation: '-90',
    };

    return (
        <View style={{ width: radius * 2, height: radius * 2, alignSelf: 'center', }}>
            <SVG>
                {/* Background Ring */}
                <Circle
                    {...circleDefaultProps}
                    opacity={0.25}
                />
                {/* Foreground Ring */}
                <AnimatedCircle
                    animatedProps={animatedProps}
                    {...circleDefaultProps}
                />
            </SVG>
            <AntDesign
                name="arrowright"
                size={strokeWidth * 0.8}
                color="black"
                style={{ position: 'absolute', alignSelf: 'center', top: strokeWidth * 0.1 }}
            />
        </View>
    );
};

export default RingProgress;