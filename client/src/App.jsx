import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { initSocket } from './socket';
import WaiterPage from './pages/WaiterPage/WaiterPage';
import KitchenPage from './pages/KitchenPage/KitchenPage';
import BillPage from './pages/BillPage/BillPage';
import './App.css';

initSocket();

export default function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>Order Cook & Pay</h1>
          <div className="nav-links">
            <Link to="/waiter">Waiter</Link>
            <Link to="/kitchen">Kitchen</Link>
            <Link to="/bill">Bill</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/waiter" element={<WaiterPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/bill" element={<BillPage />} />
          <Route path="/" element={<WaiterPage />} />
        </Routes>
      </div>
    </Router>
  );
}
