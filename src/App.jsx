import { Routes, Route } from "react-router-dom";

import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";

const App = () => {
  return (
    <Routes>
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    </Routes>
  );
};

export default App;
