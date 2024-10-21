import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const TrackDetails = () => {
    const { id } = useParams();
    const accessToken = localStorage.getItem('access_token'); // Use the same access token
    const [track, setTrack] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(!accessToken) {
            getRefreshToken()
        }
      }, [accessToken])
    
        const getRefreshToken = async () => {
    
            // refresh token that has been previously stored
            const refreshToken = localStorage.getItem('refresh_token');
            const url = "https://accounts.spotify.com/api/token";
        
            const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: 'a483aa66b51e415ab3df9bcdfaf07286'
            }),
            }
            const body = await fetch(url, payload);
            const response = await body.json();
            if(response.access_token) {
                localStorage.setItem('access_token', response.access_token);
            }
            if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
            }
        } 

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
          try {
            const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch playlist tracks');
            }
    
            const data = await response.json();
            setTrack(data); // Set the tracks from the playlist
          } catch (error) {
            setError(error.message);
          }
        };
    
        fetchPlaylistDetails();
      }, [id, accessToken]);
    
      if (error) {
        return <div>Error: {error}</div>;
      }
    
      if (!track) {
        return <div>Loading...</div>;
      }

  return (
    <div className="p-4 h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{track.name}</h1>
      <p className="text-lg mb-2 text-gray-300">Artist: {track.artists.map(artist => artist.name).join(', ')}</p>
      <p className="text-sm text-gray-400">Album: {track.album.name}</p>
      <img src={track.album.images[0]?.url} alt={track.album.name} className="mt-4 mx-auto" />
      <audio controls className="mt-4 mx-auto bg-gray-100">
        <source src={track.preview_url} type="audio/mpeg"/>
        Your browser does not support the audio tag.
      </audio>
    </div>
  )
}

export default TrackDetails