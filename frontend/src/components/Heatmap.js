import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { format, subDays } from 'date-fns';

const Heatmap = ({ data }) => {
    const { theme } = useTheme();

    // generate last 90 days or so
    const days = [];
    for (let i = 89; i >= 0; i--) {
        days.push(subDays(new Date(), i));
    }

    const getColor = (count) => {
        if (!count) return theme.surface; // empty
        if (count === 1) return 'rgba(74, 144, 226, 0.4)';
        if (count === 2) return 'rgba(74, 144, 226, 0.7)';
        return theme.primary; // 3 or more
    };

    return (
        <View style={styles.grid}>
            {days.map((d, i) => {
                const dateStr = format(d, 'yyyy-MM-dd');
                const count = data[dateStr] || 0;

                return (
                    <View
                        key={dateStr}
                        style={[
                            styles.cell,
                            {
                                backgroundColor: getColor(count),
                                borderColor: theme.border
                            }
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    cell: {
        width: 12,
        height: 12,
        margin: 2,
        borderRadius: 2,
        borderWidth: 0.5,
    }
});

export default Heatmap;
