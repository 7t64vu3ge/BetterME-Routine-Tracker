import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Button = ({ title, onPress, loading, type = 'primary', style }) => {
    const { theme } = useTheme();

    const isOutline = type === 'outline';
    const isText = type === 'text';

    // base styles
    const bg = isOutline || isText ? 'transparent' : theme.primary;
    const border = isOutline ? theme.primary : 'transparent';
    const txtColor = isOutline || isText ? theme.primary : '#FFF';

    return (
        <TouchableOpacity
            style={[
                styles.btn,
                {
                    backgroundColor: bg,
                    borderColor: border,
                    borderWidth: isOutline ? 1 : 0,
                    // hack to center text
                    justifyContent: 'center',
                    alignItems: 'center'
                },
                style
            ]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={txtColor} />
            ) : (
                <Text style={{ color: txtColor, fontSize: 16, fontWeight: '600' }}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: {
        padding: 12,
        borderRadius: 8,
        minHeight: 48
    }
});

export default Button;
