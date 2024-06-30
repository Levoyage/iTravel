import React,{useEffect} from 'react';
import { useLocation,useNavigate,Link } from 'react-router-dom';

const GuidePage = ({ guide }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.destination;

  useEffect(() => {
    console.log("Received destination:", destination);
  }, [destination]);


  return (
    <div>
      <h2>Travel Guide for {destination}</h2>
      {guide.length > 0 ? (
        <ul>
          {guide.map((item, index) => (
            <li key={index}>{item}</li> // 假设每个攻略点为简单文本
          ))}
        </ul>
      ) : (
        <p>No guide available. Please return home and submit a destination.</p>
      )}
      <Link to="/preferences" state={{ destination }}>Recommend Attractions and Activities</Link>
    </div>
  );
};
/*const GuidePage = () => {
    return <div>Guide Page Content</div>;
  };*/
  

export default GuidePage;
