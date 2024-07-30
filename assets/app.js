import React, { useState } from 'react';
import Map from './components/Map';
import SearchBar from "./components/SearchBar";
import './styles/App.css';
import './styles/MarkerPopup.css';
import GetGeoloc from "./components/GetGeoloc";
import EditOptions from "./components/ToggleEdit";

const App = () => {
    const [search, setSearch] = useState('');
    const [searchMarker, setSearchMarker] = useState('');
    const [geoloc, setGeoloc] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editChange, setEditChange] = useState(null);

    return (
        <div className='map-app'>
            <div className='bg bg-right map-menu'>
                <GetGeoloc onGeolocChange={setGeoloc} />
                <SearchBar onSearch={setSearch} onSearchMarker={setSearchMarker}/>
                {editor && (
                    <EditOptions
                        getEditMode={editMode}
                        editChange={setEditChange}>
                    </EditOptions>
                )}
            </div>
            <Map getSearch={search}
                 getSearchMarker={searchMarker}
                 getGeoloc={geoloc}
                 onEditModeChange={setEditMode}
                 getEditChange={editChange}
            />
        </div>
    );
};

export default App;