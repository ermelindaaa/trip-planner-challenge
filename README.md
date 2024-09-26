# Trip Planner API

## Overview

The **Trip Planner API** is a robust Node.js-based backend service designed to efficiently facilitate the management of trip data. This API provides a comprehensive set of features that enable users to search for, save, list, and manage trips seamlessly. Leveraging modern technologies, the API ensures fast and reliable interactions with both users and external services.

## Key Features

- **Search Trips**: Easily filter trips based on origin, destination, and trip type, with the ability to sort results by either fastest travel time or cheapest cost.
- **Save Trips**: Users can add new trips to their saved list, including the option to restore previously deleted trips.
- **List Trips**: Retrieve a complete list of saved trips, providing users with a quick overview of all their managed trip data.
- **Delete Trips**: Implement a soft delete functionality that allows trips to be marked as deleted without permanently removing them from the database, ensuring data integrity and recovery options.

## Technologies Used

- **Node.js**: A powerful JavaScript runtime that allows the execution of JavaScript server-side.
- **Express.js**: A minimal and flexible web framework for Node.js, facilitating rapid API development.
- **Sequelize**: An ORM (Object-Relational Mapping) library for Node.js that simplifies database interactions, allowing for easier model management.
- **MySQL**: A popular relational database management system for storing and managing trip data.
- **Axios**: A promise-based HTTP client for making requests to external APIs, enhancing the API's ability to retrieve real-time travel information.
- **Winston**: A versatile logging library for Node.js, used for recording application logs.
- **Zod**: A TypeScript-first schema declaration and validation library, ensuring data integrity through strict validation of inputs.

## Project Structure

The project is organized in a modular structure, enhancing maintainability and readability:

├── src
│   ├── axiosInstances
│   │   └── index.ts
│   ├── database
│   │   └── sequelize.ts
│   ├── errors
│   │   └── ClientError.ts
│   ├── index.ts
│   ├── logger
│   │   └── logger.ts
│   ├── models
│   │   └── Trip.ts
│   ├── routes
│   │   └── trips.ts
│   ├── schemas
│   │   ├── envSchema.ts
│   │   ├── QueryParamsSchema.ts
│   │   └── TripSchema.ts
│   ├── services
│   │   └── tripsService.ts
│   ├── test
│   │   └── routes
│   │       └── trips.test.ts
│   └── utils
│       └── loadEnv.ts
└── tsconfig.json


### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)


## Setup

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v14 or higher): Ensure that you have Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).
- **MySQL** (v5.7 or higher): Download and install MySQL from [MySQL official website](https://www.mysql.com/).

### Installation

1. **Clone the Repository**: Start by cloning the project repository to your local machine.

   ```bash
   git clone https://github.com/ermelindaaa/trip-planner-challenge.git
   cd trip-planner-api

2. **Install dependencies**: Navigate into the project directory and install the necessary dependencies using npm install.

    ```bash
    npm install

3. **Create Environment File**: Create an .env file based on the provided .env.example to store environment variables securely.

    ```bash
    cp .env.example .env

4. **Set Environment Variables**: Open the .env file and set the following variables according to your setup:

    API_URL=<Your External API URL>
    API_KEY=<Your API Key>
    DB_NAME=<Your MySQL Database Name>
    DB_USER=<Your MySQL User>
    DB_PASS=<Your MySQL Password>
    DB_HOST=<Your MySQL Host>
    PORT=<Your Application Port>


5. **Start MySQL Database**: Ensure your MySQL database is running and apply any necessary migrations.

 
 6. **Run the Application**: Start the application using the following command:

    ```bash
    npm start

 
 
## API Endpoints

The Trip Planner API exposes several endpoints to interact with trip data. Below is a summary of each endpoint, including the HTTP method, path, required parameters, and expected responses.

### 1. Search Trips

- **Method**: GET
- **Endpoint**: `/api/trips`
- **Query Parameters**:
  - `origin` (required): The 3-letter origin code (e.g., SYD).
  - `destination` (required): The 3-letter destination code (e.g., GRU).
  - `sort_by`: Optional, values can be `fastest` or `cheapest`.
  - `type`: Optional, values can include `car`, `flight`, or `train`.
- **Response**: Returns a list of trips that match the specified filters.

### 2. Save Trip

- **Method**: POST
- **Endpoint**: `/api/trip`
- **Body** (JSON):
  - `origin`: (string) The trip's origin.
  - `destination`: (string) The trip's destination.
  - `cost`: (number) The trip's cost.
  - `duration`: (number) The trip's duration in hours.
  - `type`: (string) The mode of transport (e.g., `flight`, `car`, `train`).
  - `id`: (string) A unique identifier for the trip.
  - `display_name`: (string) A descriptive name for the trip.
- **Response**: Returns the details of the trip saved successfully.

### 3. List Saved Trips

- **Method**: GET
- **Endpoint**: `/api/savedTrips`
- **Response**: Returns a list of all saved trips, excluding those that have been soft-deleted.

### 4. Delete Trip

- **Method**: DELETE
- **Endpoint**: `/api/trip/:id`
- **Parameters**:
  - `id`: (string) The unique identifier of the trip to be deleted.
- **Response**: Returns the details of the deleted trip, confirming its successful removal.

## Error Handling

The API provides structured error responses to enhance debugging and user experience. Each error response is formatted as a JSON object containing the following fields:

- `name`: A string representing the type of error (e.g., `ClientError`).
- `message`: A descriptive message detailing the nature of the error.

Validation errors and client-related issues are handled explicitly, ensuring users receive informative feedback.

## Logging

Logging within the Trip Planner API is managed using **Winston**, providing a flexible logging solution. The application is configured to output logs at different levels depending on the environment:

- In **development mode**, logs are detailed and include debug information to facilitate debugging.
- In **production mode**, only critical error logs are recorded to minimize performance overhead and keep log files manageable.

## Testing

Comprehensive testing is integral to maintaining the reliability of the API. The Trip Planner API employs **Jest** for unit testing, allowing developers to run the entire test suite effortlessly. Jest is a delightful JavaScript testing framework with a focus on simplicity. To execute the tests, use the following command:

```bash
npm test


This will run all tests in the project, providing output on the success or failure of each test case.

Conclusion
The Trip Planner API is designed to be a flexible and robust solution for managing trip data, leveraging modern web technologies and best practices. Whether you're a developer looking to integrate travel solutions into your application or an end-user managing personal travel plans, this API aims to provide a seamless experience.

Thank you for using the Trip Planner API!