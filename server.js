// Create express object from express module
let express = require('express');
// Create body parser object from body-parser package
let bodyParser = require('body-parser');
// Call express constructor to create express application object
let app = express();
let fs = require('fs');
app.use(bodyParser.urlencoded({ extended: false }));

// Use the __dirname global value to create fully qualified url
app.get('/', (request, response) => response.sendFile(__dirname + "/index.html"));

// New customer, clear all fields
app.post('/new', (request, response) => {
    let postBody = request.body;
    //Clear all textboxes
    postBody.cusID = ""
    postBody.firstname = "";
    postBody.lastname = "";
    postBody.address = "";
    postBody.city = "";
    postBody.province = "";
    postBody.postal = "";
    response.send(postBody);
    console.log("All textboxes are cleared ");
});


//Add button and add new customer with unique customer ID
app.post('/add', (request, response) => {
    let postBody = request.body;
    // Change values into JSON
    let jsonData = JSON.stringify(postBody);
    let filePath = __dirname + "/data/";
    // Check all fields have data
    if(postBody.cusID !== "" && postBody.firstname !== ""  && postBody.lastname !== "" && postBody.address !== ""  && postBody.city !== "" && postBody.province !== "" && postBody.postal !== "") {
        // Check file and check customer ID
        if (fs.existsSync(filePath+ postBody.cusID + ".txt")) {
            console.log("Customer is already exists!");
        }
        else {
            // If customer does not exist, save data
            fs.writeFile(filePath + postBody.custID  + ".txt", jsonData, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Customer's information is added!");
                }
            });
        }  
    }
    // Return message if any information of customer is empty
    else {
        console.log("Please provide all information!")
    }
});

// Update customer if customer ID exists
app.post('/update', (request, response) => {
    let postBody = request.body;
    let jsonData = JSON.stringify(postBody);
    let filePath = __dirname + "/data/";
    // Check empty values 
    if(postBody.custID !== "" && postBody.firstname !== ""  && postBody.lastname !== "" && postBody.address !== ""  && postBody.city !== "" && postBody.province !== "" && postBody.postal !== "") {
        // Check if customer ID and file exist, overwrite new data file.
        if (fs.existsSync(filePath+ postBody.custID + ".txt")) {
            fs.writeFile(filePath + postBody.custID  + ".txt", jsonData, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Customer's information is updated!");
                }
            });
        }
        // If customer does not exist return message 
        else {
            console.log("Can not find the customer's information!")
        }  
    }
    // Return message to enter enough data of customer
    else {
        console.log("Please provide all information!")
    }
  
});

// Delete Customer
app.post('/delete', (request, response) => {
    let postBody = request.body;
    let filePath = __dirname + "/data/";
    // Validate data if data empty 
    if(postBody.custID !== "" && postBody.firstname !== ""  && postBody.lastname !== "" && postBody.address !== ""  && postBody.city !== "" && postBody.province !== "" && postBody.postal !== "") {
        // Check file exists
        if(fs.existsSync(filePath+ postBody.custID + ".txt")){
            // Delete file
            fs.unlinkSync(filePath+ postBody.custID + ".txt");


            // Clear all fields
            postBody.custID = ""
            postBody.firstname = "";
            postBody.lastname = "";
            postBody.address = "";
            postBody.city = "";
            postBody.province = "";
            postBody.postal = "";
            response.send(postBody);
            console.log("Customer information is deleted and all fields are cleared.")
        }
        // Can not delete if customer does not exist
        else {
            console.log("Can't find the customer's information!");
        }
    }
    else {
        console.log("Please provide all information!")
    }
});

// Find customer by customer ID
app.post('/find', (request, response) => {
    let postBody = request.body;
    let filePath = __dirname + "/data/";
    // Validate customer ID
    if(postBody.custID !== "") {
        // Check file exists
        if (fs.existsSync(filePath+ postBody.custID + ".txt")) {
            // Read file to return all data of this customer
            fs.readFile(filePath+ postBody.custID + ".txt", { encoding: 'utf8' }, function (err, data) {
                if (err) {
                    console.log("Error: Could not open file for reading\n");
                }
                else {
                    let customer = JSON.parse(data);
                    postBody.firstname = customer.firstname;
                    postBody.lastname = customer.lastname;
                    postBody.address = customer.address;
                    postBody.city = customer.city;
                    postBody.province = customer.province;
                    postBody.postal = customer.postal;
                    response.send(postBody);
                }
            });
        }
        // Return message if customer does not exist
        else {
            console.log("Customer's information doesn't exist! Please enter a valid customer ID! ")
        }  
    }
    // Return message if customer ID is empty
    else {
        console.log("Please provide customer ID!")
    }
  
});

let port = process.env.PORT || 1337;
// Create the web server running on port 1337
let server = app.listen(port, function () {
    console.log("Server is running on port " + port);
});

