let map, heatmap;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 11.01966717358649, lng: 76.96546532169332 },
    mapTypeId: "satellite",
  });
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map,
  });
  document
    .getElementById("toggle-heatmap")
    .addEventListener("click", toggleHeatmap);
  document
    .getElementById("change-gradient")
    .addEventListener("click", changeGradient);
  document
    .getElementById("change-opacity")
    .addEventListener("click", changeOpacity);
  document
    .getElementById("change-radius")
    .addEventListener("click", changeRadius);
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)",
  ];

  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints3() {

    console.log([
        new google.maps.LatLng(37.782551, -122.445368),
        new google.maps.LatLng(37.782745, -122.444586),
        
      ])
  return [
    new google.maps.LatLng(37.782551, -122.445368),
    new google.maps.LatLng(37.782745, -122.444586),
    
  ];
}


function getPoints() {
    // Create an array to store LatLng objects
    const pointsArray = [];
  
    // Fetch data from your API endpoint
    fetch('http://localhost:3000/get-theft-locations')
      .then(response => response.json())
      .then(data => {
        // Assuming your API response is an array of objects with 'theft_lat' and 'theft_lang' properties
        data.forEach(entry => {
          const latLng = new google.maps.LatLng(parseFloat(entry.theft_lat), parseFloat(entry.theft_lang));
          // Push each LatLng object to the array
          for (let i = 0; i < 5; i++) {
            pointsArray.push(latLng);
          }
        });
  
        // Log the points array to the console
        console.log(pointsArray);
  
        // If you need to perform additional actions with the points, you can do so here
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
      });
  
    // Return the array of LatLng objects
    return pointsArray;
}


window.initMap = initMap;