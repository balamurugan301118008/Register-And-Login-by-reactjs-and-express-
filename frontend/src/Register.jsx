import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [fetchData, setfetchData] = useState([])
    useEffect(() => {
        fetch('http://localhost:8081/register')
            .then(res => res.json())
            .then(data => data.forEach((ele) => {
                console.log(ele);
                setfetchData(ele)
            }))
            .catch(err => err.json())
    }, [])
    const validate = () => {
        let newErrors = { ...errors };
        let isVaild = true;
        // if (formData.name.trim() === "" && formData.email.trim() === "" && formData.password.trim() === "") {
        //     newErrors.name = 'Username is required';
        //     newErrors.email = 'Email is required';
        //     newErrors.password = 'Password is required';
        //     isVaild = false;
        // }

        if (formData.name.trim() === "" && formData.password.trim() === "" && formData.email.trim() === "") {
            newErrors.name = 'Username is required';
            newErrors.password = 'password is required';
            newErrors.email = 'Email is required';
            isVaild = false;
        }

        // if (formData.name.length < 7 && formData.name.trim() !== "") {
        //     newErrors.name = 'Username must be at least 5 characters long';
        //     isVaild = false;
        // }
        if (formData.email.length < 10 && formData.email.trim() !== "") {
            newErrors.email = 'Email must be at least 8 characters long';
            isVaild = false;
        }

        if (formData.email == fetchData.email) {
            newErrors.email = 'Email id alreay exits';
            isVaild = false;
        }

        if (formData.password.length < 7 && formData.password.trim() !== "") {
            newErrors.password = 'Password must be at least 8 characters long';
            isVaild = false;
        }
        setErrors(newErrors);
        return isVaild;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        delete errors[name]
    };
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            axios.post('http://localhost:8081/register', formData)
                .then(res => {
                    if (res.data.Status == "Success") {
                        localStorage.setItem('username', formData.name)
                        localStorage.setItem('email', formData.email)
                        navigate('/login');
                        console.log(res);
                    } else {
                        alert("Error");
                    }
                })
                .catch(err => err.json());
        }
        else {
            console.log("not okay");
        }
    }
    return (
        <div>
            <p className='alertMessage'></p>
            <div className='container w-50 p-20'>
                <div>
                    <h1 className='signUp'>Sign up</h1>
                </div>
                <form className='container-fluid m-10' onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputUsername" className="form-label">Username</label>
                        <input type="text" className="form-control w-75" onChange={handleChange} value={formData.name} id="exampleInputEmail1" placeholder="Enter username" name='name' />
                        {errors.name ? <span className="error">{errors.name}</span> : ""}
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control  w-75" onChange={handleChange} value={formData.email} id="exampleInputEmail1" placeholder="Enter email" name='email' />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className='form-control  w-75' onChange={handleChange} value={formData.password} id="exampleInputPassword1" placeholder="password" name='password' />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <button type='submit' className="btn btn-primary">Register</button>
                    <div>
                        <p className='p-3'>Already have an account  <Link to='/login' className='btn btn-light border-secondary'>Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
