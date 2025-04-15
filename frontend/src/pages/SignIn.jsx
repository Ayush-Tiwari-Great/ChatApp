import React, { useState } from 'react'
import useAuthStore from '../store/userAuthStore'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  let [dp, setDp] = useState(null);
  let [pre, setPrev] = useState(null);
  
  const navigate = useNavigate();
  let {signin} = useAuthStore();
  let [user, setUser] = useState({
    userName:"",
    email:"",
    password:""
  });
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const formData = new FormData();
    formData.append("userName", user.userName);
    formData.append("email", user.email);
    formData.append("password", user.password);
    if (dp) formData.append("dp", dp);
      let success = await signin(formData); 
      if(success)navigate('/chat');
    } catch (error) {
       console.log(error);
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
      <fieldset className="fieldset">
      <div className="avatar mx-auto">
      
          <div className="w-24 rounded-full">
          <label htmlFor="dp">
            <img src={pre || "/ChatApp-Dp.jpg"} /> 
            <i className="fa-solid fa-camera absolute bottom-2 right-2 text-success bg-none/60 p-1 rounded-full text-xl"></i>
            </label>
      </div>
      
      <input type="file" accept='image/*' name='dp' id='dp' className='hidden' onChange={(e)=>{
        setDp(e.target.files[0]);
        setPrev(URL.createObjectURL(e.target.files[0]))
      }}/>
      </div>
</fieldset>
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Enter you Name</legend>
      <input type="text" className="input input-bordered w-[300px]" placeholder="Type here" value={user.name}
      onChange={handleChange} name='userName'/>
    </fieldset>
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
    <button className="btn btn-wide btn-info w-40 m-auto mt-4" type='submit'>Create Profile</button>
    </fieldset>
    </form>
      </div>
    
    </div>
  )
}

export default SignIn
