import React from 'react';
import '../styles/ToggleEdit.css';

function ToggleEdit({getEditMode, editChange})
{
    return (
        <div className="menu-editor">
            <div className="toggle-editor">
                <span className="toggle-text">Activate add marker</span>
                <input className="toggle-input"
                       id="toggle-editor"
                       type="checkbox"
                       checked={getEditMode}
                       onChange={editChange}/>
                <label className="toggle-label"
                       htmlFor="toggle-editor"></label>
            </div>
        </div>
    );
}

export default ToggleEdit;