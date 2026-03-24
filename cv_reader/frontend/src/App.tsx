import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import EditCV from './components/EditCV';
import Home from './components/Home';
import RootLayout from './utils/RootLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/edit-cv" element={<EditCV />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
