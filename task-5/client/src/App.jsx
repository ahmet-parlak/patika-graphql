import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Event from "./pages/Event";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/events/:id" Component={Event}></Route>
      </Routes>
    </>
  );
}

export default App;
