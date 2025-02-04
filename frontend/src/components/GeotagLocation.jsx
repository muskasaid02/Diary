import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const GeotagLocation = ({ onLocationSelect }) => {
    // Handle location selection
    const handleSelect = (selected) => {
        if (selected && selected.label) {
            onLocationSelect(selected.label);  // Pass the selected location to the parent
        }
    };

    return (
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
            <GooglePlacesAutocomplete
                apiKey="AIzaSyCRK-sK2LLRiFJ72ZB6dRE-ccMea-fxUiw"
                selectProps={{
                    onChange: handleSelect,
                    placeholder: 'Search location...',
                }}
            />
        </div>
    );
};

export default GeotagLocation;