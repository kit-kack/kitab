import ReactDOM from "react-dom/client";

import "./style.css";
import { ThemeApp } from "./ThemeApp";
import { Provider } from "jotai";
import { store } from "@/utils/jotai";
import { loadGitRepoConf } from "@/utils/git-repo-action";

loadGitRepoConf();

ReactDOM.createRoot(document.getElementById("app")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeApp />
  </Provider>
);
