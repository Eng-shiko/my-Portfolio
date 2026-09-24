import { BrowserRouter ,Route  ,Routes } from "react-router-dom";

// import Home from './pages/public/Home';
import Login from './page/admin/Login'
import Dashboard from './page/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute'
import Project from './page/admin/Project'
import Skill from './page/admin/Skill'
import Bio from './page/admin/Bio'
import Experience from "./page/admin/Experience";
import Message from "./page/admin/Message";
import Home from "./page/public/Home";
const App =()=>{

    return (
        
        <BrowserRouter>
            <Routes>
                {/* <Route path='/' element={<Home/>}/> */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/admin" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} >
                    <Route path="projects" element ={<Project/>}/>
                    <Route path="skills" element ={<Skill/>}/>
                    <Route path="bio" element ={<Bio/>} />
                    <Route path="experience" element ={<Experience/>} />
                    <Route path="messages" element ={<Message/>}/>
                
                </Route>

                <Route path="*" element={<h1 className="text-center mt-10">This Page under construction</h1>} />
            </Routes>
        </BrowserRouter>
        
    )
}
export default App