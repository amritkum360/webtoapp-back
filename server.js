const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const newapp = require('./modules/Models/newapp')
const AppAdmobs = require('./modules/Models/AppAdmobs')
const { exec } = require('child_process');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');


const path = require('path');

const secretKey = "amrit";

require('./modules/Models/dbconnect/dbconnect');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Define the User model
const User = require('./modules/Models/Users');
const firebases = require('./modules/Models/firebase');
const paymentdatas = require('./modules/Models/paymentdata');
const splashscreens = require('./modules/Models/splashscreen');
const splashscreen = require('./modules/Models/splashscreen');

// GET route for testing purposes
app.get('/webtoapp', (req, res) => {
    res.send('This is web to app');
});

// POST route for signup
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Create a new user instance
        const newUser = new User({ name, email, password });
        // Save the user to the database
        const savedUser = await newUser.save();
        const Userid = savedUser._id
        console.log(Userid)
        // Generate JWT token with user data
        const token = jwt.sign({ name, email, Userid }, secretKey, { expiresIn: '1h' });

        // Set token as cookie in the response
        // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Expires in 1 hour (3600000 ms)

        res.status(201).json({ token }); // Respond with the token
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST route for login
app.post('/login', async (req, res) => {
    console.log("called")
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        console.log(user); // Log the user object

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Log the entered plaintext password for debugging
        console.log('Entered Password:', password);

        // Compare hashed password from database with plaintext password using bcrypt.compare
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password Comparison Result:', isPasswordValid); // Log the result of password comparison

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Generate JWT token with user data
        const token = jwt.sign({ name: user.name, email: user.email }, secretKey, { expiresIn: '1h' });
        console.log('Generated Token:', token); // Log the generated token

        res.status(200).json({ token }); // Respond with the token
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ error: error.message });
    }
});


// POST route for creating a new app
app.post('/addnewapp', async (req, res) => {
    console.log("called")
    try {
        const { website, appName, appPlatform, user } = req.body;
        console.log(req.body.user)
        // Create a new app instance
        const newApp = new newapp({ website, appName, appPlatform, user });
        console.log(newApp)
        // Save the app to the database
        const savedApp = await newApp.save();

        res.status(201).json(savedApp); // Respond with the saved app data
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/myapps',async(req, res)=>{
    try {
        const myapps = await newapp.find({user:"amrit1"})
        res.send(myapps)
    } catch (error) {
        console.log(error)
    }
})

app.get('/appdashboard/:appid', async (req, res) => {
    try {
        const { appid } = req.params;
        const response = await newapp.findById(appid);
        if (!response) {
            return res.status(404).json({ error: 'App not found' });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/app/admobs/:id', async (req, res) => {
    const {id} = req.params
    const appid = id; // Get appid from query parameters
    console.log(appid)
    try {
        const response = await AppAdmobs.findOne({ appid });
        // res.json(response || {}); // Send response or empty object if not found
        res.send(response || {})
        console.log(response)
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/app/admobs', async (req, res) => {
    const { appid, applicationid, bannerid } = req.body;
    try {
        const updatedData = await AppAdmobs.findOneAndUpdate({ appid }, { applicationid, bannerid }, { new: true });
        res.json(updatedData);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/appinfo', async(req, res)=>{
    try {
        const appid = "6614f29b3639ad41247a8412"
        const response = await newapp.findById(appid)
        res.send(response)
    } catch (error) {
        console.log(error)
    }
})

app.post('/appinfo/update/:id', async (req, res) => {
    try {
        console.log(req.params)
        const {id} = req.params
        const { website, appName, appicon } = req.body;
        const appid = id; // Assuming this is the appid for the app you want to update

        const updatedApp = await newapp.findByIdAndUpdate(
            appid,
            { website, appName, appicon },
            { new: true }
        );

        if (!updatedApp) {
            return res.status(404).json({ error: 'App not found' });
        }

        res.status(200).json(updatedApp);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET route to fetch Firebase data
app.get('/app/firebase/:id', async (req, res) => {
    const {id} = req.params
    const appid = id; // Assuming you have a specific appid for Firebase data
    try {
        const response = await firebases.findOne({ appid });
        res.json(response || {}); // Send response or empty object if not found
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST route to update Firebase data
app.post('/app/firebase/:id', async (req, res) => {
    const {id} = req.params
    const { fcmsecuritykey, firebaseconf } = req.body;
    const appid = id ; // Assuming you have a specific appid for Firebase data
    try {
        // Update the fcmsecuritykey and firebaseconf for the specific appid
        const updatedData = await firebases.findOneAndUpdate(
            { appid },
            { fcmsecuritykey, firebaseconf },
            { new: true }
        );
        res.json(updatedData);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/changethedata', async (req, res)=>{
    const appid= "6614f29b3639ad41247a8412"
    try {
        const resp1 = await newapp.findById(appid)
        // const response = await firebases.find({appid})
        res.send(resp1)
        console.log(resp1)
    } catch (error) {
        console.log(error)
    }
})

app.post('/updatefile', (req, res) => {
    const { content, content2 } = req.body;

    // Write the content to the file (assuming synchronous write for simplicity)
    const fs = require('fs');
    fs.writeFileSync('../webtoappex/urapp/app.json', content);
    fs.writeFileSync('../webtoappex/urapp/android/app/src/main/res/values/strings.xml', content2);

    res.status(200).send('File content updated successfully.');
});


// Endpoint to trigger build process
app.post('/build', (req, res) => {
    const buildCommand = `npx react-native run-android
   cd android
./gradlew assembleRelease
 `;
exec(buildCommand, { cwd: path.join(__dirname, '../webtoappex/urapp') }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Build process error: ${error}`);
    console.error(`Build process stderr: ${stderr}`); // Log stderr for debugging
    res.status(500).send('Build failed');
  } else {
    console.log(`Build output: ${stdout}`);
    // Assuming APK is generated at the default location, update as needed
    const apkFilePath = path.join(__dirname, '../webtoappex/urapp/android/app/build/outputs/apk/release/app-release.apk');
    res.status(200).sendFile(apkFilePath);
  }
});

  });

  // Endpoint to serve APK file for download
  app.get('/download', (req, res) => {
    const apkFilePath = path.join(__dirname, '../webtoappex/urapp/android/app/build/outputs/apk/release/app-release.apk');
    res.download(apkFilePath);
  });
  

  app.post('/payment/detailsave', async (req, res) => {
    console.log(req.body);
    const { appId, orderId, paymentId, amount } = req.body;

    try {
        // Save payment details
        const paymentDetails = await paymentdatas.create(req.body);

        // Update newapp document with plan details
        const updatedApp = await newapp.findOneAndUpdate(
            { _id: appId }, // Assuming appId is the ID of the newapp document
            { $set: { plan: amount, orderId, paymentId } }, // Update planAmount, orderId, and paymentId
            { new: true } // Return the updated document
        );

        res.json({ paymentDetails, updatedApp });
        console.log('Payment details saved and newapp updated:', { paymentDetails, updatedApp });
    } catch (error) {
        console.error('Error saving payment details and updating newapp:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Assuming you're using Express
app.get('/api/splashscreen/:id', async (req, res) => {
    try {
        const {id}= req.params;
        console.log(id)
        // Find data based on appId
        const existingData = await splashscreens.findOne({ appId: id });

        if (existingData) {
            res.send(existingData)
        } else {
            // If data not found, return a 404 status
            return res.status(404).json({ message: 'Data not found for the specified appId' });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/api/splashscreen', async (req, res) => {
    try {
        const {
            splashScreenLogo,
            splashScreenTimeout,
            customizeStatusBar,
            statusBarBackgroundColor,
            statusBarIconColor,
            appId
        } = req.body;

        // Check if the appId already exists in the database
        const existingData = await splashscreens.findOne({ appId });

        if (existingData) {
            // Update the existing data
            const updatedData = await splashscreens.findOneAndUpdate(
                { appId },
                {
                    splashScreenLogo,
                    splashScreenTimeout,
                    customizeStatusBar,
                    statusBarBackgroundColor,
                    statusBarIconColor
                },
                { new: true } // Return the updated document
            );
            return res.status(200).json({ message: 'Splash Screen settings updated successfully', data: updatedData });
        } else {
            // Create new data if the appId doesn't exist
            const newSplashScreenData = await splashscreens.create({
                splashScreenLogo,
                splashScreenTimeout,
                customizeStatusBar,
                statusBarBackgroundColor,
                statusBarIconColor,
                appId
            });
            return res.status(201).json({ message: 'Splash Screen settings saved successfully', data: newSplashScreenData });
        }
    } catch (error) {
        console.error('Error saving data:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/appdashboardagri/:id', async (req, res) => {
    const id  = req.params.id;
    try {
        const pipeline =[
            {
                $match: {
                    _id: new ObjectId(id)                }
            },
            {
              "$lookup": {
                "from": "splashscreens", // Collection to join
                "localField": "_id", // Converted field from the input documents (apps collection)
                "foreignField": "appId", // Field from the documents of the "splashscreens" collection
                "as": "splashscreens" // Output array field
              }
            },
            {
              "$lookup": {
                "from": "appadmobs", // Updated to join "admob" collection
                "localField": "_id",
                "foreignField": "appid",
                "as": "admob"
              }
            },
            {
              "$lookup": {
                "from": "firebases", // Updated to join "firebase" collection
                "localField": "_id",
                "foreignField": "appid",
                "as": "firebase"
              }
            }
        ]

        const result = await newapp.aggregate(pipeline).exec();
        console.log(result)
        // res.json(result);
        res.send(result[0])
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
