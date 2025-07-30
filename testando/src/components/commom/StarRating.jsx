import React from 'react';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const empty = 5 - full - (half ? 1 : 0);

  const stars = [];
  for (let i = 0; i < full; i++) {
    stars.push(<i key={`full-${i}`} className="ri-star-fill" style={{ color: '#FDB813' }}></i>);
  }
  if (half) {
    stars.push(<i key="half" className="ri-star-half-fill" style={{ color: '#FDB813' }}></i>);
  }
  for (let i = 0; i < empty; i++) {
    stars.push(<i key={`empty-${i}`} className="ri-star-line" style={{ color: '#DDD' }}></i>);
  }
  return <>{stars}</>;
};

export default StarRating;
