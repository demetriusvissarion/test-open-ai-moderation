import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TextModeration from "./pages/TextModeration.jsx";
import ImageModeration from "./pages/ImageModeration.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <div className="wrapper">
        <div className="container">
          <h1>OpenAI Moderation Tester</h1>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/text" element={<TextModeration />} />
            <Route path="/image" element={<ImageModeration />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
