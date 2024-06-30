import React from 'react';
import './RecommendationList.css';

const RecommendationList = ({ recommendations }) => {
    console.log("Recommendations Data:", recommendations);  // 调试
    return (
        <div className="recommendation-list">
            <h2>Recommendations</h2>
            <div className="recommendations-container">
                {/*报错缺少key，可能是因为还没用上数据库生成不了id，添加index（临时使用){recommendations.map((poi, index) => (
                    <div key={index} className="recommendation-card">*/}
                    {recommendations.map((poi) => (
                        <div key={poi.name} className="recommendation-card">
                        <img src={poi.imageUrl} alt={poi.name} className="poi-image" />
                        <h3>{poi.name}</h3>
                        <p>{poi.description}</p>
                        <p><a href="#" className="details-link">Details</a></p>
                        <button>Save</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationList;
