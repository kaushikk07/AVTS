function fetchAndDisplayTheftData() {
    // Make a GET request to fetch theft data from the server
    fetch('http://localhost:3000/fetch-theft')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Store the data in local storage (optional)
        localStorage.setItem('theftData', JSON.stringify(data));
  
        // Display the list of theft data in the provided table format
        displayTheftData(data);
      })
      .catch(error => {
        console.error('Error fetching theft data:', error);
      });
  }
  
  function displayTheftData(data) {
    const resultList = document.getElementById('resultList');
    resultList.innerHTML = ''; // Clear previous content
  
    // Iterate through the data and add rows to the table
    data.forEach(theft => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${theft.license_plate}</td><td>${theft.theft_lat}</td><td>${theft.theft_lang}</td><td>${theft.tracking}</td><td>${theft.recovered}</td>`;
      resultList.appendChild(row);
    });
  }
  



function insertTheft(theftDetails) {
    // Make a POST request to your server
    fetch('http://localhost:3000/insert-theft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(theftDetails),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Theft details inserted successfully!');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error inserting theft details. Please try again.');
    });
}
  
  function submitForm() {
    const licensePlate = document.getElementById('licensePlate').value;
    const theft_lat = document.getElementById('theft_lat').value;
    const theft_lang = document.getElementById('theft_lang').value;
    const tracking = document.getElementById('tracking').checked;
    const recovered = document.getElementById('recovered').checked;
  
    const theftDetails = {
        "licensePlate": licensePlate,
        "theft_lat": theft_lat,
        "theft_lang": theft_lang,
        "tracking": true,
        "recovered": false
    };
  
    insertTheft(theftDetails);
    fetchAndDisplayTheftData();
}


function recoverVehicle() {
  const licensePlate = document.getElementById('licensePlate').value;

  // Make a PUT request to update tracking to 0 and recovered to 1 for the specified license plate
  fetch(`http://localhost:3000/update-theft/${licensePlate}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "tracking": 0,
      "recovered": 1
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Vehicle recovered successfully!');
    fetchAndDisplayTheftData(); // Refresh the theft data after successful recovery
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error recovering vehicle. Please try again.');
  });
}


// Initial fetch and display when the page loads
window.onload = fetchAndDisplayTheftData;