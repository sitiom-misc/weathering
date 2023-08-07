import {
  Appbar,
  BottomNavigation,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  BottomTabHeaderProps,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { BackHandler, ToastAndroid, useColorScheme } from "react-native";
import { getHeaderTitle } from "@react-navigation/elements";
import { mutate } from "swr";
import { endpoints } from "@/api/openWeatherApi";
import { Tabs } from "expo-router/tabs";
import { CommonActions } from "@react-navigation/native";
import { useEffect } from "react";
import useLocationStore from "@/store/useLocationStore";
import { SplashScreen } from "expo-router";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

function MaterialNavigationBar({ route, options }: BottomTabHeaderProps) {
  const title = getHeaderTitle(options, route.name);
  const { updateLocation } = useLocationStore();

  return (
    <Appbar.Header elevated={true}>
      <Appbar.Content title={title} />
      <Appbar.Action
        icon="map-marker-outline"
        onPress={async () => {
          ToastAndroid.show("Updating location...", ToastAndroid.SHORT);
          const { granted } = await updateLocation();
          if (!granted) {
            ToastAndroid.show(
              "Permission was denied. The Location permission is required to provide you with local weather informtion.",
              ToastAndroid.LONG
            );
          }
        }}
      />
      <Appbar.Action icon="refresh" onPress={() => mutate(endpoints.weather)} />
    </Appbar.Header>
  );
}

function MaterialTabBar({
  navigation,
  state,
  descriptors,
  insets,
}: BottomTabBarProps) {
  return (
    <BottomNavigation.Bar
      navigationState={{
        ...state,
        routes: state.routes.filter(
          (route) => route.name !== "_sitemap" && route.name !== "[...404]"
        ),
      }}
      safeAreaInsets={insets}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];
        if (options.tabBarIcon) {
          return options.tabBarIcon({ focused, color, size: 24 });
        }

        return null;
      }}
      getLabelText={({ route }) => {
        route.name;
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : // @ts-ignore
              route.title;

        return label;
      }}
    />
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { location, updateLocation } = useLocationStore();

  useEffect(() => {
    (async () => {
      const { granted } = await updateLocation();
      if (granted) {
        SplashScreen.hideAsync();
      } else {
        ToastAndroid.show(
          "Permission was denied. The Location permission is required to provide you with local weather informtion.",
          ToastAndroid.LONG
        );
        BackHandler.exitApp();
      }
    })();
  }, []);

  if (!location) {
    return null;
  }

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
        <Tabs
          screenOptions={{
            header: (props) => <MaterialNavigationBar {...props} />,
          }}
          tabBar={(props) => <MaterialTabBar {...props} />}
        >
          <Tabs.Screen
            name="index"
            options={{
              headerTitle: "Current Weather",
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size, focused }) => {
                return (
                  <Icon
                    name={focused ? "home" : "home-outline"}
                    size={size}
                    color={color}
                  />
                );
              },
            }}
          />
          <Tabs.Screen
            name="forecast"
            options={{
              headerTitle: "5-day Forecast",
              tabBarLabel: "Forecast",
              tabBarIcon: ({ color, size }) => {
                return (
                  <Icon
                    name="weather-partly-cloudy"
                    size={size}
                    color={color}
                  />
                );
              },
            }}
          />
        </Tabs>
      </ThemeProvider>
    </PaperProvider>
  );
}
