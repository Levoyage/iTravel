import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth for user context
import axios from 'axios';
import './RecommendationList.css';

const RecommendationList = ({ recommendations, onFetchMoreRecommendations, onSave }) => {
    const [savedPOI, setSavedPOI] = useState(null);
    const { user } = useAuth(); // Get user from context

    useEffect(() => {
        console.log("User state:", user);
    }, [user]);

    const handleSave = async (poi) => {
        if (!user) {
            alert('Please log in to save POIs');
            return;
        }

        const poiData = {
            userId: user.id,
            name: poi.name,
            description: poi.description,
            category: poi.category || "Uncategorized",
            location: poi.location || "Unknown",
            rating: poi.rating || 0.0,
            imageUrl: poi.imageUrl,
            imageBytes: poi.imageBytes || []
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/pois/save`,
                poiData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setSavedPOI(poi.name);
        } catch (error) {
            console.error('Failed to save POI:', error);
        }
    };

    console.log("Parsed recommendations:", recommendations);


    return (
        <div className="recommendation-list">
            <h2>Recommendations</h2>
            <div className="recommendations-container">
                {recommendations.map((poi) => (
                    <div key={poi.name} className="recommendation-card">
                        <img
                            src={poi.imageUrl}
                            alt={poi.name}
                            className="poi-image"
                        />
                        <h3>{poi.name}</h3>
                        <p>{poi.description}</p>
                        <p>
                            <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(poi.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="details-link"
                            >
                                Details
                            </a>
                        </p>
                        <button onClick={() => handleSave(poi)}>Save</button>
                        {user && savedPOI === poi.name && <p className="success-message">POI saved successfully!</p>}
                    </div>
                ))}
            </div>
            <button className="change-button" onClick={onFetchMoreRecommendations}>
                Change
            </button>
        </div>
    );
};

export default RecommendationList;
