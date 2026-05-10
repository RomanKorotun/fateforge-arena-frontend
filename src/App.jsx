import { Routes, Route } from "react-router-dom";

import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import DataDeletionPolicyPage from "./pages/DataDeletionPolicyPage/DataDeletionPolicyPage";

const App = () => {
  return (
    <Routes>
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/deletion-policy" element={<DataDeletionPolicyPage />} />
    </Routes>
  );
};

export default App;
