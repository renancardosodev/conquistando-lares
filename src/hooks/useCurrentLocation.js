import React, { useState, useEffect } from 'react';

function Home() {
  const [location, setLocation] = useState('');

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
      },
      () => {
        setLocation('Permissão negada para localização');
      }
    );
  } else {
    setLocation('Geolocalização não suportada');
  }
}, []);



  return (
    <div>
      <p>Localização atual: {location || 'Carregando...'}</p>
    </div>
  );
}

export default Home;
