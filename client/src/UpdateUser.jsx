import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateUser() {
    const { id } = useParams(); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [file, setFile] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        axios.get(`http://localhost:3000/getUser/${id}`)
            .then(result => {
                const userData = result.data;
                setName(userData.name);
                setEmail(userData.email);
                setAge(userData.age);
                setFile(userData.file);
                console.log('userData:', userData);
            })
            .catch(err => console.log(err));
    }, []); 

    const update = (e) => {
        e.preventDefault();   
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('age', age);
        if (file) {
            formData.append('file', file); 
        }
        
        //console.log(`formData:`, formData);
        
        axios.put(`http://localhost:3000/updateUser/${id}`, formData)
        .then(result => {
            console.log(result.data); 
            navigate('/'); 
        })
        .catch(err => console.log(err)); 
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={update}>
                    <h2>Update User</h2>
                    <div className='mb-2'>
                        <label htmlFor='name'>Name</label>
                        <input
                            type='text'
                            placeholder='Enter Name'
                            className='form-control'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            placeholder='Enter Email'
                            className='form-control'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='age'>Age</label>
                        <input
                            type='number'
                            placeholder='Enter Age'
                            className='form-control'
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required 
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='photo'>Photo</label>
                        <input
                            type='file'
                            className='form-control'
                            onChange={(e) => setFile(e.target.files[0])} 
                        />
                    </div>
                    <button className='btn btn-success'>Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;
