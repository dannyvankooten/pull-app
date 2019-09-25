import React from 'react';
import {
    View,
    StyleSheet,
	Text
} from 'react-native';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from "victory-native";

const days = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];
const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Chart(props) {
        let now = new Date();
        let rawData = props.data;
        let barData = [];
        const per = props.groupBy || 'week';
        const numberOfBars = 12;

        for(let i = numberOfBars; i > 0; i--) {
            let iStart = new Date();
            iStart.setHours(0, 0, 0);

            if (per === 'day') {
				iStart.setDate(now.getDate() + (8 - iStart.getDay()) + (props.dateOffset * numberOfBars) - i);
            } else if (per === 'week') {
				iStart.setDate(now.getDate() + (8 - iStart.getDay()) + (props.dateOffset * 7 * numberOfBars) - i * 7);
			} else if (per === 'month') {
				iStart.setDate(1);
				iStart.setMonth(now.getMonth() + ( props.dateOffset * numberOfBars ) - i);
            }

            let iEnd = new Date(iStart);
            if (per === 'day') {
				iEnd.setDate(iStart.getDate() + 1);
			} else if(per === 'week') {
            	iEnd.setDate(iStart.getDate() + 7);
            } else if(per === 'month') {
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
        	day: (d, i) => {
                if (i % 3 !== 0 && i !== numberOfBars-1) {
                    return '';
                }

                if (i === 0) {
                    return monthNames[d.getMonth()] + " " + d.getDate() + "\n" + d.getFullYear();;
                }

                return monthNames[d.getMonth()] + " " + d.getDate();
            },
			week: (d, i) => {
                if (i % 4 !== 0) {
                    return '';
                }

                if (i === 0 || i === numberOfBars-1) {
                    return monthNames[d.getMonth()] + "\n" + d.getFullYear();
                }

                return monthNames[d.getMonth()];
            },
			month: (d, i) => {
                if (i % 3 !== 0 && i !== numberOfBars-1) {
                    return '';
                }

                if (i === 0 || i === numberOfBars-1) {
                    return monthNames[d.getMonth()] + "\n" + d.getFullYear();
                }

                return monthNames[d.getMonth()];
            },
		};

        return (
            <View>
                <VictoryChart
                    theme={VictoryTheme.material}
                    animate={{
                        duration: 200,
                        onLoad: { duration: 200 }
                    }}
                    height={200}
                    padding={{ top: 20, bottom: 40, left: 10, right: 40 }}
                    domainPadding={10}>
                    <VictoryAxis tickValues={barData.map(v => v.x)} tickFormat={tickFormatters[per]} />
                    <VictoryBar data={barData} labels={({ datum }) => datum.y > 0 ? String(Math.round(datum.y)) : ''} barRatio={1} />
                </VictoryChart>
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
