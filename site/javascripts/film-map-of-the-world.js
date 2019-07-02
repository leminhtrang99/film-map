const articleUrl = 'https://en.wikipedia.org/wiki/';

mapboxgl.accessToken = 'pk.eyJ1IjoibGVtaW5odHJhbmc5OSIsImEiOiJjanhjcWhpcWkwNjZjM3lxdzN5dzh6NjFwIn0.MPKOUmqASix_dgzzbUBM_Q'; // replace this with your access token
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/leminhtrang99/cjxfp4zzr1ghc1clbo1q23cxr', // replace this with your style URL
      center: [31.288, 21.448],
      zoom: 1.27
    });

map.on('load', function() {
  map.setLayoutProperty('film-label', 'text-field', ['format',
  ['get', 'title_clean'], { 'font-scale': 1.2 },
  '\n', {},
  ['get', 'city/mountain/poi'], {
  'font-scale': 0.8,
  'text-font': ['literal', [ 'Ubuntu Light Italic', 'Arial Unicode MS Regular' ]],
  'text-halo-width': 0
  }
  ]);
});


//Navigations
var nav = new mapboxgl.NavigationControl({
    showCompass: false,
    showZoom: true
});

map.addControl(nav, "top-right");
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

//Hover over each point
map.on('mouseenter', 'film-label', function(e){
  //Change the cursor style as a UI indicator
  map.getCanvas().style.cursor='help';
  var coordinates = e.features[0].geometry.coordinates.slice();
  var title = e.features[0].properties.title;
  var extract = e.features[0].properties.extract;
  var url = articleUrl + title;
  //console.log(extract);
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  
  document.getElementById('info').innerHTML=extract;
  document.getElementById('wikiLink').href = url;
  document.getElementById('wikiLink').classList.add('show');

  $('#info').html(function(i, v){
    var matches = /(.+)( is a.+)/gi.exec(v);
    return '<strong>' + matches[1] + '</strong>' + matches[2];
  });

});

map.on('mouseleave', 'film-label', function() {
  map.getCanvas().style.cursor = '';
  //document.getElementById('wikiLink').classList.remove("show");
  //popup.remove();
});

//Definition of "Wikipedia'ed"
document.getElementById('wikipediaed').addEventListener("mouseover", showDef);
document.getElementById('wikipediaed').addEventListener("mouseout", hideDef);

function showDef(){
  document.getElementById('wikidef').classList.add('show');
}

function hideDef(){
  document.getElementById('wikidef').classList.remove('show');
}

 
document.getElementById('creditButton').addEventListener('click',showCreds);
function showCreds(){
  document.getElementById('credit').classList.add('show');
}

document.getElementById('credit').addEventListener('click', function(){
  document.getElementById('credit').classList.remove('show');
})

