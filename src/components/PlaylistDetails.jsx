import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const PlaylistDetails = () => {
  const { id } = useParams(); // Get the playlist ID from the URL
  const [tracks, setTracks] = useState([]); // State for tracks in the playlist
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('access_token'); // Use the same access token

  useEffect(() => {
        getRefreshToken()
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
        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch playlist tracks');
        }

        const data = await response.json();
        setTracks(data.items); // Set the tracks from the playlist
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPlaylistDetails();
  }, [id, accessToken]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (tracks.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-5 uppercase text-white">Playlist Tracks</h1>
      <ul>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3'>
          {tracks.map((item) => {
            const track = item.track; // Access the track from the item
            return (
              <div key={track.id} className="mb-4 p-2 border border-white/10">
                <img src={track.album.images[0]?.url} alt={track.album.name} className="mt-2" />
                <Link to={`/track/${track.id}`}>
                  <h2 className="text-lg text-white font-bold mt-2">{track.name}</h2>
                </Link>
                <p className="text-sm text-white/60">Artist: {track.artists.map(artist => artist.name).join(', ')}</p>
                <p className="text-sm text-gray-500">Album: {track.album.name}</p>
              </div>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

export default PlaylistDetails;
