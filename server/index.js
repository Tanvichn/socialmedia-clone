//importing packages
import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from "multer";
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import {fileURLToPath} from 'url';
import postRoutes from './routes/post.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import {register} from './controllers/auth.js';
import {createPost} from './controllers/posts.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts} from './data/index.js';
//Mongoose setup
import connectDB  from './db.js';
import { verifyToken } from "./middleware/auth.js";

//importing middlewares {configurations}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
app.use(morgan('common'));
app.use(bodyParser.json({limit : '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());
app.use('/assests', express.static(path.join(__dirname, 'public/assests')));

//file storage 
const storage = multer.diskStorage({
    destination : function(req,res,cd) {
        cd(null, 'public/assests');
    },
    filename: function(req, res, cd){
        cd(null, file.originalname);
    }
});
const upload = multer({storage});

//routes with file
app.post('/auth/register' , upload.single('picture'), register);
app.post('/posts', verifyToken , upload.single('picture'), createPost);

//routes
app.use('/auth', authRoutes);
app.use('/users' , userRoutes);
app.use('/posts', postRoutes);


connectDB().then(()=> {
    //add data only one time
    // User.insertMany(users);
    // Post.insertMany(posts);
});
const PORT = 3000;
app.listen(PORT , () => {
    console.log('Server at port ' + PORT);
}); 
app.get('/', (req, res) => {
    res.send('Hello, this is the root route!');
});