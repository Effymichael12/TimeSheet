import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Main from './Pages/Main';
import Open from './Pages/Open';
import Signin from './Pages/Signin';
import Register from './Pages/Register';
import Manager from './Pages/Manager';
import AdminSettings from './Pages/AdminSettings';
function App() {
  return (
    <div className="App">
          <BrowserRouter>
          <Routes>
          <Route path='/' element={<Open />} />
          <Route path='/time' element={<Main />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/register' element={<Register />} />
          <Route path='/manager' element={<Manager />} />
          <Route path='/admin' element={<AdminSettings />} />

          </Routes>
          </BrowserRouter>

    </div>
  );
}

export default App;
