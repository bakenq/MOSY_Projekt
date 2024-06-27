import { View, Text } from 'react-native';
import SVG, { Circle, SvgXml } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// Snail SVGs
import SnailSVG from '../../assets/SnailRed/Snail.svg';
import SnailHatSVG from '../../assets/SnailRed/Snail_Hat.svg';
import SnailTieSVG from '../../assets/SnailRed/Snail_Tie.svg';
import SnailHatTieSVG from '../../assets/SnailRed/Snail_Hat_Tie.svg';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const color = '#EE0F55';

const getSVGComponent = (level) => {
    if (level >= 1 && level <= 4) {
        return SnailSVG;
    } else if (level >= 5 && level <= 9) {
        return SnailHatSVG;
    } else if (level >= 10) {
        return SnailHatTieSVG;
    }
    // Add more ranges as needed
    return SnailSVG; // Default SVG if no range matches
};

const RingProgress = ({ radius = 125, strokeWidth = 35, progress, level }) => {

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

    // Get the SVG component based on the level
    const SelectedSVG = getSVGComponent(level);

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
            <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: radius * 2, height: radius * 2 }}>
                <SelectedSVG width={radius * 1.2} height={radius * 1.2} />
            </View>
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