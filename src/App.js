import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ConsistencyPathListPage from "./pages/ConsistencyPathListPage";
import CheckpointsListPage from "./pages/CheckpointsListPage";
//import ConsistencyPathsCreatePage from "./pages/ConsistencyPathsCreatePage";
//import ConsistencyPathsViewPage from "./pages/ConsistencyPathsViewPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/consistency-paths"
          element={<ConsistencyPathListPage />}
        />
        <Route path="/checkpoints" element={<CheckpointsListPage />} />
        {/* <Route
          path="/consistency-paths/create"
          element={<ConsistencyPathsCreatePage />}
        />
        <Route
          path="/consistency-paths/:id"
          element={<ConsistencyPathsViewPage />}
        /> */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;

