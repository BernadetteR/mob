import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Funktion für das Tab-Bar Icon
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome5>['name'];
    color: string;
}) {
    return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const customColor = '#02A382';

    // Farbe für das Icon (immer weiß)
    const iconColor = '#fff';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: customColor,
                headerStyle: {
                    backgroundColor: customColor,
                },
                headerTintColor: customColor,
                headerTitleStyle: {
                    fontWeight: 'regular',
                },
                headerShadowVisible: false,
                headerShown: useClientOnlyValue(false, true),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Recipe',
                    tabBarIcon: ({ color }) => <TabBarIcon name="utensils" color={color} />,
                    headerRight: () => (
                        <Link href="/About" asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome5
                                        name="info-circle"
                                        size={25}
                                        color={iconColor} // Immer weiß
                                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="surprise"
                options={{
                    title: 'Surprise',
                    tabBarIcon: ({ color }) => <TabBarIcon name="question" color={color} />,
                }}
            />
            <Tabs.Screen
                name="shops"
                options={{
                    title: 'Shops',
                    tabBarIcon: ({ color }) => <TabBarIcon name="map-marker-alt" color={color} />,
                }}
            />
            <Tabs.Screen
                name="like"
                options={{
                    title: 'Liked',
                    tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
                }}
            />
        </Tabs>
    );
}
