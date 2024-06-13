import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Users from './Users';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';

function App() {
    return (
        <Router>
            <div className='App'>
                <Routes>
                    <Route path='/' element={<Users />} />
                    <Route path='/create' element={<CreateUser />} />
                    <Route path='/update/:id' element={<UpdateUser />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
