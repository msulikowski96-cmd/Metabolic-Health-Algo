import React from 'react';
import { View } from 'react-native';
import { CgBandage } from 'react-icons/cg';
import { LineChart } from 'react-native-svg-charts';

const MeasurementChart = ({ weightData, bmiData, bodyFatData }) => {
    // Define data for the chart
    const weightPoints = weightData.map(data => data.weight);
    const bmiPoints = bmiData.map(data => data.bmi);
    const bodyFatPoints = bodyFatData.map(data => data.bodyFat);

    return (
        <View>
            <LineChart
                style={{ height: 200 }}
                data={weightPoints}
                svg={{ stroke: 'blue' }}
                contentInset={{ top: 20, bottom: 20 }}
            />
            <LineChart
                style={{ height: 200 }}
                data={bmiPoints}
                svg={{ stroke: 'green' }}
                contentInset={{ top: 20, bottom: 20 }}
            />
            <LineChart
                style={{ height: 200 }}
                data={bodyFatPoints}
                svg={{ stroke: 'red' }}
                contentInset={{ top: 20, bottom: 20 }}
            />
        </View>
    );
};

export default MeasurementChart;
