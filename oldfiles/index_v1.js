const input = document.getElementById('searchInput');
const value = input.value;

let btn = document.getElementById('searchBtn');

btn.addEventListener('click', function() {
    // Get the current value when the button is clicked
    const value = input.value;
    searchApiData(value);
});


// function displayResults(data) {
//     const resultList = document.getElementById('resultList');
//     resultList.innerHTML = ''; // Clear previous results

//     if (data.length === 0) {
//         resultList.innerHTML = '<li>No results found</li>';
//     } else {
//         data.forEach(entry => {
//             const listItem = document.createElement('li');
//             listItem.textContent = `License No: ${entry.license_plate}, Date: ${entry.date}, Time: ${entry.time}, Cam No: ${entry.camno}`;
//             resultList.appendChild(listItem);
//         });
//     }
// }

function searchApiData(keyword) {

    console.log(keyword);
    // Replace this URL with the actual URL of your API endpoint
    const apiUrl = `http://localhost:3000/search/${keyword}`;
 

    // Clear previous results
    document.getElementById('resultContainer').innerHTML = '';

    // Fetch data from your API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayResults(data) {
    const resultContainer = document.getElementById('resultContainer');

    // Check if there are no results
    if (data.length === 0) {
        resultContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Display each result
    data.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('data-item');
        itemElement.innerHTML = `
            <p><strong>ID:</strong> ${item.sno}</p>
            <p><strong>Name:</strong> ${item.license_no}</p>
        `;
        resultContainer.appendChild(itemElement);
    });
}




function initMaps() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: { lat: 11.01966717358649, lng: 76.96546532169332 }, // Coimbatore
    });
    const directionsService = new google.maps.DirectionsService();
  
    const directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
      map,
      panel: document.getElementById("panel"),
    });
  
    directionsRenderer.addListener("directions_changed", () => {
      const directions = directionsRenderer.getDirections();
  
      if (directions) {
        computeTotalDistance(directions);
      }
    });
  
    displayRoute(
      { lat: 11.01966717358649, lng: 76.96546532169332 },
      { lat: 11.025310715062894, lng: 76.91852270860257 },
      directionsService,
      directionsRenderer,
      [{ location: { lat: 11.028097250306507, lng: 76.93279477794101 } }]
    );
}


  
function displayRoute(origin, destination, service, display, waypoints) {
    service
        .route({
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: false,
        })
        .then((result) => {
            display.setDirections(result);
        })
        .catch((e) => {
            console.log("Could not display directions due to: " + e);
        });
}
  
function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];
  
    if (!myroute) {
      return;
    }
  
    for (let i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
  
    total = total / 1000;
    document.getElementById("total").innerHTML = total + " km";
}


let loadbutton = document.getElementById("loadmap");

loadbutton.addEventListener('click', function () {
    initMaps();
});

 
