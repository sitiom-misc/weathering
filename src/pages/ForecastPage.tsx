import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import useSWR, { mutate } from "swr";
import {
  endpoints,
  getCurrentWeather,
  getForecast,
} from "../api/openWeatherApi";
import { refresh } from "ionicons/icons";

const ForecastPage = () => {
  const {
    data: currentWeather,
    error: weatherError,
    isLoading: isWeatherLoading,
    isValidating: isWeatherValidating,
  } = useSWR(endpoints.weather, getCurrentWeather);
  const {
    data: forecast,
    error: forecastError,
    isLoading: isForecastLoading,
    isValidating: isForecastValidating,
  } = useSWR(endpoints.forecast, getForecast);
  const isLoading = isWeatherLoading || isForecastLoading;
  const isValidating = isWeatherValidating || isForecastValidating;

  let forecastList: React.ReactNode;
  if (isLoading) {
    forecastList = <div>Loading...</div>;
  } else if (forecastError || !forecast) {
    forecastList = <div>Something went wrong</div>;
  } else {
    forecastList = (
      <IonList>
        {forecast.list.map((forecastItem, index) => (
          <IonItem key={index}>
            <IonLabel>
              <div className="flex justify-between">
                <div className="font-semibold">
                  {new Date(forecastItem.dt * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    weekday: "short",
                  })}
                </div>
                <div>{forecastItem.main.temp} °C</div>
              </div>
              <div className="flex justify-between">
                <div className="first-letter:capitalize">
                  {forecastItem.weather[0].description}
                </div>
                <div>Wind: {forecastItem.wind.speed} m/s</div>
              </div>
            </IonLabel>
            <img
              src={`https://openweathermap.org/img/wn/${forecastItem.weather[0].icon}@4x.png`}
              alt="Weather icon"
              className="h-14 w-14"
            />
          </IonItem>
        ))}
      </IonList>
    );
  }

  return (
    <IonPage>
      <IonContent>
        <IonToolbar>
          <IonTitle>
            {currentWeather === undefined
              ? "Current Weather"
              : `${currentWeather.name}, ${currentWeather.sys.country}`}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                console.log("Refreshing data");
                mutate(endpoints.weather);
                mutate(endpoints.forecast);
              }}
            >
              <IonIcon slot="icon-only" icon={refresh} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {weatherError || !currentWeather ? (
                <div>Something went wrong</div>
              ) : (
                <div className="flex justify-center p-5">
                  <div>
                    <h1 className="text-4xl">{currentWeather.main.temp} °C</h1>
                    <div className="first-letter:capitalize">
                      {currentWeather.weather[0].description}{" "}
                      {currentWeather.rain &&
                        `(${currentWeather.rain["1h"]} mm)`}
                    </div>
                    <div>Wind: {currentWeather.wind.speed} m/s</div>
                    <div>Pressure: {currentWeather.main.pressure} hPa/mBar</div>
                    <div>Humidity: {currentWeather.main.humidity} %</div>
                    <div>
                      Sunrise:{" "}
                      {new Date(
                        currentWeather.sys.sunrise * 1000,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div>
                      Sunset:{" "}
                      {new Date(
                        currentWeather.sys.sunset * 1000,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                    alt="Current weather icon"
                    className="h-40 w-40"
                  />
                </div>
              )}
            </div>
          )}
        </IonToolbar>
        <IonToolbar className="sticky top-0 shadow-md">
          <IonSegment value="5days3hour">
            <IonSegmentButton value="5days3hour">
              <IonLabel>5 days / 3 hour</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        <IonLoading isOpen={isLoading || isValidating} message="Loading..." />
        {forecastList}
      </IonContent>
    </IonPage>
  );
};

export default ForecastPage;
