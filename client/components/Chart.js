import React from 'react';
import {
    View,
    StyleSheet,
	Text
} from 'react-native';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from "victory-native";

const days = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];
const months = [ 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
        const numberOfBars = {week: 7, month: 5, year: 12}[period];

        for(let i = numberOfBars; i > 0; i--) {
            let iStart = new Date();
            iStart.setHours(0, 0, 0);

            if (period === 'week') {
				iStart.setDate(now.getDate() + (8 - iStart.getDay()) + (props.periodAgo * 7) - i);
            } else if (period === 'month') {
				iStart.setDate(now.getDate() + (8 - iStart.getDay()) + (props.periodAgo * 7 * 5) - i * 7);
			} else if (period === 'year') {
				iStart.setDate(1);
				iStart.setMonth(now.getMonth() + (12 - now.getMonth()) + ( props.periodAgo * 12 ) - i);
            }

            let iEnd = new Date(iStart);
            if (period === 'week') {
				iEnd.setDate(iStart.getDate() + 1);
			} else if(period === 'month') {
            	iEnd.setDate(iStart.getDate() + 7);
            } else if(period === 'year') {
				iEnd.setMonth(iStart.getMonth() + 1);
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


        const startDate = barData[0].x;
        const endDate = barData[barData.length-1].x;

        const tickFormatters = {
        	week: d => days[d.getDay()],
			month: d => '',
			year: d => months[d.getMonth()],
		};

        let subtitle;
        if (period === 'week') {
			subtitle = `${monthNames[startDate.getMonth()]} ${startDate.getDate()} - ${monthNames[endDate.getMonth()]} ${endDate.getDate()}`
		} else {
			subtitle = `${monthNames[startDate.getMonth()]} ${startDate.getDate()} - ${monthNames[endDate.getMonth()]} ${endDate.getDate()}, ${startDate.getFullYear()}`
		}

        return (
            <View>
                <VictoryChart
                    theme={VictoryTheme.material}
                    animate={{
                        duration: 200,
                        onLoad: { duration: 200 }
                    }}
                    height={200}
                    padding={{ top: 20, bottom: 40, left: 0, right: 40 }}
                    domainPadding={10}>
                    <VictoryAxis tickValues={barData.map(v => v.x)} tickFormat={tickFormatters[period]} />
                    <VictoryBar data={barData} labels={({ datum }) => datum.y > 0 ? String(Math.round(datum.y)) : ''} />
                </VictoryChart>
				<Text style={styles.muted}>{subtitle}</Text>
            </View>
        )
}

const styles = StyleSheet.create({
	muted: {
		color: '#AAA',
		fontSize: 12,
		textAlign: 'center'
	}
});
