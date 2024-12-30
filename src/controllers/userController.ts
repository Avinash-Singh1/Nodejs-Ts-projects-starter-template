import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // Send response with token
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: '1h' }
      );
  
      // Send response with token
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

  
export const getUserid = (req:any, res:any):void => {
    const { id } = req.params;
    res.send(`Details of user with ID: ${id}`);
}

export const getAllUsers= (req:any,res:any):void=>{
    res.send('List of users');
}

export const createUser =async(req:any,res:any)=>{
    const {name,email,password}=req.body;
    try{
        const newUser = await User.create({name,email,password});
        res.status(201).json(newUser);
    }catch(err){
        res.status(400).json({ message: 'Error creating user', err });
    }
}

export const getAllUser = async (req: any, res: any): Promise<void> => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  