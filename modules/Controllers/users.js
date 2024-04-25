const Users = require("../Models/Users");
// const User = require("../Models/Users");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists in the database
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create a new user instance
        const newUser = new Users({ name, email, password });
        // Save the user to the database
        const savedUser = await newUser.save();
        const Userid = savedUser._id;
        console.log(Userid);
        // Generate JWT token with user data
        const token = jwt.sign({ name: savedUser.name, email: savedUser.email, id: savedUser._id }, secretKey, { expiresIn: '1h' });

        // Set token as cookie in the response
        // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Expires in 1 hour (3600000 ms)

        res.status(201).json({ token }); // Respond with the token
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const login = async (req, res) => {
    console.log("called")
    try {
        // const { email, password } = req.body;
        console.log(req.body)

        // Check if user exists
        const user = await Users.findOne();
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
        const token = jwt.sign({ name: user.name, email: user.email, id: user._id }, secretKey, { expiresIn: '1h' });
        console.log('Generated Token:', token); // Log the generated token

        res.status(200).json({ token }); // Respond with the token
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {login, signup}