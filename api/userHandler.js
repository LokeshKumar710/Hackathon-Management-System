const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { auth } = require('../middleware')
const router = Router()

// Register a new user
// Register a new user
// Register a new user
router.post('/register', async (req, res, next) => {
    const { password, passwordCheck, username } = req.body;
    try {
        if (!password || !passwordCheck || !username)
            return res.status(400).json({ msg: "Don't be lazy 🦥, enter all fields value" });

        // if (password.length < 5) {
        //     return res.status(400).json({ msg: 'Password is too small, try harder 🤪' });
        // }

        if (password !== passwordCheck)
            return res.status(400).json({ msg: "Passwords don't match 👿" });

        const existingUser = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({ msg: 'Username exists, think of something unique 🦄' });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Print the hashed password
        // console.log('Hashed Password:', passwordHash);

        // Create the new user
        const newUser = new User({ username, password: passwordHash });

        // Print the new user object
        // console.log('New User:', {
        //     username: newUser.username,
        //     password: newUser.password,
        //     _id: newUser._id,
        // });

        const response = await newUser.save();
        res.status(201).json({ username: response.username, _id: response._id });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(422).json({ msg: 'Validation error occurred' });
        }
        next(error); // Pass error to global error handler
    }
});

// Testing directly in the code (example user)
// (async () => {
//     const exampleUsername = "testUser123";
//     const examplePassword = "secure";

//     const salt = await bcrypt.genSalt();
//     const passwordHash = await bcrypt.hash(examplePassword, salt);

//     // Print the hashed password
//     console.log('Example Hashed Password:', passwordHash);

//     // Create and print the new user
//     const newUser = new User({ username: exampleUsername, password: passwordHash });
//     console.log('Example New User:', {
//         username: newUser.username,
//         password: newUser.password,
//         _id: newUser._id,
//     });
// })();


// Login a user
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    try {
        if (!username || !password)
            return res.status(400).json({ msg: 'Don\'t be lazy 🦥, enter all fields value' })

        const user = await User.findOne({ username })
        if (!user)
            return res.status(400).json({ msg: 'User doesn\'t exist 🙈' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid Credentials 🤕' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        })
    } catch (error) {
        next(error)  // Pass error to global error handler
    }
})

// Token validation
router.post('/tokenIsValid', async (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json(true)
    } catch (error) {
        next(error)  // Pass error to global error handler
    }
})

// Get user data (Protected route)
router.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user)
        if (!user)
            return res.status(404).send()

        res.json({
            username: user.username,
            id: user._id,
        })
    } catch (error) {
        next(error)  // Pass error to global error handler
    }
})

module.exports = router
