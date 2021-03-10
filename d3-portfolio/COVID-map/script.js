//mapboxgl.accessToken =
//  'pk.eyJ1IjoiYXczMjMwIiwiYSI6ImNqdzI5ODZwejB1ZGkzeXFwZHQ5dGpiYjgifQ.4L8LsuWyVvyA2PlELAhg0Q'
//const map = new mapboxgl.Map({
//  container: 'map',
//  style: 'mapbox://styles/aw3230/ck45gulvp08gn1cp5omwlc6oq',
//  center: [-81.379234, 28.538336],
//  zoom: 15.5,
//  bearing: 27,
//  pitch: 45
//}) 

mapboxgl.accessToken = 'pk.eyJ1IjoiYXczMjMwIiwiYSI6ImNqdzI5ODZwejB1ZGkzeXFwZHQ5dGpiYjgifQ.4L8LsuWyVvyA2PlELAhg0Q';
var map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/aw3230/ckm3c06g709qg17pd30xkej2f',
center: [-118, 37], // starting position
zoom: 5 // starting zoom
});
 
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
