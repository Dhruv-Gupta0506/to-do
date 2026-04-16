import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Input from '../components/Input';
import Button from '../components/Button';

const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // This picks the right URL based on whether you are logging in or registering
        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            // Talking to the backend
            const response = await axiosInstance.post(endpoint, formData);

            if (response.status === 200 || response.status === 201) {
                alert(isLogin ? "Welcome Back!" : "Account Created Successfully!");
                
                // This moves the user to the dashboard page automatically
                navigate('/dashboard');
            }
        } catch (error) {
            // If backend sends an error (like 401 Unauthorized), we catch it here
            console.error("Auth Error:", error.response?.data);
            alert(error.response?.data?.message || "Authentication failed. Please check your details.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">
                    {isLogin ? 'Login' : 'Register'}
                </h1>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    )}

                    <Input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />

                    <Button text={isLogin ? 'Login' : 'Create Account'} />
                </form>

                <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "New here? Create an account" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
};

export default Auth;