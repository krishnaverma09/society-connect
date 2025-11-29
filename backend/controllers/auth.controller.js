const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};


exports.signup = async (req, res) => {
  try {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, apartmentNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

   
    if (role === "resident") {

      if (!apartmentNumber || apartmentNumber.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Apartment number is required for residents."
        });
      }


      const existingApartment = await User.findOne({ apartmentNumber });
      if (existingApartment) {
        return res.status(400).json({
          success: false,
          message: "This apartment number is already registered."
        });
      }
    }


    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'resident',
      apartmentNumber: role === "resident" ? apartmentNumber : undefined,
    });


    const token = generateToken(user._id);

  
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        apartmentNumber: user.apartmentNumber,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);

    // Handle duplicate database error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.apartmentNumber) {
      return res.status(400).json({
        success: false,
        message: "Apartment number already exists."
      });
    }

    return res.status(500).json({ message: 'Server error during signup' });
  }
};



exports.login = async (req, res) => {
  try {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

 
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        apartmentNumber: user.apartmentNumber,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
