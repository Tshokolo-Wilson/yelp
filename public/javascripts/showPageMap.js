
maptilersdk.config.apiKey = maptilerApikey  ;

const map = new maptilersdk.Map({
container: 'map',
style: maptilersdk.MapStyle.BRIGHT,
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 10// starting zoom
});

new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h1>${campground.title}</h1><p>${campground.location}</p>`
            )
    )
    .addTo(map)