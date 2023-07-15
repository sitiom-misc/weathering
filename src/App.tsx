import { Route } from "react-router-dom";
import { setupIonicReact } from "@ionic/react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import ForecastPage from "./pages/ForecastPage";
import "@ionic/react/css/core.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "./theme/variables.css";

setupIonicReact();

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact component={ForecastPage} path="/" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
