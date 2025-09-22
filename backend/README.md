# Target Lock Backend API

Backend API for Target Lock - AI Product Hunter application, built with Node.js, Express, and MongoDB Atlas.

## Features

- 🔐 **User Management** - Sync users from Firebase Authentication
- 📊 **Product Tracking** - Store and manage product data
- 📈 **Trend Analysis** - Track product trends over time
- 📋 **Report Generation** - Generate various reports
- 🔍 **Search & Filtering** - Advanced product search capabilities

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM for MongoDB
- **Firebase Admin** - Firebase integration
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## Setup Instructions

### 1. Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your credentials:
   ```env
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/targetlock
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   PORT=5000
   NODE_ENV=development
   ```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Run the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### User Management

#### Sync User with Firebase
```http
POST /api/sync-user
Content-Type: application/json

{
  "uid": "firebase_user_id",
  "email": "user@example.com",
  "name": "User Name",
  "photoURL": "https://example.com/photo.jpg"
}
```

#### Get User by Firebase UID
```http
GET /api/user/:firebaseUid
```

### Product Management

#### Create/Update Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "category": "Electronics",
  "profitabilityScore": 85,
  "trendPercentage": 12.5,
  "price": {
    "current": 299.99,
    "currency": "USD"
  }
}
```

#### Get Products
```http
GET /api/products?category=Electronics&minProfitability=50&limit=20
```

### Trend Data

#### Get Product Trends
```http
GET /api/products/:productId/trends
```

#### Create Trend Data
```http
POST /api/trends
Content-Type: application/json

{
  "productId": "product_id",
  "date": "2024-01-01T00:00:00Z",
  "metric": "price",
  "value": 299.99
}
```

### Reports

#### Generate Report
```http
POST /api/reports
Content-Type: application/json

{
  "userId": "user_id",
  "type": "product-analysis",
  "title": "Monthly Product Analysis",
  "data": { ... }
}
```

#### Get User Reports
```http
GET /api/reports/:userId
```

## Database Schema

### User Schema
```javascript
{
  firebaseUid: String (required, unique),
  name: String (required),
  email: String (required, unique),
  role: String (enum: ['user', 'admin'], default: 'user'),
  profilePicture: String,
  preferences: {
    theme: String (enum: ['light', 'dark', 'system']),
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String (required),
  category: String (required),
  profitabilityScore: Number (0-100),
  trendPercentage: Number,
  price: {
    current: Number,
    currency: String
  },
  availability: {
    inStock: Boolean,
    stockCount: Number
  },
  trackedSince: Date,
  lastUpdated: Date
}
```

### Trend Schema
```javascript
{
  productId: ObjectId (ref: Product),
  date: Date (required),
  metric: String (enum: ['price', 'sales', 'popularity', 'profitability', 'stock']),
  value: Number (required),
  change: Number,
  changePercentage: Number,
  source: String (enum: ['manual', 'api', 'web-scraping', 'calculated'])
}
```

### Report Schema
```javascript
{
  userId: ObjectId (ref: User),
  type: String (enum: ['product-analysis', 'trend-report', 'profitability-report', 'custom']),
  title: String (required),
  data: Mixed (required),
  filters: {
    dateRange: { start: Date, end: Date },
    categories: [String],
    products: [ObjectId]
  },
  generatedAt: Date,
  isPublic: Boolean
}
```

## Integration with Frontend

### User Sync Flow

1. User signs up/logs in via Firebase Auth
2. Frontend gets `uid`, `email`, `name` from Firebase
3. Call `/api/sync-user` endpoint
4. Backend creates/finds user in MongoDB
5. Returns user data to frontend

### Example Frontend Integration

```javascript
// After Firebase authentication
const syncUserWithBackend = async (firebaseUser) => {
  try {
    const response = await fetch('http://localhost:5000/api/sync-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }),
    });

    const userData = await response.json();
    console.log('User synced:', userData);
    return userData;
  } catch (error) {
    console.error('Failed to sync user:', error);
  }
};
```

## Security Features

- CORS enabled for cross-origin requests
- Helmet middleware for security headers
- Input validation using Joi
- Rate limiting for API endpoints
- MongoDB connection with security options

## Development

### Running Tests
```bash
npm test
```

### Environment Variables
- `MONGO_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode
- `FIREBASE_*` - Firebase Admin SDK credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## License

MIT License
