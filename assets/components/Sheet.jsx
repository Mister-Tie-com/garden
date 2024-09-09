import React, { useState, useEffect } from 'react';
import '../styles/Sheet.css';
import EditOptions from "./EditOptions";

function Sheet({ marker, handleUpdate, handleDelete, editor, markerTypes }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [typeId, setTypeId] = useState('');

    useEffect(() => {
        if (marker) {
            setTitle(marker.title || '');
            setDescription(marker.description || '');
            setTypeId(marker.type_id || 0);
        }
    }, [marker]);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleTypeChange = (e) => setTypeId(e.target.value);

    return (
        <div className={marker ? 'sheet-app show-sheet' : 'sheet-app'}>
            {marker && (
                <div>
                    <h2>{editor ? (
                        <input
                            className='custom-input'
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter title"
                        />
                    ) : (
                        title
                    )}</h2>

                    <p>{editor ? (
                        <textarea
                            className='custom-input'
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Enter description"
                        />
                    ) : (
                        description
                    )}</p>

                    <p>{editor ? (
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
                    ) : (
                        marker.type_description
                    )}</p>

                    <img
                        className='sheet-img'
                        src="https://fakeimg.pl/200/"
                        alt='fake image'
                    />

                    {editor && (
                        <EditOptions
                            handleUpdate={() => handleUpdate({ ...marker, title, description, type_id: typeId })}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default Sheet;
