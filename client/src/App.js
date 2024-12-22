import React from 'react';
import Boards from './components/Boards';
import backgroundImage from './assests/5650.jpg'; // Corrected folder name

export default function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use the imported image correctly
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center', // Optional: centers the image
        minHeight: '100vh',
        overflowY: 'hidden',
      }}
    >
      <Boards />
    </div>
  );
}
