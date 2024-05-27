import { View, Text } from 'react-native';
import SVG, { Circle } from 'react-native-svg';


const color = '#EE0F55';

const RingProgress = ({ radius = 125, strokeWidth = 35, progress }) => {

    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;

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
                <Circle
                    r={innerRadius}
                    cx={radius}
                    cy={radius}
                    originX={radius}
                    originY={radius}
                    fill='transparent'
                    strokeWidth={strokeWidth}
                    stroke={color}
                    strokeDasharray={[circumference * progress, circumference]}
                    strokeLinecap='round'
                    rotation='-90'
                    
                />
            </SVG>
        </View>
    );
};

export default RingProgress;