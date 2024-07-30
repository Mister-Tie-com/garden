import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, onSearchMarker }) => {
    const [query, setQuery] = useState('');
    const [queryMarker, setQueryMarker] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    const handleInputMarkerChange = (event) => {
        setQueryMarker(event.target.value);
    };

    const handleSearchMarker = () => {
        onSearchMarker(queryMarker);
    };

    const handleClearSearch = () => {
        const clear = '';
        setQuery(clear);
        setQueryMarker(clear);
        onSearch(clear);
        onSearchMarker(clear);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
            handleSearchMarker();
        }
    };

    const searchAll = ()=>{
        handleSearch();
        handleSearchMarker();
    }

    return (
        <div className='search-bar'>
            <input
                id='address'
                className='custom-input'
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Search for adress..."
                autoComplete="off"
            />
            <input
                id='markers'
                className='custom-input'
                type="text"
                value={queryMarker}
                onChange={handleInputMarkerChange}
                onKeyDown={handleKeyPress}
                placeholder="Search for title or description..."
                autoComplete="off"
            />
            <button
                className='custom-button buttons'
                onClick={searchAll}>
                Search
            </button>
            <button className='custom-button buttons'
                    onClick={handleClearSearch}>
                Clear</button>
        </div>
    );
};

export default SearchBar;
