import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PopularTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('access_token'); // Replace with your actual access token 

  useEffect(() => {
        getRefreshToken()
  }, [])

  const getRefreshToken = async () => {
    try {
        // Get the refresh token that has been previously stored
        const refreshToken = localStorage.getItem('refresh_token');
        const clientId = 'a483aa66b51e415ab3df9bcdfaf07286';
        const clientSecret = '136dbe12d51a41d099057161fafbec4a'; // Include your client secret

        const url = "https://accounts.spotify.com/api/token";
        
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`), // Basic auth header
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken, // Use the stored refresh token
            }),
        };

        const response = await fetch(url, payload);
        const data = await response.json();

        if (response.ok) {
            // If the request was successful
            localStorage.setItem('access_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('refresh_token', data.refresh_token);
            }
        } else {
            // Handle error response
            console.error('Error refreshing token:', data.error);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};


  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/browse/categories/toplists/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }

        const data = await response.json();
        setTracks(data.playlists.items); // Adjust based on the data structure you need
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTracks();
  }, [accessToken]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 uppercase text-white text-center">Popular Tracks</h1>
      <ul>
        <div  className="mb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {tracks.map((track) => (
            <div key={track.id} className='w-full mx-auto border relative bg-black hover:scale-[101%] duration-300'>
                <div className='absolute z-10 bottom-0 p-5 bg-black/70 w-full'>
                    <Link to={`/playlist/${track.id}`} className="text-xl hover:underline font-bold text-white">
                        {track.name}
                    </Link>
                    <p className="text-sm text-gray-200">{track.description || 'No description available'}</p>
                </div>
                <img src={track.images[0].url} className='w-full h-full opacity-60' alt="" />
            </div>
        ))}
        </div>
      </ul>
    </div>
  );
};

export default PopularTracks;
