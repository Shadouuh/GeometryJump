import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Menu } from './pages/Menu/Menu';
import { Story } from './pages/Story/Story';
import { Editor } from './pages/Editor/Editor';
import { Community } from './pages/Community/Community';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/story" 
          element={
            <ProtectedRoute>
              <Story />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/editor" 
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
