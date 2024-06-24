import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import * as d3Scale from 'd3-scale';

const WeeklyStepsChart = ({ weeklySteps }) => {
    const chartWidth = Dimensions.get('window').width - 40;
    const chartHeight = 150;
    const barWidth = (chartWidth - (weeklySteps.length - 1) * 15) / weeklySteps.length;
    const maxValue = Math.max(...weeklySteps);
    const yScale = d3Scale.scaleLinear().domain([0, maxValue]).range([0, chartHeight]);

    const barSpacing = 13;


    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Steps Taken Last 7 Days</Text>
            <Svg width={chartWidth} height={chartHeight + 20}>
                {weeklySteps.map((steps, index) => (
                    <React.Fragment key={index}>
                        {/* Chart */}
                        <Rect
                            key={index}
                            x={index * (barWidth + barSpacing)}
                            y={chartHeight - yScale(steps)}
                            width={barWidth}
                            height={yScale(steps)}
                            fill="#EE0F55"
                        />
                        {/* Text */}
                        <SvgText
                            x={index * (barWidth + barSpacing) + barWidth / 2}
                            y={chartHeight + 20} // Position below the bars
                            fill="#AFB3BE"
                            fontSize="14"
                            textAnchor="middle"
                        >
                            {steps}
                        </SvgText>
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
