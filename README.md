# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Caroo888 Backend API

Backend system for Caroo888 application providing user management, deposit/withdrawal, and promotion services.

## Basic Information

- **Base URL**: `http://localhost:4567/api`
- **Port**: 4567
- **Database**: PostgreSQL
- **ORM**: Sequelize

## Installation and Running
`docker compose up -d --build`

## API Endpoints

### 🔐 Authentication

#### POST `/api/v1/auth/register`
Register new user

**Request Body:**
```json
{
  "firstname": "string",
  "lastname": "string", 
  "phoneNumber": "string",
  "password": "string",
  "agentCode": "string" // optional
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

**Status Codes:**
- `201` - Registration successful
- `400` - Invalid data
- `409` - Phone number already registered
- `500` - Internal server error

---

#### POST `/api/v1/auth/login`
User login

**Request Body:**
```json
{
  "phoneNumber": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful"
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid data
- `401` - Invalid phone number or password
- `500` - Internal server error

---

### 👤 Users

#### GET `/api/v1/users/info`
Get user information (requires login)

**Headers:**
- Session cookie required

**Response:**
```json
{
  "id": 1,
  "role": "user",
  "firstname": "John",
  "lastname": "Doe",
  "phoneNumber": "0812345678",
  "balance": "1000.00",
  "turn": "500.00",
  "lucknumber": 100,
  "gamelock": [],
  "code": "ABC123"
}
```

**Status Codes:**
- `200` - Success
- `401` - Not logged in
- `500` - Internal server error

---

#### GET `/api/v1/users/balance`
Get user balance (requires login)

**Headers:**
- Session cookie required

**Response:**
```json
{
  "balance": "1000.00"
}
```

**Status Codes:**
- `200` - Success
- `401` - Not logged in
- `500` - Internal server error

---

#### POST `/api/v1/users/withdraw`
Withdraw money (requires login)

**Headers:**
- Session cookie required

**Request Body:**
```json
{
  "amount": "100.00"
}
```

**Response:**
```json
{
  "message": "Withdraw successful",
  "balance": "900.00"
}
```

**Status Codes:**
- `200` - Withdraw successful
- `400` - Invalid amount or insufficient balance
- `401` - Not logged in
- `404` - User not found
- `500` - Internal server error

---

#### POST `/api/v1/users/deposit`
Deposit money (requires login)

**Headers:**
- Session cookie required

**Request Body:**
```json
{
  "amount": "100.00",
  "promotionCode": "PROMO123" // optional
}
```

**Response:**
```json
{
  "message": "Deposit successful",
  "balance": "1100.00"
}
```

**Status Codes:**
- `200` - Deposit successful
- `400` - Invalid amount or promotion
- `401` - Not logged in
- `404` - User not found
- `500` - Internal server error

---

#### GET `/api/v1/users/history`
Get transaction history (requires login)

**Headers:**
- Session cookie required

**Response:**
```json
[
  {
    "type": "deposit",
    "amount": "100.00",
    "promotionId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "type": "withdraw", 
    "amount": "50.00",
    "promotionId": null,
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Not logged in
- `404` - User not found
- `500` - Internal server error

---

### 🎁 Promotions

#### GET `/api/v1/promotions/info`
Get all promotions (requires login)

**Headers:**
- Session cookie required

**Response:**
```json
[
  {
    "id": 1,
    "code": "PROMO123",
    "description": "Special promotion",
    "increaseMoney": "50.00",
    "increaseTurn": "100.00",
    "usageLimit": 10,
    "expirationDate": "2024-12-31T23:59:59.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Not logged in
- `500` - Internal server error

---

#### POST `/api/v1/promotions/create`
Create new promotion (requires Admin)

**Headers:**
- Session cookie required

**Request Body:**
```json
{
  "description": "Special promotion",
  "increaseMoney": "50.00",
  "increaseTurn": "100.00", 
  "usageLimit": 10,
  "expirationDate": "2024-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "message": "Create Promotion successful"
}
```

**Status Codes:**
- `200` - Create successful
- `400` - Invalid data
- `401` - Not logged in or not Admin
- `500` - Internal server error

---

#### PUT `/api/v1/promotions/edit`
Edit promotion (requires Admin)

**Headers:**
- Session cookie required

**Request Body:**
```json
{
  "id": 1,
  "description": "New promotion", // optional
  "increaseMoney": "75.00", // optional
  "increaseTurn": "150.00", // optional
  "usageLimit": 20, // optional
  "expirationDate": "2024-12-31T23:59:59.000Z" // optional
}
```

**Response:**
```json
{
  "message": "Edit Promotion successful"
}
```

**Status Codes:**
- `200` - Edit successful
- `400` - Invalid data
- `401` - Not logged in or not Admin
- `500` - Internal server error

---

#### DELETE `/api/v1/promotions/destroy`
Delete promotion (requires Admin)

**Headers:**
- Session cookie required

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "message": "Destroy Promotion successful"
}
```

**Status Codes:**
- `200` - Delete successful
- `400` - Invalid data
- `401` - Not logged in or not Admin
- `500` - Internal server error

---

### 🍀 Luck

#### GET `/api/v1/luck/getrate`
Get win rate based on user's luck number (requires login)

**Headers:**
- Session cookie required

**Response:**
```json
{
  "isPay": true
}
```

**Status Codes:**
- `200` - Success
- `401` - Not logged in
- `500` - Internal server error

---

#### POST `/api/v1/luck/played`
Record game play and update luck number (requires login)

**Headers:**
- Session cookie required

**Response:**
```json
{
  "msg": "ok"
}
```

**Status Codes:**
- `200` - Success
- `401` - Not logged in
- `500` - Internal server error

---

## Data Models

### Users
- `id` - User ID (Primary Key)
- `role` - Role (user/admin)
- `firstname` - First name
- `lastname` - Last name
- `password` - Password
- `phoneNumber` - Phone number (Unique)
- `balance` - Account balance
- `turn` - Turn amount
- `lucknumber` - Lucky number
- `gamelock` - Game lock data (JSON)
- `code` - User code (Unique)

### Promotions
- `id` - Promotion ID (Primary Key)
- `code` - Promotion code (Unique)
- `description` - Description
- `increaseMoney` - Money increase amount
- `increaseTurn` - Turn increase amount
- `usageLimit` - Usage limit count
- `expirationDate` - Expiration date

### Histories
- `id` - History ID (Primary Key)
- `userId` - User ID
- `type` - Transaction type (deposit/withdraw)
- `amount` - Amount
- `promotionId` - Promotion ID (if applicable)
- `createdAt` - Created date