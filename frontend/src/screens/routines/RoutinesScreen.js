import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import client from '../../api/client';
import Button from '../../components/Button';

const RoutineItem = ({ item, theme, onDelete }) => {
    return (
        <View style={[styles.routineCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.headerRow}>
                <Text style={[styles.routineTitle, { color: theme.text }]}>
                    {item.name}
                </Text>
                <TouchableOpacity
                    onPress={() => onDelete(item._id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                >
                    <Text style={{ color: theme.error, fontSize: 14 }}>Remove</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.habitsContainer}>
                {item.habits && item.habits.length > 0 ? (
                    item.habits.map((habit, index) => (
                        <Text key={habit._id || index} style={{ color: theme.textSecondary, fontSize: 13, marginRight: 8 }}>
                            • {habit.name}
                        </Text>
                    ))
                ) : (
                    <Text style={{ color: theme.textSecondary, fontSize: 12, fontStyle: 'italic' }}>
                        No habits linked
                    </Text>
                )}
            </View>
        </View>
    );
};

const RoutinesScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const [routinesList, setRoutinesList] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errMessage, setErrMessage] = useState(null);

    const fetchRoutines = async () => {
        setIsRefreshing(true);
        setErrMessage(null);

        try {
            const response = await client.get('/routines');
            setRoutinesList(response.data);
        } catch (error) {
            console.error("API Error:", error);
            setErrMessage("Couldn't load routines. Try again?");
        } finally {
            setIsRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRoutines();

            return () => {
            };
        }, [])
    );

    const handleRemoveRoutine = (routineId) => {
        Alert.alert(
            "Delete Routine",
            "This action cannot be undone. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await client.delete(`/routines/${routineId}`);
                            fetchRoutines();
                        } catch (e) {
                            Alert.alert("Error", "Failed to delete routine.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.topBar}>
                <Text style={[styles.screenTitle, { color: theme.text }]}>My Routines</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddRoutine')}>
                    <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>
                        + New
                    </Text>
                </TouchableOpacity>
            </View>

            {errMessage && (
                <View style={{ padding: 10, backgroundColor: '#ffebee' }}>
                    <Text style={{ color: '#c62828', textAlign: 'center' }}>{errMessage}</Text>
                </View>
            )}

            <FlatList
                data={routinesList}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <RoutineItem
                        item={item}
                        theme={theme}
                        onDelete={handleRemoveRoutine}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={fetchRoutines}
                        tintColor={theme.primary}
                    />
                }
                ListEmptyComponent={
                    !isRefreshing && (
                        <View style={styles.emptyState}>
                            <Text style={{ color: theme.textSecondary, marginBottom: 10 }}>
                                You haven't created any routines yet.
                            </Text>
                            <Button
                                title="Create Your First Routine"
                                onPress={() => navigation.navigate('AddRoutine')}
                                type="outline"
                            />
                        </View>
                    )
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20, 
        paddingBottom: 10,
    },
    screenTitle: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100, 
    },
    routineCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    routineTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    habitsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    emptyState: {
        marginTop: 60,
        alignItems: 'center',
        paddingHorizontal: 40,
    }
});

export default RoutinesScreen;
