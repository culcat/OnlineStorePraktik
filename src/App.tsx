
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main.tsx';
import Auth from './pages/Auth.tsx'


function App() {
    return (

        <Routes>
            <Route path="/" element={<Main />} />

            <Route path="/auth" element={<Auth />} />


        </Routes>

    );
}

export default App;