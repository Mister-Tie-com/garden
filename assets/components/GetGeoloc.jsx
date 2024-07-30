import React from 'react';
import '../styles/GetGeoloc.css';

function GetGeoloc({onGeolocChange})
{
    const handleChange = (event) => {
        onGeolocChange(event);
    };

    return (
        <button
            className='custom-button location buttons'
            onClick={handleChange}>
            <img src='/images/location.svg' alt='picto-location'/>
            MY LOCATION
        </button>
    );
}

export default GetGeoloc;