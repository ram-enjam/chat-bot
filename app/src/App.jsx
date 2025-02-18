import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import ChatWithKillBill from './pages/ChatWithKillBill';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat-with-kill-bill" element={<ChatWithKillBill />} />
    </Routes>
  );
}

export default App;
