import { endpoints, getCurrentWeather } from "@/api/openWeatherApi";
import {
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  RefreshControl,
  ToastAndroid,
  View,
} from "react-native";
import {
  ActivityIndicator,
  DataTable,
  Surface,
  Text,
} from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useSWR, { mutate } from "swr";
import useLocationStore from "@/store/useLocationStore";

type WeatherData = {
  icon: keyof typeof Icon.glyphMap;
  title: string;
  value: string | number | undefined;
};

export default function MainScreen() {
  const { location } = useLocationStore();

  if (!location) {
    return null;
  }

  const {
    data: currentWeather,
    isLoading: isWeatherLoading,
    isValidating: isWeatherValidating,
  } = useSWR(endpoints.weather, () =>
    getCurrentWeather(location.coords.latitude, location.coords.longitude)
  );

  const data: WeatherData[] = [
    {
      icon: "weather-windy",
      title: "Wind",
      value: `${currentWeather?.wind.speed} m/s`,
    },
    {
      icon: "speedometer",
      title: "Pressure",
      value: `${currentWeather?.main.pressure} hPa/mBar`,
    },
    {
      icon: "water-percent",
      title: "Humidity",
      value: `${currentWeather?.main.humidity} %`,
    },
    {
      icon: "weather-sunset-up",
      title: "Sunrise",
      value:
        currentWeather &&
        new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      icon: "weather-sunset-down",
      title: "Sunset",
      value:
        currentWeather &&
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <ImageBackground
      source={require("@/assets/images/makati-city.jpg")}
      style={styles.backgroundContainer}
      imageStyle={styles.imageBackground}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isWeatherValidating}
            onRefresh={() => mutate(endpoints.weather)}
          />
        }
      >
        {isWeatherLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          currentWeather && (
            <>
              <Text variant="headlineLarge">
                {currentWeather.name}, {currentWeather.sys.country}
              </Text>
              <Text variant="labelLarge">
                Last updated:{" "}
                {new Date(currentWeather.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>

              <Surface style={styles.cardContainer} elevation={4}>
                <View style={styles.tempContainer}>
                  <Image
                    source={{
                      uri: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`,
                    }}
                    style={{ width: 120, height: 100 }}
                  />
                  <Text variant="displaySmall">
                    {Math.round(currentWeather.main.temp)} °C
                  </Text>
                </View>
                <Text variant="titleMedium">
                  {currentWeather.weather[0].description
                    .charAt(0)
                    .toUpperCase() +
                    currentWeather.weather[0].description.slice(1)}
                </Text>
              </Surface>
              <DataTable style={{ paddingHorizontal: 15 }}>
                {data.map((item, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell style={{ flex: 0, marginRight: 15 }}>
                      <Icon name={item.icon} size={25} />
                    </DataTable.Cell>
                    <DataTable.Cell>{item.title}</DataTable.Cell>
                    <DataTable.Cell style={{ justifyContent: "flex-end" }}>
                      {item.value}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </>
          )
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  imageBackground: {
    opacity: 0.08,
  },
  cardContainer: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  tempContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  card: {
    width: "100%",
  },
});
