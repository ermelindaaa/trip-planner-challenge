import { searchTrips, saveTrip, listTrips, deleteTrip } from '../../../src/services/tripsService';
import  Trip  from '../../../src/models/Trip';
import { ClientError } from '../../../src/errors/ClientError';
import sequelize from '../../../src/database/sequelize';
import { axiosInstance } from '../../../src/axiosInstances';

// mock the trip model and axiosInstance
jest.mock('../../../src/models/Trip');
jest.mock('../../../src/axiosInstances');

describe('Trip Service Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // recreate the database for testing
  });

  afterAll(async () => {
    await sequelize.close(); // close the database connection after tests
  });

  describe('searchTrips', () => {
    it('should return sorted trips by fastest', async () => {
      // Arrange
      const mockTrips = [
        { origin: "SYD", destination: "GRU", cost: 625, duration: 5, type: "flight", id: "a749c866-7928-4d08-9d5c-a6821a583d1a", display_name: "from SYD to GRU by flight" },
        { origin: "SYD", destination: "GRU", cost: 2386, duration: 7, type: "car", id: "00401bc6-ffb5-4340-85a6-e3725bb6dd3e", display_name: "from SYD to GRU by car" },
        { origin: "SYD", destination: "GRU", cost: 1709, duration: 32, type: "car", id: "d1b89056-ae55-4040-bbd6-0373405705d4", display_name: "from SYD to GRU by car" },
      ];
      (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockTrips });

      // Act
      const result = await searchTrips('SYD', 'GRU', 'fastest');

      // Assert
      expect(result).toEqual([
        mockTrips[0], // flight with duration 5
        mockTrips[1], // car with duration 7
        mockTrips[2], // car with duration 32
      ]);
    });

    it('should return sorted trips by cheapest', async () => {
      // Arrange
      const mockTrips = [
        { origin: "SYD", destination: "GRU", cost: 625, duration: 5, type: "flight", id: "a749c866-7928-4d08-9d5c-a6821a583d1a", display_name: "from SYD to GRU by flight" },
        { origin: "SYD", destination: "GRU", cost: 1709, duration: 32, type: "car", id: "d1b89056-ae55-4040-bbd6-0373405705d4", display_name: "from SYD to GRU by car" },
        { origin: "SYD", destination: "GRU", cost: 2386, duration: 7, type: "car", id: "00401bc6-ffb5-4340-85a6-e3725bb6dd3e", display_name: "from SYD to GRU by car" },
      ];
      (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockTrips });

      // Act
      const result = await searchTrips('SYD', 'GRU', 'cheapest');

      // Assert
      expect(result).toEqual([
        mockTrips[0], // cheapest flight
        mockTrips[1], // next cheapest car
        mockTrips[2], // most expensive car
      ]);
    });

    it('should filter trips by type', async () => {
      // Arrange
      const mockTrips = [
        { origin: "SYD", destination: "GRU", cost: 625, duration: 5, type: "flight", id: "a749c866-7928-4d08-9d5c-a6821a583d1a", display_name: "from SYD to GRU by flight" },
        { origin: "SYD", destination: "GRU", cost: 1709, duration: 32, type: "car", id: "d1b89056-ae55-4040-bbd6-0373405705d4", display_name: "from SYD to GRU by car" },
      ];
      (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockTrips });

      // Act
      const result = await searchTrips('SYD', 'GRU', undefined, 'flight');

      // Assert
      expect(result).toEqual([mockTrips[0]]); // nnly the flight trip should be returned
    });
  });

  describe('saveTrip', () => {
    it('should save a new trip', async () => {
      // Arrange
      const tripData = { id: 'a749c866-7928-4d08-9d5c-a6821a583d1a', origin: 'SYD', destination: 'GRU', duration: 5, cost: 625, type: 'flight', display_name: 'from SYD to GRU by flight' };
      (Trip.findOne as jest.Mock).mockResolvedValueOnce(null); // no existing trip
      (Trip.create as jest.Mock).mockResolvedValueOnce(tripData);

      // Act
      const result = await saveTrip(tripData);

      // Assert
      expect(result).toEqual(tripData); // expect the result to be the saved trip
      expect(Trip.create).toHaveBeenCalledWith(tripData); // ensure create was called with tripData
    });

    it('should throw an error if trip already exists', async () => {
      // Arrange
      const tripData = { id: 'a749c866-7928-4d08-9d5c-a6821a583d1a', origin: 'SYD', destination: 'GRU', duration: 5, cost: 625, type: 'flight', display_name: 'from SYD to GRU by flight' };
      (Trip.findOne as jest.Mock).mockResolvedValueOnce({ deleted: false });

      // Act & Assert
      await expect(saveTrip(tripData)).rejects.toThrow(ClientError);
    });
  });

  describe('listTrips', () => {
    it('should return a list of saved trips', async () => {
      // Arrange
      const mockTrips = [
        { id: 'a749c866-7928-4d08-9d5c-a6821a583d1a', origin: 'SYD', destination: 'GRU', duration: 5, cost: 625, type: 'flight', display_name: 'from SYD to GRU by flight', deleted: false },
      ];
      (Trip.findAll as jest.Mock).mockResolvedValueOnce(mockTrips);

      // Act
      const result = await listTrips();

      // Assert
      expect(result).toEqual(mockTrips); // expect the returned trips to match
    });

    it('should throw an error if trips cannot be retrieved', async () => {
      // Arrange
      (Trip.findAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      // Act & Assert
      await expect(listTrips()).rejects.toThrow(ClientError);
    });
  });

  describe('deleteTrip', () => {
    it('should delete an existing trip', async () => {
      // Arrange
      const tripData = { 
        id: '00401bc6-ffb5-4340-85a6-e3725bb6dd3e', 
        deleted: false,
        update: jest.fn() // mock the update method
      };
      (Trip.findOne as jest.Mock).mockResolvedValueOnce(tripData); // mocking findOne to return our trip
  
      // Act
      const result = await deleteTrip('00401bc6-ffb5-4340-85a6-e3725bb6dd3e'); // call with actual trip ID
  
      // Assert
      expect(result).toEqual(tripData); // expect the deleted trip to be returned
      expect(tripData.update).toHaveBeenCalledWith({ deleted: true }); // ensure the update method was called with correct arguments
    });
  
    it('should throw an error if trip is not found', async () => {
      // Arrange
      (Trip.findOne as jest.Mock).mockResolvedValueOnce(null);
  
      // Act & Assert
      await expect(deleteTrip('non-existent-id')).rejects.toThrow(ClientError);
    });
  });
});
