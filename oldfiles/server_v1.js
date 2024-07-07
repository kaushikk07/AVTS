const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());

// Create a MySQL connection
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "kirthik",
//     password: "admin123",
//     database: 'avts'
// });

const connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:'',
  database:"avts"
})

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Express middleware to parse JSON
app.use(express.json());

// Endpoint to search data based on license plate number
app.get('/search/:licensePlate', (req, res) => {
  const licensePlate = req.params.licensePlate;

  // Query to search data based on license plate number
  const query = 'SELECT * FROM detections WHERE license_no = ?';

  // Execute the query
  connection.query(query, [licensePlate], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

app.get('/search/:licensePlate/:date', (req, res) => {
  const licensePlate = req.params.licensePlate;
  const date = req.params.date;

  // Query to search data based on license plate number and date, sorted by time
  const query = 'SELECT d.license_plate, d.date, d.time, c.camera_no ,c.lat, c.lang FROM detections as d, cameras as c WHERE d.camera_no = c.camera_no AND license_plate = ? AND DATE(date) = DATE(?) ORDER BY time';

  // Execute the query
  connection.query(query, [licensePlate, date], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});



app.post('/insert', (req, res) => {
  const { licensePlate, date, time, cameraNo } = req.body;

  if (!licensePlate || !date || !time || !cameraNo) {
    return res.status(400).json({ error: 'Invalid request. Please provide all required fields.' });
  }

  // Query to insert data into the detections table
  const insertQuery = 'INSERT INTO detections (license_plate, date, time, camera_no) VALUES (?, ?, ?, ?)';

  // Execute the query
  connection.query(insertQuery, [licensePlate, date, time, cameraNo], (err, result) => {
    if (err) {
      console.error('Error executing insert query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(201).json({ message: 'Data inserted successfully!' });
  });
});


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
