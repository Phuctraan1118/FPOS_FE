import Routes from "./routes/Routes";
import { Provider } from "react-redux";
import { store } from "./states/store";
import { registerRootComponent } from "expo";

function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}
export default registerRootComponent(App);
