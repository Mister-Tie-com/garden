import React from 'react';
import '../styles/Sheet.css';
import EditOptions from "./EditOptions";

function Sheet({marker, handleUpdate, handleDelete})
{
    return (
       <div className={marker && true ? 'sheet-app show-sheet' : 'sheet-app' }>
           {marker && true && (
               <div>
                   <h2>{marker.title}</h2>
                   <p>{marker.description}</p>
                   <p>{marker.type_description}</p>
                   <img
                       className='sheet-img'
                       src="https://fakeimg.pl/200/"
                       alt='fake image'/>
                   {editor && (
                       <EditOptions
                           handleUpdate={handleUpdate}
                           handleDelete={handleDelete}>
                       </EditOptions>
                   )}
               </div>
               )}
       </div>
    );
}

export default Sheet;