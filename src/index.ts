import express from 'express';
import dotenv from 'dotenv';
import tripRoutes from './routes/trips';
import sequelize from './database/database';
import logger  from './logger/logger';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', tripRoutes);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, async () => {
  logger.info(`App is listening on port ${PORT}`);
  try{
    // console.log(process.env)
    await sequelize.authenticate();
    logger.info('Connected to db!')
    await sequelize.sync({ force: true })
  }catch (e) {
    throw new Error('Failed to connect to the database');
  }
})
