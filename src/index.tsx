import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Amplify, Auth } from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import { AppProvider } from "./context";
import App from "./App";
import "./index.css";

Amplify.configure(awsconfig);
Auth.configure(awsconfig);
Predictions.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
);
