import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import Sheet from "./Sheet";
import EditMarkerPopup from './EditMarkerPopup';
import 'mapbox-gl/dist/mapbox-gl.css';

function Map({ getSearch, getSearchMarker, getGeoloc, onEditModeChange, getEditChange }) {
    const mapDefaultZoom = 16;
    const maxZoomLevel = 20;
    const minZoomLevel = 6;
    const defaultViewport = [2.3522, 48.8566];
    const [viewport] = useState(defaultViewport);
    const [markerTypes, setMarkerTypes] = useState([]);
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const cursorIconRef = useRef(null);

    let [popups, setPopups] = useState([]);
    let [editMode, setEditMode] = useState(false);
    let [markers] = useState([]);
    let [markersData, setMarkersData] = useState([]);
    let [selectedMarker, setSelectedMarker] = useState(null);
    let [myMarkerExist, setMyMarkerExist] = useState(false);
    let [isPopupOpen, setIsPopupOpen] = useState(false);
    let [popupMarker, setPopupMarker] = useState(null);

    const createMyLocationMarker = (position) => {
        const latitude = position.latitude;
        const longitude = position.longitude;
        const popupContent = document.createElement('div');

        const title = document.createElement('span');
        title.textContent = 'You are here!';
        title.className = 'popup-title';

        popupContent.appendChild(title);

        const popup = new mapboxgl.Popup({
            offset: 40,
            closeButton: false,
            closeOnClick: true,
            closeOnMove: true
        }).setDOMContent(popupContent);

        const iconElement = document.createElement('img');
        iconElement.src = 'images/my-location.svg';
        iconElement.className = 'marker-icon';

        const marker = new mapboxgl.Marker({
            element:iconElement,
            draggable: false
        })
            .setLngLat([longitude,latitude])
            .setPopup(popup)
            .addTo(mapRef.current)

        const markerElement = marker.getElement();
        markerElement.style.cursor = 'pointer';
        markerElement.style.display = 'flex';

        setMyMarkerExist(true);
    }

    const onLocationSuccess = (position) => {
        if(mapRef.current){
            if(!myMarkerExist){
                createMyLocationMarker(position.coords);
            }
            removeAllMarker();
            flyToLocation(position.coords);
        }
    };

    const onLocationError = (error) => {
        console.error('Error getting location:', error.message);
    };

    const calculateRadius = (zoomLevel) => {
        const effectiveZoomLevel = Math.max(zoomLevel, minZoomLevel-4);
        const scaleFactor = 1.6;
        return Math.pow(scaleFactor, mapDefaultZoom - effectiveZoomLevel);
    };

    const removeAllMarker = () => {
        if (markers.length > 0) {
            markers.forEach(marker => marker.remove());
        }
    }

    const markerIsVisible = (marker) => {
        let lngLat = marker.getLngLat();
        let point = mapRef.current.project(lngLat);
        let isVisible = (
            point.x >= 0 && point.x <= mapRef.current.getContainer().clientWidth &&
            point.y >= 0 && point.y <= mapRef.current.getContainer().clientHeight
        );
        marker.getElement().style.display = isVisible ? 'flex' : 'none';
    }

    const handleDragMap = () => {
        if (markers.length > 0) {
            markers.forEach(marker => markerIsVisible(marker));
        }
    };

    const setMapInteractive = (interactive) => {
        if (interactive) loadMarkers();
        if (mapRef.current) {
            mapRef.current.boxZoom[interactive ? 'enable' : 'disable']();
            mapRef.current.scrollZoom[interactive ? 'enable' : 'disable']();
            mapRef.current.dragPan[interactive ? 'enable' : 'disable']();
            mapRef.current.dragRotate[interactive ? 'enable' : 'disable']();
            mapRef.current.keyboard[interactive ? 'enable' : 'disable']();
            mapRef.current.doubleClickZoom[interactive ? 'enable' : 'disable']();
            mapRef.current.touchZoomRotate[interactive ? 'enable' : 'disable']();
        }
    };

    const closeAllPopups = () => {
        popups.map(popup => popup.remove());
    };

    const flyToLocation = (coordinates) => {
        if (mapRef.current) {
            closeAllPopups();
            setMapInteractive(false);
            mapRef.current.flyTo({
                center: [coordinates.longitude,coordinates.latitude],
                zoom: mapDefaultZoom,
                speed: 1.2,
                curve: 1.42,
                essential: true
            });
        }

        mapRef.current.once('moveend', () => setMapInteractive(true));
    };

    const handleDelete = () => {
        if (selectedMarker) {
            axios.delete(`/api/markers/${selectedMarker.id}`).then(() => {
                console.log(`Marker positions updated:${selectedMarker.id}`);
                loadMarkers();
                setSelectedMarker(null);
            });
        }
    };

    const handleUpdate = (updatedMarker) => {
        if (selectedMarker) {
            if(updatedMarker.title.length > 255) {
                window.alert('Title too long!');
            }

            if(updatedMarker.description.length > 510) {
                window.alert('Description too long!');
            }

            if (updatedMarker.title.length <=255 && updatedMarker.description.length <= 510) {
                axios.put(`/api/markers/${selectedMarker.id}`, updatedMarker)
                    .then(() => {
                        console.log(`Marker updated:${selectedMarker.id}`);
                        loadMarkers();
                        setSelectedMarker(null);
                    })
            }
        }
    };

    const handleDragMarker = (marker, data) => {
        const lngLat = marker.getLngLat();

        const updatedMarker = {
            title: data.title,
            description: data.description,
            longitude: lngLat.lng,
            latitude: lngLat.lat,
            type_id: data.type_id,
            photo: data.photo,
            link: data.link,
        };

        axios.put(`/api/markers/${data.id}`, updatedMarker).then(() => {
            console.log(`Marker positions updated:${data.id}`);
        });
    };

    const handleCheckboxChange = () => {
        setEditMode(!editMode);
        onEditModeChange(!editMode);
    };

    const createMarker = (data, index) => {
        const latitude = data.latitude;
        const longitude = data.longitude;
        const popupContent = document.createElement('div');

        const title = document.createElement('span');
        title.textContent = data.title ? data.title : 'Pas de titre';
        title.className = 'popup-title';

        const description = document.createElement('span');
        description.textContent = data.description ? data.description : 'Pas de description';
        description.className = 'popup-description';


        const thumb = document.createElement('img');
        thumb.src = 'https://fakeimg.pl/50x50/';
        thumb.className = 'popup-thumb';

        const button = document.createElement('div');
        button.className = 'popup-button';

        const link = document.createElement('a');
        button.appendChild(link).innerHTML = "<span>Voir la fiche</span>";

        const searchId = markerTypes.findIndex(markerType => markerType.id === data.type_id);

        button.addEventListener('click', () => {
            if(searchId >= 0) {
                data.type_description = markerTypes[searchId].description;
            }
            setSelectedMarker(data);
            marker.getPopup().remove();
        });

        popupContent.appendChild(title);
        popupContent.appendChild(description);

        if(searchId >= 0) {
            const typeId = document.createElement('span');
            typeId.textContent = markerTypes[searchId].description;
            typeId.className = 'popup-type';
            popupContent.appendChild(typeId);
        }

        popupContent.appendChild(thumb);

        if(data.description || editor){
            popupContent.appendChild(button);
        }

        if(data.user !== undefined && data.user !== null) {
            const user = document.createElement('span');
            user.textContent = 'user: ' + data.user;
            user.className = 'popup-user';
            popupContent.appendChild(user);
        }

        const popup = new mapboxgl.Popup({
            offset: 40,
            closeButton: false,
            closeOnClick: true,
            closeOnMove: true
        }).setDOMContent(popupContent);

        const iconElement = document.createElement('img');
        iconElement.src = 'images/marker.svg';
        iconElement.className = 'marker-icon';
        setPopups([popup]);

        const marker = new mapboxgl.Marker({
            element:iconElement,
            draggable: editor
        })
            .setLngLat([longitude,latitude])
            .setPopup(popup)
            .addTo(mapRef.current)

        if(editor && !editMode) {
            marker.on('dragend', () => handleDragMarker(marker, data));
        }

        marker.properties = {
            index: data.id,
            title: data.title,
            description: data.description,
            type_id: data.type_id
        };

        const markerElement = marker.getElement();
        markerElement.style.cursor = 'pointer';
        markerElement.style.display = 'flex';
        markerElement.dataset.index = data.id;

        markerIsVisible(marker);

        markers[index] = marker;
    }

    const loadMarkers = () => {
        const latitude = mapRef.current.getCenter().lat;
        const longitude = mapRef.current.getCenter().lng;
        const radius = calculateRadius(mapRef.current.getZoom());

        axios.get(process.env.API_MARKER, {
                params: { latitude, longitude, radius }
            })
            .then(response => {
                removeAllMarker();
                setMarkersData(response.data);
            });
    }

    const handleMapClick = (e) => {
        if (editMode) {
            setEditMode(false);
            onEditModeChange(false);

            const newMarker = {
                latitude: e.lngLat.lat,
                longitude: e.lngLat.lng,
                title: '',
                description: '',
                type_id: null
            };

            setPopupMarker(newMarker);
            setIsPopupOpen(true);
            setMapInteractive(false);
        }
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setPopupMarker(null);
        setMapInteractive(true);
    };

    const handleUpdateMarker = (updatedMarker) => {
        axios.post('/api/markers', updatedMarker).then(() => {
            loadMarkers();
        });
    };

    const searchByApi = (searchQuery) => {
        return axios.get(
        `${ process.env.API_GEOCODING + encodeURIComponent(searchQuery) }.json`,
        {
            params: {
                access_token: process.env.MAP_TOKEN,
                limit: 1,
            }
        });
    };

    const getLastPosition = () => {
        axios.get('/api/user/last-position')
            .then((response) => {
                const lastPosition = response.data.lastPosition;
                if (lastPosition && lastPosition.length === 2) {
                    mapRef.current.setCenter([lastPosition[1], lastPosition[0]]);
                    mapRef.current.setZoom(mapDefaultZoom);
                }
            })
            .catch((error) => {
                console.error('Error fetching last position:', error);
            });
    }

    const saveLastPosition = () => {
        const center = mapRef.current.getCenter();
        const lastPosition = [center.lat, center.lng];

        axios.post('/api/user/last-position', {
            lastPosition
        });
    }

    useEffect(() => {
        axios.get('/api/marker/types')
            .then(response => setMarkerTypes(response.data))
            .catch(error => console.error('Error fetching marker types:', error));
    }, []);

    useEffect(() => {
        if(getGeoloc){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        }
    }, [getGeoloc]);

    useEffect(() => {
        if(getEditChange) handleCheckboxChange();
    }, [getEditChange]);

    useEffect(() => {
        removeAllMarker();
        if(getSearchMarker.length > 0) {
            const lowercasedQuery = getSearchMarker.toLowerCase();

            const filteredMarkers = markersData.filter(markerData => {
                const title = markerData.title?.toLowerCase() || '';
                const description = markerData.description?.toLowerCase() || '';
                return title.includes(lowercasedQuery) || description.includes(lowercasedQuery);
            });

            filteredMarkers.map((data, index) => {
                createMarker(data, index);
            });
        } else {
            markersData.map((data, index) => {
                createMarker(data, index);
            });
        }
    }, [getSearchMarker, markersData]);

    useEffect(() => {
        if(getSearch.length > 0) {
            const lowercasedQuery = getSearch.toLowerCase();
            searchByApi(lowercasedQuery).then(response => {
                removeAllMarker();
                flyToLocation(response.data.features[0].properties.coordinates);
            });
        }
    }, [getSearch]);

    useEffect(() => {
        if (mapRef.current) {
            if (editMode && cursorIconRef.current) {
                cursorIconRef.current.style.display = 'flex';
                mapRef.current.on('mousemove', (e) => {
                    cursorIconRef.current.style.left = `${e.point.x}px`;
                    cursorIconRef.current.style.top = `${e.point.y}px`;
                });
            } else {
                cursorIconRef.current.style.display = 'none';
                cursorIconRef.current.style.left = '0px';
                cursorIconRef.current.style.top = '0px';
            }

            if (editMode) {
                mapRef.current.getCanvas().classList.add('custom-cursor');
                mapRef.current.on('click', handleMapClick);
            }  else {
                mapRef.current.getCanvas().classList.remove('custom-cursor');
                mapRef.current.off('click', handleMapClick);
            }
            return () => {
                mapRef.current.off('click', handleMapClick);
            };
        }
    }, [editMode]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.on('drag', handleDragMap);
            return () => {
                mapRef.current.off('drag', handleDragMap);
            };
        }
    }, [markersData]);

    useEffect(() => {
        if (!mapRef.current) {
            mapboxgl.accessToken = process.env.MAP_TOKEN;

            mapRef.current = new mapboxgl.Map({
                style: process.env.MAP_BOX_STYLE,
                center: viewport,
                zoom: mapDefaultZoom,
                pitch: 45,
                bearing: -17.6,
                minZoom: minZoomLevel,
                maxZoom: maxZoomLevel,
                container: 'map-container',
                antialias: false
            });

            mapRef.current.on('load', () =>{
                getLastPosition();
                loadMarkers();
            });

            mapRef.current.on('movestart', () => {
                setSelectedMarker(null);
            });

            mapRef.current.on('moveend', () => {
                loadMarkers();
                saveLastPosition();
            });

            mapRef.current.on('style.load', () => {
                const layers = mapRef.current.getStyle().layers;
                const labelLayerId = layers.find(
                    (layer) => layer.type === 'symbol' && layer.layout['text-field']
                ).id;

                mapRef.current.addLayer(
                    {
                        id: 'add-3d-buildings',
                        source: 'composite',
                        'source-layer': 'building',
                        filter: ['==', 'extrude', 'true'],
                        type: 'fill-extrusion',
                        minzoom: 15,
                        paint: {
                            'fill-extrusion-color': '#aaa',
                            'fill-extrusion-height': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'height']
                            ],
                            'fill-extrusion-base': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'min_height']
                            ],
                            'fill-extrusion-opacity': 0.6
                        }
                    },
                    labelLayerId
                );
            });

            return () => {
                if (mapRef.current) {
                    mapRef.current.remove();
                }
            };

        }
    }, []);

    return (
        <div className='map-app'>
            <div
                id="map-container"
                className='map-container'
                ref={mapContainerRef}>
            </div>
            {editor && (
                <div ref={cursorIconRef} className='custom-cursor-icon'>
                    <img src="/images/add-marker.svg" alt="Custom Cursor" />
                </div>
            )}
            <Sheet marker={selectedMarker}
                   handleUpdate={handleUpdate}
                   handleDelete={handleDelete}
                   editor={editor}
                   markerTypes={markerTypes}
            ></Sheet>
            {isPopupOpen && popupMarker && (
                <EditMarkerPopup
                    marker={popupMarker}
                    onUpdate={handleUpdateMarker}
                    onClose={handlePopupClose}
                    markerTypes={markerTypes}
                />
            )}
        </div>
    );
}

export default Map;