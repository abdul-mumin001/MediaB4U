import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./app/store";
import { ScrollToTop } from "./components/ScrollToTop";
import {
  NotificationProvider,
  OnlineUsersProvider,
  SearchProvider,
  SideBarItemProvider,
  SocketProvider,
  VideoCallProvider,
} from "./context";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <Provider store={store}>
      <SocketProvider>
        <NotificationProvider>
          <VideoCallProvider>
            <OnlineUsersProvider>
              <SideBarItemProvider>
                <SearchProvider>
                  <App />
                </SearchProvider>
              </SideBarItemProvider>
            </OnlineUsersProvider>
          </VideoCallProvider>
        </NotificationProvider>
      </SocketProvider>
    </Provider>
  </BrowserRouter>
);
