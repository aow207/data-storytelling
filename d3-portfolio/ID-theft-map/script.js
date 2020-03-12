mapboxgl.accessToken =
  'pk.eyJ1IjoiYXczMjMwIiwiYSI6ImNqdzI5ODZwejB1ZGkzeXFwZHQ5dGpiYjgifQ.4L8LsuWyVvyA2PlELAhg0Q'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/aw3230/ck45gulvp08gn1cp5omwlc6oq',
  center: [-81.379234, 28.538336],
  zoom: 15.5,
  bearing: 27,
  pitch: 45
}) 

const chapters = {
  active: {
    bearing: 27,
    center: [-81.379234, 28.538336],
    zoom: 15.5,
    pitch: 20
  },
  orlando: {
    bearing: 27,
    center: [-81.379234, 28.538336],
    zoom: 10,
    pitch: 20
  },
  miami: {
    duration: 6000,
    center: [-80.191788, 25.761681],
    bearing: 150,
    zoom: 9,
    pitch: 0
  },
  tampa: {
    bearing: 45,
    center: [-82.452606, 27.964157],
    zoom: 10,
    pitch: 20,
    speed: 0.5
  },
  gainesville: {
    bearing: 90,
    center: [-82.324829, 29.651634],
    zoom: 13.3,
    speed: 0.6,
    pitch: 40
  },
  palm: {
    bearing: 90,
    center: [-80.59433, 28.040169],
    zoom: 10.3
  },
  daytona: {
    bearing: 45,
    center: [-81.031723, 29.218103],
    zoom: 9.5,
    pitch: 20,
    speed: 0.5
  },
  jacksonville: {
    bearing: 45,
    center: [-81.655647, 30.332184],
    zoom: 13.3,
    pitch: 20,
    speed: 0.5
  },
  homosassa: {
    bearing: 45,
    center: [-82.576134, 28.803705],
    zoom: 12,
    pitch: 20,
    speed: 0.5
  }
}

// On every scroll event, check which element is on screen
window.onscroll = function() {
  const chapterNames = Object.keys(chapters)
  for (let i = 0; i < chapterNames.length; i++) {
    const chapterName = chapterNames[i]
    if (isElementOnScreen(chapterName)) {
      setActiveChapter(chapterName)
      break
    }
  }
}

let activeChapterName = 'statenisland'

function setActiveChapter(chapterName) {
  if (chapterName === activeChapterName) return

  map.flyTo(chapters[chapterName])

  document.getElementById(chapterName).setAttribute('class', 'active')
  document.getElementById(activeChapterName).setAttribute('class', '')

  activeChapterName = chapterName
}

function isElementOnScreen(id) {
  const element = document.getElementById(id)
  const bounds = element.getBoundingClientRect()
  return bounds.top < window.innerHeight && bounds.bottom > 0
}
