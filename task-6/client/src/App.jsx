import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Event from "./pages/Event";
import NewEvent from "pages/NewEvent";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/events/:id" Component={Event}></Route>
        <Route path="/newevent" Component={NewEvent}></Route>
      </Routes>
    </>
  );
}

export default App;
