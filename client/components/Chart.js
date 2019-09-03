import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis, VictoryTooltip, VictoryLabel } from "victory-native";

const days = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];
const months = [ 'J', 'F', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function Chart(props) {
        let now = new Date();
        let rawData = props.data.map(d => {
            if (typeof(d.date) === "string") {
                d.date = new Date(d.date + 'T00:00:00Z');
            }
            return d;
        });
        let barData = [];
        const period = props.period || 'week';
        const numberOfBars = period === 'week' ? 7 : 12;

        for(let i = numberOfBars; i > 0; i--) {
            let iStart = new Date();
            iStart.setHours(0);
            iStart.setMinutes(0);

            if (period === 'month') {
                iStart.setMonth(now.getMonth() - 1);
                iStart.setDate(1);
            } else {
                iStart.setDate(now.getDate() + (8 - iStart.getDay())); // set to Sunday
                iStart.setDate(iStart.getDate() - i);
            }

            let iEnd = new Date(iStart);
            if (period === 'month') {
                iEnd.setMonth(iStart.getMonth() + 1);
            } else {
                iEnd.setDate(iStart.getDate() + 1);
            }

            let total = 0;
            rawData.forEach(d => {
                if (d.date >= iStart && d.date < iEnd) {
                    total += d.total
                }
            });

            barData.push({x: iStart, y: total });
            iStart = iEnd
        }

        return (
            <View>
                <VictoryChart
                    theme={VictoryTheme.material}
                    animate={{
                        duration: 400,
                        onLoad: { duration: 400 }
                    }}
                    height={220}
                    padding={{ top: 20, bottom: 40, left: 0, right: 40 }}
                    domainPadding={10}
                style={{paddingLeft: 0}}>
                    <VictoryAxis tickValues={barData.map(v => v.x)} tickFormat={d => days[d.getDay()]} />
                    <VictoryBar data={barData} labels={({ datum }) => datum.y > 0 ? String(Math.round(datum.y)) : ''} />
                </VictoryChart>
            </View>
        )
}

const styles = StyleSheet.create({

});
