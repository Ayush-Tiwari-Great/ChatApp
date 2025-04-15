import React, { useState } from 'react'
import useAuthStore from '../store/userAuthStore'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  let {login} = useAuthStore();
    let [user, setUser] = useState({
      email:"",
      password:""
    });
    const handleSubmit = async (e)=>{
      e.preventDefault();
      try {
        let success = await login(user); 
        if(success)navigate('/chat');
      } catch (error) {
         console.log("In logIn",error);
      }
    }
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUser(prev => ({ ...prev, [name]: value }));
    };
  return (
    
    <div className='flex items-center justify-center min-h-screen bg-base-100'>
      <div className='border border-gray-950 px-10 py-10 rounded-xl'>
      <form onSubmit={handleSubmit}>
    <fieldset className="fieldset ">
      <legend className="fieldset-legend">Enter you Email</legend>
      <input type="email" className="input" placeholder="Type here" value={user.email}
      onChange={handleChange} name='email'/>
    </fieldset>
    <fieldset className="fieldset ">
      <legend className="fieldset-legend">Enter you Password</legend>
      <input type="password" className="input" placeholder="Type here" value={user.password}
      onChange={handleChange} name='password'/>
    </fieldset>
    <fieldset className="fieldset ">
    <button className="btn btn-wide btn-info w-40 m-auto mt-4" type='submit'>Login Profile</button>
    </fieldset>
    </form>
      </div>
    
    </div>
  
  )
}

export default Login;
