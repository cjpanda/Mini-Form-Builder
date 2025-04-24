import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./app/layout";

import MyForms from "./pages/MyForms";
import Analytics from "./pages/Analytics";
import KonwledgeBase from "./pages/KonwledgeBase";
import HelpSupport from "./pages/HelpSupport";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="forms" element={<MyForms />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="knowledge" element={<KonwledgeBase />} />
            <Route path="help" element={<HelpSupport />} />
            <Route index element={<div className="p-6">👋 Welcome!</div>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
