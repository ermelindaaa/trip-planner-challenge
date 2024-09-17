import express from 'express';
import dotenv from 'dotenv';

dotenv.config()

const app = express(); 

// middleware to parse JSON bodies 
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Trip Planner :) ');
}); 

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log('Server running on the port ${PORT}');
});
