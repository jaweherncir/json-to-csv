/*const express = require('express');
const multer = require('multer');
const json2csv = require('json2csv').parse;
const fs = require('fs');

const app = express();
const port = 3000;

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

// Serve a form to upload JSON
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html>
<head>
  <!-- Include Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <form action="/upload" method="post" enctype="multipart/form-data">
          <div class="form-group">
            <label for="jsonFile">Upload JSON File</label>
            <input type="file" class="form-control-file" id="jsonFile" name="jsonFile">
          </div>
          <button type="submit" class="btn btn-primary">Upload JSON</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Include Bootstrap JS (optional) -->
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>

  `);
});

// Handle JSON upload
app.post('/upload', upload.single('jsonFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const json = JSON.parse(req.file.buffer.toString());

    if (Array.isArray(json)) {
      if (json.length === 0) {
        throw new Error('Uploaded JSON is an empty array');
      }
    }

    const fields = Array.isArray(json) ? Object.keys(json[0]) : Object.keys(json);
    const csv = json2csv(json, { fields });

    fs.writeFileSync('output.csv', csv);
    res.send('JSON uploaded and converted to CSV. <a href="/download">Download CSV</a>');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error processing the uploaded JSON file.');
  }
});

// Serve the CSV file for download
app.get('/download', (req, res) => {
  const csv = fs.readFileSync('output.csv', 'utf8');
  res.header('Content-Disposition', 'attachment; filename=converted.csv');
  res.type('csv');
  res.send(csv);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
*/













/*const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://freezepix:freezepix@freezepix.mhc6ham.mongodb.net/crystal', { useNewUrlParser: true });

// Create a Mongoose model for your collection
const jsonDataModel = mongoose.model('JsonData', {
  data: Object
});

// Create a route to handle JSON file upload and data storage
app.post('/upload', (req, res) => {
  // Read the JSON file
  const jsonData = JSON.parse(fs.readFileSync('29439939.json', 'utf8'));

  // Create a new document and save it to the collection
  const newJsonData = new jsonDataModel({ data: jsonData });
  newJsonData.save()
    .then(result => {
      res.send('JSON data saved to MongoDB');
    })
    .catch(error => {
      res.status(500).send('Error saving JSON data to MongoDB');
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
*/






const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const app = express();
const port = 3000;
const cors= require("cors");
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
// Connect to MongoDB
mongoose.connect('mongodb+srv://freezepix:freezepix@freezepix.mhc6ham.mongodb.net/crystal', { useNewUrlParser: true });

// Create a Mongoose model for your collection
const jsonDataModel = mongoose.model('JsonData', {
  fileName: String, // Add this field
  data: Object,
  shipUser:String,
  billToUser:String,
  Total:String,
  imagesprod:String
});

// Use the express-fileupload middleware to handle file uploads
app.use(fileUpload());

// Create a route to handle JSON file upload and data storage
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const promises = [];

  // Iterate through the uploaded files
  for (const fileKey in req.files) {
    const file = req.files[fileKey];

    if (file.name.endsWith('.json')) {
      // Generate a unique name for the file based on its original name
      const uniqueFileName = `${file.name}`;

      // Read the JSON file
      const jsonData = JSON.parse(file.data.toString('utf8'));

      let totalPrice = 0;

      // Iterate through the items and accumulate the prices
      jsonData.orders[0].serviceOrders[0].items.forEach((item) => {
        const itemPrice = item.options[0].price;
        console.log(itemPrice)
        totalPrice += itemPrice;
      });
      
      // Output the total sum of prices
      console.log(`Total sum of prices: $${totalPrice.toFixed(2)}`);
     // const subtotal = jsonData.orders[0].serviceOrders[0].items[0].options[0].price;
      // Create a new document and save it to the collection
      const images="https://drive.google.com/drive/folders/1qIqgGPvv-wTjz9DStUVeVabJd__bVLwW"
      const newJsonData = new jsonDataModel({ 
        fileName: uniqueFileName, 
        data: jsonData,
        shipUser:jsonData.shipTo.firstName,
        billToUser:jsonData.billTo.firstName,
        //Total:totalPrice,
        imagesprod:images
   
      });
      //console.log(subtotal);

      promises.push(newJsonData.save());
    
    }
  }

  // Wait for all promises to resolve before sending the response
  Promise.all(promises)
    .then(results => {
      res.json({ success: true, message: `order  registered with success ${results.length} files.` });
      
    })
    .catch(error => {
      res.status(401).json({ success: false, message: 'order already registered' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




 //colcul som of price 
 // mlultiple factures 
