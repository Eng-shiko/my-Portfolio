//  the file is used to protect the page from any one try to enter to the admin data and action
import { Navigate } from "react-router-dom";
const ProtectedRoute =({children})=>{
    const token = localStorage.getItem('token')
    if(!token){
        return <Navigate to="/login" replace />;
    }
    return children

}
export default ProtectedRoute;