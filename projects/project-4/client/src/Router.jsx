import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/layout";

// Routes
import Home from "./pages/Home";
import Question from "./pages/Question";
import NewQuestion from "./pages/NewQuestion";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "questions/:id",
        element: <Question />,
      },
      {
        path: "questions/new",
        element: <NewQuestion />,
      },
    ],
  },
]);

export default router;
