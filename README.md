# Product Code Management System

A Backend application for managing products and unique code tracking system with two user roles: Admin and User.

## Features

### Admin User
- Login with username/password
- Add products to master catalog (Name, Batch Size, MRP, Product Image)
- Generate unique UUID codes for products based on batch size
- View all products and manage inventory

### General User
- Login with username/password
- Search products using unique codes
- View product information including image, batch number, and code details

## Technology Stack

### Backend
- Node.js (Express.js)
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File uploads)
- UUID (Unique code generation)
- bcryptjs (Password hashing)



## Project Structure

\`\`\`
```
product-code-system/
├── backend/
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── user.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── ProductCode.js
│   │   └── User.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/         # for images
│   ├── app.js
│   └── package.json
└── README.md
```
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm 

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a \`.env\` file in the backend directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/product-code-system
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
\`\`\`

4. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

The backend server will run on \`http://localhost:5000\`


## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/me\` - Get current user info

### Admin Routes
- \`POST /api/admin/products\` - Add new product (with image upload)
- \`GET /api/admin/products\` - Get all products
- \`POST /api/admin/generate-codes\` - Generate unique codes for a product
- \`GET /api/admin/products/:productId/codes\` - Get codes for a product

### User Routes
- \`GET /api/user/search/:uniqueCode\` - Search product by unique code
- \`POST /api/user/use-code/:uniqueCode\` - Mark code as used

## Default Users



## Features Implemented

✅ JWT-based authentication
✅ MongoDB database integration
✅ File upload with Multer
✅ UUID generation for unique codes

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based authorization
- File upload validation
- CORS protection
- Input validation and sanitization

