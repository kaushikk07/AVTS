function searchData() {
    const licenseNumber = document.getElementById('licenseInput').value;
    const date = document.getElementById('dateInput').value;
  
    // Construct the API URL with the provided inputs
    const apiUrl = `http://localhost:3000/search/${licenseNumber}/${date}`;
  
    // Fetch data from the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
            localStorage.clear();
            localStorage.setItem('fetchedData', JSON.stringify(data));
            storeData(data);
            displayResults(data)
        })
      .catch(error => console.error('Error fetching data:', error));
}


function storeData(data){
    if(data.length === 0){
        console.log("Not enough data found")
        return;
    }
    
    if(data.length > 1){
        let origin = { lat: parseFloat(data[0].lat),lng: parseFloat( data[0].lang)}
        let destination = { lat: parseFloat(data[data.length - 1].lat),lng: parseFloat( data[data.length - 1].lang)}
        const middleElements = data.slice(1, -1);
        const wayPoints = middleElements.map(entry => ({
            location: {
                lat: parseFloat(entry.lat), // Assuming camlat is a string, convert to a floating-point number
                lng: parseFloat(entry.lang), // Assuming camlong is a string, convert to a floating-point number
            }
        }));

        localStorage.setItem('origin', JSON.stringify(origin));
        localStorage.setItem('destination', JSON.stringify(destination)); 
        localStorage.setItem('wayPoints', JSON.stringify(wayPoints));

    }
}


function displayResults(data) {
    const resultList = document.getElementById('resultList');
    resultList.innerHTML = ''; // Clear previous results

    const resultTable = document.getElementById('resultTable');
    const tbody = resultTable.querySelector('tbody');
    tbody.innerHTML = ''; // Clear previous tbody content

    if (data.length === 0) {
        const noResultsRow = tbody.insertRow();
        const cell = noResultsRow.insertCell(0);
        cell.colSpan = 6; // Set colspan to cover all columns
        cell.textContent = 'No results found';
    } else {
        data.forEach(entry => {
            const row = tbody.insertRow();

            const licensePlateCell = row.insertCell(0);
            const dateCell = row.insertCell(1);
            const timeCell = row.insertCell(2);
            const cameraNoCell = row.insertCell(3);
            const latCell = row.insertCell(4);
            const langCell = row.insertCell(5);

            licensePlateCell.textContent = entry.license_plate;
            
            const fullDate = new Date(entry.date);
            const formattedDate = fullDate.toISOString().split('T')[0];
            dateCell.textContent = formattedDate;
            
            timeCell.textContent = entry.time;
            cameraNoCell.textContent = entry.camera_no;
            latCell.textContent = entry.lat;
            langCell.textContent = entry.lang;
        });
    }

    resultTable.appendChild(tbody);
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


    let origin = localStorage.getItem('origin');
    let destination = localStorage.getItem('destination');
    let wayPoints = localStorage.getItem('wayPoints');

    console.log(origin);
    console.log(destination);

  
  
    displayRoute(
      JSON.parse(origin),
      JSON.parse(destination),
      directionsService,
      directionsRenderer,
      JSON.parse(wayPoints)
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



 

  