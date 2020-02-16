import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Router from "./components/Router";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Router />
      </div>
    </>
  );
}

export default App;
