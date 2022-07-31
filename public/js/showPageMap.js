// const campground = require("../../models/campground");

mapboxgl.accessToken = mapTokken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: campground.geometry.coordinates, // starting position [lng, lat]
        zoom: 5, // starting zoom
        projection: 'globe' // display the map as a 3D globe
        });
        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style
        });
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map)