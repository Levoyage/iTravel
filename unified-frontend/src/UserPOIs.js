import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './ProfilePage.css'; // 引入新的样式文件
import Modal from './Modal'; // Import the modal component

const UserPOIs = () => {
  const { user } = useAuth();
  const [pois, setPois] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null); // For storing the POI to display in the modal

  useEffect(() => {
    if (user && user.id) { // 使用 id 而非 username
      const fetchUserPOIs = async () => {
        try {
          console.log(`Fetching POIs for user ID: ${user.id}`); // 打印调试信息
          const response = await axios.get(`http://localhost:8080/api/pois/user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setPois(response.data);
          console.log('POIs fetched successfully:', response.data);
        } catch (error) {
          console.error('Failed to fetch POIs:', error);
        }
      };

      fetchUserPOIs();
    }
  }, [user]);

  // Handle delete POI
  const handleDeletePOI = async (poiId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this POI?');
    if (!isConfirmed) {
      return; // If the user cancels, exit the function
    }

    try {
      // Send delete request to the server
      const response = await axios.delete(`http://localhost:8080/api/pois/delete/${poiId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // If successful, update the POIs state to remove the deleted POI
      if (response.status === 200) {
        setPois((prevPois) => prevPois.filter((poi) => poi.id !== poiId));
        console.log('POI deleted successfully:', poiId);
      }
    } catch (error) {
      console.error('Failed to delete POI:', error);
    }
  };

  // Modal handler
  const handleShowMore = (poi) => {
    setSelectedPOI(poi); // Set the POI to be displayed in the modal
  };

  return (
    <div className="items-container">
      {pois.length > 0 ? (
        pois.map(poi => (
          <div div key={poi.id} className="item-card">
            <img src={poi.imageUrl} alt={poi.name} className="poi-image" />
            <div className="item-content">
              <h3>{poi.name}</h3>
              <p>{poi.description}</p>
            </div>
            <div className="buttons-container">
              <button className="show-more" onClick={() => handleShowMore(poi)}>Show More</button>
              <button className="delete-button" onClick={() => handleDeletePOI(poi.id)}>Delete</button>
            </div>
          </div>

        ))
      ) : (
        <p>No POIs found.</p>
      )}

      {selectedPOI && (
        <Modal onClose={() => setSelectedPOI(null)}>
          <h3>{selectedPOI.name}</h3>
          <img src={selectedPOI.imageUrl} alt={selectedPOI.name} className="poi-image" />
          <p>{selectedPOI.description}</p>
        </Modal>
      )}
    </div>
  );
};

export default UserPOIs;
