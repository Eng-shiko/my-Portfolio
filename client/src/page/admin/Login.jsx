// login page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [type ,setType]=useState("password")
    
    const useNavigateInstance = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            
            const response = await API.post('/auth/login', { email:email.trim(),password: password.trim() });
            
            
            localStorage.setItem('token', response.data.token);

            
            useNavigateInstance('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const showPassword=()=>{
        if (type==="password"){
            setType("text")
        }else{
            setType("password")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Portal</h2>
                
                {/* Show error message if login fails */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email : </label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="admin@example.com"
                    />
                </div>

                <div >
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Password : </label>
                    <input 
                        type={type}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />

                </div>
                <div className="mb-6">
                    <input type="checkbox" onClick={showPassword}/> <span className="text-sm text-olive-700">show password</span>

                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:bg-blue-300"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;