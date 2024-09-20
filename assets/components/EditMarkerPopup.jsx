import React, { useState } from 'react';
import '../styles/EditMarkerPopup.css';

function EditMarkerPopup({ marker, onUpdate, onClose, markerTypes }) {
    const [title, setTitle] = useState(marker?.title || '');
    const [description, setDescription] = useState(marker?.description || '');
    const [typeId, setTypeId] = useState(marker?.typeId || 0);

    const handleSave = () => {
        const updatedMarker = { ...marker, title, description, typeId };
        onUpdate(updatedMarker);
        onClose();
    };

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleTypeChange = (e) => setTypeId(e.target.value);

    return (
        <div className="marker-popup">
            <div className="popup-content">
                <h2>Edit marker</h2>
                <input
                    id="title"
                    className='custom-input'
                    type="text"
                    value={title}
                    placeholder='Enter title'
                    onChange={handleTitleChange}
                />
                <textarea
                    id="description"
                    className='custom-input'
                    value={description}
                    placeholder='Enter description'
                    onChange={handleDescriptionChange}
                />

                <select className='custom-input'
                        value={typeId}
                        onChange={handleTypeChange}>
                    <option value="" disabled>Select Type</option>
                    {markerTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.description}
                        </option>
                    ))}
                </select>

                <div className="popup-actions">
                    <button
                        className='custom-button'
                        onClick={handleSave}>Save
                    </button>
                    <button
                        className='custom-button'
                        onClick={onClose}>Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditMarkerPopup;
