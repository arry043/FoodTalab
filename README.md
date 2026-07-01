# FoodTalab

FoodTalab is a production-grade MERN food ordering platform with real-time tracking, role-based access, secure authentication, Razorpay payments, OTP delivery, and Cloudinary media uploads.

## Key Features

- MERN stack: React + Vite frontend, Node.js + Express backend, MongoDB database
- Role-based platform for three user roles: `user`, `owner`, `deliveryBoy`
- JWT authentication using cookies and Google OAuth sign-in via Firebase / backend auth endpoint
- Secure password handling with `bcryptjs`
- Razorpay online payment integration with order verification
- Password reset OTP via email and delivery OTP for order handoff
- Real-time events with `socket.io`: order updates, assignment broadcasts, delivery location tracking
- Geo-location support with GeoApify reverse geocoding and MongoDB `2dsphere` indexing
- Cloudinary image uploads for shops and menu items
- Modular API routes and middleware for auth, user, shop, item, and order flows

## Architecture Overview

- `backend/` contains the Express API server and socket handler
- `frontend/` contains the React app and Redux stores
- `backend/index.js` initializes the HTTP server, Socket.IO, and route middleware
- `backend/socket.js` manages real-time socket events and online delivery Boy presence
- `backend/models/user.model.js` stores users with geo coordinates and socket state
- `frontend/src/App.jsx` creates a socket connection and listens for order status updates
- `frontend/src/pages/CheckOutPage.jsx` handles delivery location selection, GeoApify lookup, and Razorpay checkout

## Backend

### Install

```bash
cd backend
npm install
```

### Run

```bash
npm run dev
```

### Backend Environment Variables

Create `backend/.env` with:

```text
PORT=5000
MONGODB_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
FRONTEND_ORIGIN=http://localhost:5173
EMAIL=<smtp-email-address>
PASS=<smtp-email-password>
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET_KEY=<cloudinary-api-secret>
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
```

### Backend Routes

#### Auth

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/signout`
- `POST /api/auth/send-otp`
- `POST /api/auth/varify-otp`
- `POST /api/auth/reset-password`
- `POST /api/auth/google-auth`

#### User

- `GET /api/user/current`
- `POST /api/user/update-location`

#### Shop

- `POST /api/shop/create-edit`
- `GET /api/shop/myshop`
- `GET /api/shop/getbycity/:city`
- `GET /api/shop/get-shop-by-id/:shopId`

#### Item

- `POST /api/item/add-item`
- `PUT /api/item/edit-item/:itemId`
- `GET /api/item/get-item-by-id/:itemId`
- `DELETE /api/item/delete-item/:itemId`
- `GET /api/item/getitembycity/:city`
- `GET /api/item/search-items`
- `POST /api/item/rating`
- `GET /api/item/guest-items`

#### Order

- `POST /api/order/place-order`
- `POST /api/order/verify-payment`
- `GET /api/order/my-orders`
- `GET /api/order/get-assignments`
- `POST /api/order/send-delivery-otp`
- `POST /api/order/verify-delivery-otp`
- `PUT /api/order/update-status/:orderId/:shopId`
- `GET /api/order/accept-order/:assignmentId`
- `GET /api/order/get-current-order`
- `GET /api/order/get-order/:orderId`
- `GET /api/order/get-today-deliveries`

## Frontend

### Install

```bash
cd frontend
npm install
```

### Run

```bash
npm run dev
```

### Frontend Environment Variables

Create `frontend/.env` with:

```text
VITE_FIREBASE_API_KEY=<firebase-api-key>
VITE_RAZORPAY_KEY_ID=<razorpay-key-id>
VITE_GEO_LOCATION_API_KEY=<geoapify-api-key>
```

### Notes

- `frontend/src/App.jsx` is configured to use `https://foodtalab-backend.onrender.com` as the backend URL. Update `serverUrl` there or use a local backend URL for development.
- Firebase is used for Google sign-in token generation, while backend `/api/auth/google-auth` creates or fetches the user record.
- Checkout uses the Razorpay checkout script from `frontend/index.html` and backend order creation / verification.
- Real-time order and delivery assignment updates are handled via Socket.IO connections.

## Deployment

- Backend and frontend are designed to deploy separately, with CORS configured using `FRONTEND_ORIGIN`.
- The backend currently points at `https://foodtalab-backend.onrender.com` in the frontend.

## Database Models

- `User`: auth, role, mobile, location, socketId, online state
- `Shop`: owner, address, city, image, menu items
- `Item`: menu metadata, category, shop reference, ratings
- `Order`: cart orders split by shop, payment state, delivery flow, delivery OTP
- `DelivaryAssignment`: assignment metadata for delivery crew

## Important Implementation Details

- Location data uses MongoDB geospatial `2dsphere` index on `User.location`
- Order workflow supports COD and `ONLINE` payments via Razorpay
- Real-time socket events broadcast:
    - `newOrder` to shop owners
    - `newDeliveryAssignment` to delivery boys
    - `orderStatusUpdate` to users
- Email OTP flows are used for both password reset and delivery verification

## Project Structure

- `backend/` — Express server, config, controllers, models, middleware, utilities
- `frontend/` — React pages, components, hooks, Redux slices, and Firebase integration

## Development Tips

- Ensure the backend is running before starting the frontend
- Use `withCredentials: true` in frontend Axios calls to send JWT cookies
- If using local backend, update `serverUrl` in `frontend/src/App.jsx`

---

If you want, I can also add a `frontend/README.md` and a root `backend/README.md` with separate environment examples.
