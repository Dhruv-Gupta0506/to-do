import {useState} from 'react';


const Auth=()=>{
    const [isLogin,setIsLogin]=useState(true);
    const [formData,setFormData]=useState({
        username:'',
        email:'',
        password:''
    });
    const handleInputChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };
    return(
        <div className="auth-container">
            <h1>{isLogin?'Login':'Register'}</h1>
        </div>
    );
};







export default Auth;