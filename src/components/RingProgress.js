import { View, Text } from 'react-native';
import SVG, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const color = '#EE0F55';

const RingProgress = ({ radius = 125, strokeWidth = 35, progress }) => {

    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;

    const fill = useSharedValue(0);

    useEffect(() => {
        fill.value = withTiming(progress, { duration: 1000});
    }, [progress]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDasharray: [circumference * fill.value, circumference],
    }));

    return (
        <View style={{ width: radius * 2, height: radius * 2, alignSelf: 'center', }}>
            <SVG>
                {/* Background Ring */}
                <Circle
                    r={innerRadius}
                    cx={radius}
                    cy={radius}
                    fill='transparent'
                    strokeWidth={strokeWidth}
                    stroke={color}
                    opacity={0.25}
                />
                {/* Foreground Ring */}
                <AnimatedCircle
                    animatedProps={animatedProps}
                    r={innerRadius}
                    cx={radius}
                    cy={radius}
                    originX={radius}
                    originY={radius}
                    fill='transparent'
                    strokeWidth={strokeWidth}
                    stroke={color}
                    strokeLinecap='round'
                    rotation='-90'
                />
            </SVG>
        </View>
    );
};

export default RingProgress;