import { endpoints, getForecast } from "@/api/openWeatherApi";
import useLocationStore from "@/store/useLocationStore";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, Text, Divider } from "react-native-paper";
import useSWR, { mutate } from "swr";

export default function AboutScreen() {
  const { location } = useLocationStore();

  if (!location) {
    return null;
  }

  const {
    data: forecast,
    isLoading: isForecastLoading,
    isValidating: isForecastValidating,
  } = useSWR(endpoints.forecast, () =>
    getForecast(location.coords.latitude, location.coords.longitude)
  );

  return isForecastLoading ? (
    <ActivityIndicator size="large" style={styles.container} />
  ) : (
    forecast && (
      <FlatList
        data={forecast.list}
        renderItem={({ item }) => (
          <>
            <View style={styles.itemContainer}>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall">
                  {new Date(item.dt * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    weekday: "short",
                  })}
                </Text>
                <Text>
                  {item.weather[0].description.charAt(0).toUpperCase() +
                    item.weather[0].description.slice(1)}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text variant="titleSmall">{item.main.temp} °C</Text>
                <Text>Wind: {item.wind.speed} m/s</Text>
              </View>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
                }}
                style={{ width: 60, height: 60 }}
              />
            </View>
            <Divider />
          </>
        )}
        keyExtractor={(item) => item.dt_txt}
        refreshControl={
          <RefreshControl
            refreshing={isForecastValidating}
            onRefresh={() => mutate(endpoints.forecast)}
          />
        }
      />
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    paddingRight: 10,
  },
});
