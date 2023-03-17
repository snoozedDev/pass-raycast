import { GlobalStateProvider } from "./components/GlobalStateProvider";
import { Main } from "./components/Main";

const Index = () => (
  <GlobalStateProvider>
    <Main />
  </GlobalStateProvider>
);

export default Index;
