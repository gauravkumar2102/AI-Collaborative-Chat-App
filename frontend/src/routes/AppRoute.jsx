import react from 'react';
import {Route,BrowserRouter,Routes} from 'react-router-dom';
import Login from '../screens/login';
import Register from '../screens/register'; 
import Home from "../screens/home"
import ProjectPage from '../screens/projectPage';
import OpenProject from '../screens/project';
import UserAuth from '../auth/userAuth';

const AppRoute = () => {    
    return (
        
        <BrowserRouter>
            <Routes>
                <Route path="/" element={< Home/>} />
                <Route path="/project" element={<UserAuth><ProjectPage/></UserAuth>} />    
                <Route path="/login" element={<Login />} />  
                <Route path="/register" element={<Register />} />
                <Route path="/OpenProject" element={<UserAuth><OpenProject/></UserAuth>} />
{/* Add more routes as needed */}
            </Routes>
        </BrowserRouter>

    )
}

export default AppRoute;