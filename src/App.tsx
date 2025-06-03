import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import BreedDetailPage from "./pages/BreedDetailPage";
import HomePage from "./pages/HomePage";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/breed/:id" element={<BreedDetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
