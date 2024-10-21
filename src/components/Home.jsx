import React, { useState } from 'react'
import PopularTracks from './PopularTracks'
import Albums from './Albums';
import Artists from './Artists';

const Home = () => {

    const [active, setActive] = useState('popular');


  return (
    <div className='w-full h-screen flex'>
        <div className='w-[200px] h-full bg-white flex items-center justify-center'>
            <ul>
                <li onClick={() => setActive('popular')}>Popular</li>
                <li onClick={() => setActive('albums')}>Albums</li>
                <li onClick={() => setActive('artists')}>Artists</li>
            </ul>
        </div>
        <div className={` ${active === 'popular' ? '' : 'hidden'}`}>
            <PopularTracks />
        </div>
        <div className={` ${active === 'albums' ? '' : 'hidden'}`}>
            <Albums />
        </div>
        <div className={` ${active === 'artists' ? '' : 'hidden'}`}>
            <Artists />
        </div>
    </div>
  )
}

export default Home