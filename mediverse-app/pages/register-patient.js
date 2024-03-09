import Head from "next/head";
import Image from "next/image";
import Link from "next/link"
import React, { useState } from 'react';

const registerPatient = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    
    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
        console.log('Form submitted:', formData);
    };
    
    return ( 
        <>
        <div>
            <h1>Register Patient Side</h1>
            <Link href="/">Home</Link>
        </div>

        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            <br />
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
        
        </>
    );
}
 
export default registerPatient;