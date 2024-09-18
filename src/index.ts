import express from 'express';
import dotenv from 'dotenv';

import tripRoutes from './routes/trips'; 

dotenv.config(); 
const app = express(); 

app.use(express.json());

app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  
});
