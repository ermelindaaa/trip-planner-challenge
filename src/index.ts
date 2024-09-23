import express from 'express';
import dotenv from 'dotenv';
import tripRoutes from './routes/trips';
import sequelize from './database/database';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', tripRoutes);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
