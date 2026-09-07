import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        {/* We can add other routes later or have Dashboard handle state */}
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
