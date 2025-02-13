import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import './List.css';

const List = () => {
  // State variables
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);  // Loading state
  const navigate = useNavigate();

  // Fetch restaurants with pagination
  useEffect(() => {
    setLoading(true); // Start loading
    axios.get(`https://back-6s19.onrender.com/api/restaurants?page=${currentPage}`)
      .then(res => {
        setRestaurants(res.data.restaurants);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false)); // Stop loading after fetching data
  }, [currentPage]);

  // Search by Name
  const handleSearchByName = () => {
    setLoading(true);
    axios.get(`https://back-6s19.onrender.com/api/restaurants/search/name?name=${searchName}`)
      .then(res => {
        setRestaurants(res.data);
        setCurrentPage(1);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // Search by Location
  const handleSearchByLocation = () => {
    setLoading(true);
    axios.get(`https://back-6s19.onrender.com/api/restaurants/search/location?lat=${latitude}&lng=${longitude}`)
      .then(res => {
        setRestaurants(res.data);
        setCurrentPage(1);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // Pagination
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center" style={{ fontStyle: "italic" }}>
        Find your desired Restaurant
      </h2>

      {/* Search Inputs */}
      <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
        <input 
          type="text" 
          className="form-control w-25" 
          placeholder="Search by Name"
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)} 
        />   
        <button className="btn btn-danger" onClick={handleSearchByName}>Search</button>
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
        <input 
          type="number" 
          className="form-control w-25" 
          placeholder="Latitude"
          value={latitude} 
          onChange={(e) => setLatitude(e.target.value)} 
        />
        <input 
          type="number" 
          className="form-control w-25" 
          placeholder="Longitude"
          value={longitude} 
          onChange={(e) => setLongitude(e.target.value)} 
        />                                 
        <button className="btn btn-danger" onClick={handleSearchByLocation}>Search</button>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-danger" role="status"></div>
          <p>Loading restaurants...</p>
        </div>
      ) : (
        <>
          <div className="row">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="col-md-3 mb-4">
                <div className="card shadow-sm border-0 h-100">
                  {restaurant.featured_image && (
                    <img 
                      src={restaurant.featured_image} 
                      alt={restaurant["Restaurant Name"]} 
                      className="card-img-top img-fluid" 
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{restaurant["Restaurant Name"]}</h5>
                    <p className="card-text text-muted mb-1"><strong>City:</strong> {restaurant.City}</p>
                    <p className="card-text text-muted mb-1"><strong>Address:</strong> {restaurant.Address}</p>
                    <p className="card-text text-muted mb-2"><strong>Cuisines:</strong> {restaurant.Cuisines}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        onClick={() => navigate(`/restaurant/${restaurant["Restaurant ID"]}`)}
                      >
                        View Details
                      </button>
                      <a 
                        href={`https://www.google.com/maps?q=${restaurant.Latitude},${restaurant.Longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-danger"
                      >
                        <FaMapMarkerAlt size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <button 
                className="btn btn-outline-danger mx-2" 
                onClick={prevPage} 
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className="btn btn-outline-danger mx-2" 
                onClick={nextPage} 
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default List;
