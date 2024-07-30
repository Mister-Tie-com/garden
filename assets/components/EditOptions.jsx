import React from 'react';
import '../styles/EditOptions.css';

function EditOptions({handleUpdate, handleDelete})
{
    return (
        <div>
            <h3>Edit Point of interest</h3>
            <button
                className='edit-button buttons'
                onClick={handleUpdate}>Update</button>
            <button
                className='edit-button buttons'
                onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default EditOptions;