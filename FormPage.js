import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FormPage = ({onFormSubmit}) => {
    const [formData, setFormData] = useState({
        birthDate: new Date(),
        sex: '',
        smoke: '',
        remainingSeconds: 0,
        errorMessage: ''
    });

    const handleChange = e => {
        const { name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = date => {
        setFormData(prevState => ({
            ...prevState,
            birthDate: date //Sets the date from the form
        }))
    };

    const handleSubmit = async e=> {
        e.preventDefault();

        const dataToSubmit = {
            sex: formData.sex,
            smoke: formData.smoke,
            birthDate: formData.birthDate.toISOString() //Converts the date to ISO string format
        };

        // Form Submission Logic
        try {
            const response = await fetch('/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSubmit)
            });

            if(response.ok) {
                const data = await response.json();
                if(data.status === 'success') {
                    console.log("Form success");
                    setFormData(prevState => ({
                        ...prevState,
                        remainingSeconds: data.remainingSeconds,
                        errorMessage: data.message
                    }));
                    console.log('TLTL: ', data.remainingSeconds);
                    console.log('Submission Response: ', data);
                    onFormSubmit(data.remainingSeconds); //Call the callback to update form submission status, replaces "Please fill out the form" with the timer.
                }
                else {
                    setFormData(prevState => ({
                        ...prevState,
                        errorMessage: data.message,
                        remainingSeconds: null
                      }));
                }
                console.log('Form submission response', data);
            }
            else {
                console.error('Submission failed:', response.statusText);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (

        <div>
            <h2 style={{ color: 'white' }}>Fill out the form to get your lifespan estimate.</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="birthDate" style={{ color: 'white' }}>Birth date:</label>
                    <div>
                        <DatePicker selected = {formData.birthDate} onChange={handleDateChange}/>
                    </div>
                </div>
                <div>
                    <label htmlFor="sex" style={{ color: 'white' }}>Sex:</label>
                    <select
                        id="sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select sex</option>
                        <option>male</option>
                        <option>female</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="smoke" style={{ color: 'white' }}>Do you smoke nicotine:</label>
                    <select
                        id="smoke"
                        name="smoke"
                        value={formData.smoke}
                        onChange={handleChange}
                        required
                    >
                        <option>no</option>
                        <option>yes</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>


        <nav>
            <Link to="/">Close</Link>
        </nav>



        </div>
    );
};

export default FormPage;
