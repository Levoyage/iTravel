import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';  // Removed useParams
import './PreferenceForm.css';

const PreferenceForm = ({ onSubmit}) => {  // Accept destination as a prop
    const location = useLocation();
    const { destination } = location.state || {}; // 获取传递的 destination
    const navigate = useNavigate();
    const categories = [
        'Natural landscapes',
        'Historical landmarks',
        'Modern architecture',
        'Cultural sites'
    ];

    const [checkedState, setCheckedState] = useState(new Array(categories.length).fill(false));

    useEffect(() => {
        console.log("Received destination:", destination);
    }, [destination]);

    const handleCheckboxChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCategories = categories.filter((_, index) => checkedState[index]);
        onSubmit(destination, { visit: selectedCategories });
        navigate('/recommendations');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="section">
                <h2>Choose your interests for {destination}</h2>
                <h3>I want to visit:</h3>
                <p>Tick the checkboxes based on your interests</p>
                <div className="checkbox-group">
                    {categories.map((category, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                checked={checkedState[index]}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default PreferenceForm;
