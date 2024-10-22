import { Outlet } from "react-router-dom";
import Navbar from "../navbar";

export default function index() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
