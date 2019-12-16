mapboxgl.accessToken = "pk.eyJ1IjoiYXczMjMwIiwiYSI6ImNqdzI5ODZwejB1ZGkzeXFwZHQ5dGpiYjgifQ.4L8LsuWyVvyA2PlELAhg0Q";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/aw3230/ck45gulvp08gn1cp5omwlc6oq",
  center: [-74.005974, 40.712776],
  zoom: 15.5,
  bearing: 27,
  pitch: 45
});

var chapters = {
  statenisland: {
    bearing: 27,
    center: [-74.180780, 40.612780],
    zoom: 15.5,
    pitch: 20
  },
  staten: {
    duration: 6000,
    center: [-74.179170, 40.615620],
    bearing: 150,
    zoom: 15,
    pitch: 0
  },
  brooklyn: {
    bearing: 90,
    center: [-73.983640, 40.640300],
    zoom: 13,
    speed: 0.6,
    pitch: 40
  },
  queens: {
    bearing: 90,
    center: [-73.827940, 40.781660],
    zoom: 12.3
  },
  manhattan: {
    bearing: 45,
    center: [-73.985008, 40.749390],
    zoom: 15.3,
    pitch: 20,
    speed: 0.5
  }
};

// On every scroll event, check which element is on screen
window.onscroll = function() {
  var chapterNames = Object.keys(chapters);
  for (var i = 0; i < chapterNames.length; i++) {
    var chapterName = chapterNames[i];
    if (isElementOnScreen(chapterName)) {
      setActiveChapter(chapterName);
      break;
    }
  }
};

var activeChapterName = "statenisland";
function setActiveChapter(chapterName) {
  if (chapterName === activeChapterName) return;

  map.flyTo(chapters[chapterName]);

  document.getElementById(chapterName).setAttribute("class", "active");
  document.getElementById(activeChapterName).setAttribute("class", "");

  activeChapterName = chapterName;
}

function isElementOnScreen(id) {
  var element = document.getElementById(id);
  var bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}
