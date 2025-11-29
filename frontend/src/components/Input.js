import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}) => {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={[styles.lbl, { color: theme.text }]}>{label}</Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lbl: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default Input;
