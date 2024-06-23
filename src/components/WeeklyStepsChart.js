import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import * as d3Scale from 'd3-scale';

const WeeklyStepsChart = ({ weeklySteps }) => {
    const chartWidth = Dimensions.get('window').width - 40;
    const chartHeight = 150;
    const barWidth = 20;
    const maxValue = Math.max(...weeklySteps);
    const yScale = d3Scale.scaleLinear().domain([0, maxValue]).range([0, chartHeight]);

    const barSpacing = 15;


    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Steps Taken Last 7 Days</Text>
            <Svg width={chartWidth} height={chartHeight}>
                {weeklySteps.map((steps, index) => (
                    <React.Fragment key={index}>
                        <Rect
                            key={index}
                            x={index * (chartWidth / weeklySteps.length)}
                            y={chartHeight - yScale(steps)}
                            width={chartWidth / weeklySteps.length - barSpacing}
                            height={yScale(steps)}
                            fill="#EE0F55"
                        />
                        {/*}
                        <SvgText
                            x={index * (chartWidth / weeklySteps.length) + (chartWidth / weeklySteps.length - barSpacing) / 2}
                            y={chartHeight - 5} // Adjust Y position for text alignment
                            fill="white"
                            color="white"
                            fontSize="14"
                            textAnchor="middle"
                        >
                            {steps}
                        </SvgText>
                        {*/}
                    </React.Fragment>
                ))}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: '#AFB3BE',
        borderWidth: 4,
        borderRadius: 15,
        padding: 12,
        marginBottom: 20,
    },
    chartTitle: {
        color: 'white',
        fontSize: 20,
        marginBottom: 10,
    },
});

export default WeeklyStepsChart;
