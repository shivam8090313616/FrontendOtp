import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Form from './Form';
import Thanks from './Thanks';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
