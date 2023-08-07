import { create } from "zustand";
import * as Location from "expo-location";

type LocationStore = {
  location: Location.LocationObject | null;
  updateLocation: () => Promise<Location.LocationPermissionResponse>;
};

function delay(timeInMilliseconds: number) {
  return new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), timeInMilliseconds);
  });
}

const useLocationStore = create<LocationStore>()((set) => ({
  location: null,
  updateLocation: async () => {
    const response = await Location.requestForegroundPermissionsAsync();

    if (response.granted) {
      // https://github.com/expo/expo/issues/10756
      let location: Location.LocationObject | null = null;
      let locationError: Error | null = null;
      let tries = 0;
      do {
        try {
          location = await Promise.race([
            delay(5000),
            Location.getCurrentPositionAsync(),
          ]);
          if (!location) {
            throw new Error("Timeout");
          }
        } catch (err) {
          locationError = err as Error;
        }
      } while (!location && tries++ < 4);
      if (!location) {
        throw locationError;
      }

      set({ location });
    }

    return response;
  },
}));

export default useLocationStore;
