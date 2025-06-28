import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Pages from './pages/Pages';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Pages/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
