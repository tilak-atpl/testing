import React, { useState, useEffect, useRef } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
// import { Icon } from '@iconify/react';
// import locationIcon from '@iconify/icons-mdi/map-marker';
import { SearchOutlined } from '@ant-design/icons';
import { Menu, Tooltip } from 'antd';

import { GMAP_API_KEY } from '../../../utils/constants';
import '../Map.css';
import { mapContextMenuItems } from '../../../utils/liveMapUtils';

const MapContainer = ({ google, location, zoomLevel, editable, geofence, setGeofence, setCircleSelected, geofenceType }) => {
  const mapRef = useRef(null);

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuLocation, setContextMenuLocation] = useState({pixel: {x: 0, y: 0}});
  const [marker, setMarker] = useState(null);
  const [circle, setCircle] = useState(null);
  const [center, setCenter] = useState({...geofence?.center});
  const [circleRadius, setCircleRadius] = useState(geofence?.radius);

  useEffect( () => {
    // Create the search box and link it to the UI element.
    const map = mapRef.current.map;
    const input = document.getElementById('search-input');
    const searchBox = new google.maps.places.SearchBox(input);
    map.mapTypeControlOptions = {position: google.maps.ControlPosition.TOP_RIGHT}
    map.zoomControlOptions = {position: google.maps.ControlPosition.RIGHT_BOTTOM}
    
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    let markers = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          }),
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }, []);

  useEffect( () => {
    const initMap = () => {
      if (marker) {
        marker.setMap(null);
      }

      const newMarker = new google.maps.Marker({
        position: geofence.center,
        title: geofence.geofence,
        map: mapRef.current.map,
        draggable: editable,
        animation: google.maps.Animation.DROP,
      });
      function toggleBounce() {
        if (newMarker.getAnimation() !== null) {
          newMarker.setAnimation(null);
        } else {
          newMarker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
      newMarker.addListener("click", toggleBounce);

      if (circle) {
        circle.setMap(null);
      }

      const newCircle = new google.maps.Circle({
        center: newMarker.getPosition(),
        radius: geofence.radius,
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.25,
        map: mapRef.current.map,
        draggable: editable,
        editable: editable
      });
      
      let dragStartPos = null;
      let isDragging = false;
      newMarker.addListener('dragstart', event => {
        dragStartPos = event.latLng;
        isDragging = true
      });
      newMarker.addListener('drag', event => {
        if (!isDragging) return;
        const newMarkerPos = event.latLng;
        
        const lat = newCircle.getCenter().lat() + newMarkerPos.lat() - dragStartPos.lat()
        const lng = newCircle.getCenter().lng() + newMarkerPos.lng() - dragStartPos.lng()
        newCircle.setCenter({lat, lng});
        animateMapCenter(newMarker.getPosition());
        dragStartPos = newMarkerPos;
      });
      newMarker.addListener('dragend', (event) => {
        const newMarkerPos = event.latLng;
        
        const lat = newCircle.getCenter().lat() + newMarkerPos.lat() - dragStartPos.lat()
        const lng = newCircle.getCenter().lng() + newMarkerPos.lng() - dragStartPos.lng()
        newCircle.setCenter({lat, lng});
        setNewCenter(newMarker.getPosition());
        isDragging = false;
      });

      newCircle.addListener('click', event => {
        setCircleSelected(true);
      });
      newCircle.addListener('dragstart', event => {
        dragStartPos = event.latLng;
        isDragging = true
      });
      newCircle.addListener('drag', event => {
        if (!isDragging) return;
        const newCirclePos = event.latLng;
        
        const lat = newMarker.getPosition().lat() + newCirclePos.lat() - dragStartPos.lat()
        const lng = newMarker.getPosition().lng() + newCirclePos.lng() - dragStartPos.lng()
        newMarker.setPosition({lat, lng});
        animateMapCenter(newMarker.getPosition());
        dragStartPos = newCirclePos;
      });
      newCircle.addListener('dragend', (event) => {
        const newCirclePos = event.latLng;
        
        const lat = newMarker.getPosition().lat() + newCirclePos.lat() - dragStartPos.lat()
        const lng = newMarker.getPosition().lng() + newCirclePos.lng() - dragStartPos.lng()
        newMarker.setPosition({lat, lng});
        setNewCenter(newMarker.getPosition());
        isDragging = false;
      });
      newCircle.addListener('radius_changed', () => {
        setCircleRadius(Number(newCircle.getRadius()));
      });

      setMarker(newMarker);
      setCircle(newCircle);
      setNewCenter(newMarker.getPosition());
      setCircleRadius(Number(newCircle.getRadius()));
    };
  
    initMap();
  }, [geofence, editable]);

  useEffect( () => {
    const newGeo = {...geofence, center, radius: circleRadius}
    setGeofence({...newGeo});
  }, [center, circleRadius]);


  const setNewCenter = (newCenter) => {
    if (newCenter === undefined) return;
    
    setCenter({lat: newCenter.lat(), lng: newCenter.lng()});
    animateMapCenter(newCenter);
  };
  const animateMapCenter = (newCenter) => {
    const map = mapRef.current.map;
    const currentCenter = map.getCenter();
  
    if (currentCenter === undefined || currentCenter.equals(newCenter))
      return;
  
    const panOptions = {
      duration: 1000,
    };
    map.panTo(newCenter, panOptions);
  };

  const handleMapClick = (mapProps, map, e) => {
    setContextMenuVisible(false);
  }
  const handleMapRightClick = (mapProps, map, e) => {
    if (!geofence.isNew || !editable) return;
    setContextMenuLocation({pixel: e.pixel, latLng: e.latLng});
    setContextMenuVisible(true);
  };
  const handleCreateGeofence = ({key}) => {
    setContextMenuVisible(false);

    setNewCenter(contextMenuLocation.latLng)
    setCircleRadius(1000);
    marker.setPosition(contextMenuLocation.latLng);
    circle.setCenter(contextMenuLocation.latLng);
    circle.setRadius(1000)
  };

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%"
  };

  return (
    <div className='google-map'>
      <div className='w-1/4 absolute flex flex-row justify-between items-center'>
        <input id="search-input" className='py-3 pl-5' placeholder='Search Google Maps' />
        <Tooltip title="Search" placement='bottom'>
            <SearchOutlined
              style={{
                position: 'relative',
                left: 320,
                top: 23,
                zIndex: 1,
                color: 'rgba(0,0,0,.75)',
                fontSize: 24
              }}
            />
          </Tooltip>
      </div>

      <div className='absolute'>
      {contextMenuVisible && (
      <Menu
        className='absolute bg-white'
        hidden={!contextMenuVisible}
        style={{
          width: 200,
          zIndex: 1,
          top: contextMenuLocation.pixel.y,
          left: contextMenuLocation.pixel.x,
          boxShadow: '0 1px 2px rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)'
        }}
        onClick={handleCreateGeofence}
        items={mapContextMenuItems}
      />
      )}
      </div>

      <Map
        style={{borderRadius: 10}}
        containerStyle={containerStyle}
        google={google}
        zoom={zoomLevel}
        onClick={handleMapClick}
        onRightclick={handleMapRightClick}
        scaleControl={true}
        ref={mapRef}
      >
        <Marker position={location} />
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: GMAP_API_KEY,
})(MapContainer);