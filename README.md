# Mock E-Com Cart – Full Stack Assignment Submission

Thank you for reviewing this project. This document presents the completed full-stack assignment, following the same format and clarity style as the internship task instructions.

## Overview

A complete full-stack shopping cart application built for the **Vibe Commerce Full Stack Coding Assignment**.  
The system supports browsing products, adding/removing items from the cart, computing totals, checkout flow, and generating a PDF invoice.

The goal was to demonstrate end-to-end capability across **UI**, **API**, **database**, and **integration logic**.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS v4  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **API:** REST architecture  
- **Other:** PDFKit for invoice generation

---

## Requirements Addressed (As per assignment instructions)

### ✅ Backend APIs Implemented

- `GET /api/products`  
  Returns 8 auto-seeded items (id, name, image, price, stock, description).

- `GET /api/cart`  
  Returns cart items + computed subtotal & total.

- `POST /api/cart`  
  Adds product to cart. Body:  
  `{ "productId": string, "qty": number }`

- `PUT /api/cart/:id`  
  Updates quantity of an existing cart item.

- `DELETE /api/cart/:id`  
  Removes item from cart.

- `POST /api/checkout`  
  Processes customer details + cart → Creates order.

- `GET /api/orders/:id`  
  Returns order details for receipt page.

- `GET /api/invoice/generate?orderId=...`  
  Generates a downloadable **PDF invoice**.

### ✅ Validation & Error Handling
- Full validation middleware  
- Structured error responses  
- Try/catch service wrapping  
- Invalid routes handled  

---

## Frontend Requirements Completed

- Responsive layout (mobile → desktop)  
- Product listing grid  
- Add to cart & modify cart  
- Checkout with validation  
- Receipt modal with order summary  
- PDF invoice download button  
- Loading states & toast notifications  
- Fully accessible semantic UI  

---

## Environment Variables

### Backend `.env`
```env
MONGODB_URI=MONGODB_API
PORT=5000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/
```

---

## Running the Project

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```md
backend/
  controllers/
  services/
  models/
  routes/
  middleware/
  utils/

frontend/
  src/
    components/
    pages/
    utils/
```

---

## Screenshots (Add screenshots here)

```md
![One](https://raw.githubusercontent.com/aadityaexe/Mock-E-Com-Cart/main/frontend/src/assets/one.png)
![Two](https://raw.githubusercontent.com/aadityaexe/Mock-E-Com-Cart/main/frontend/src/assets/two.png)
![Three](https://raw.githubusercontent.com/aadityaexe/Mock-E-Com-Cart/main/frontend/src/assets/three.png)
![Four](https://raw.githubusercontent.com/aadityaexe/Mock-E-Com-Cart/main/frontend/src/assets/four.png)


```

---

## Video Demo (Add demo link here)

```md
🎥 [https://your-video-demo-link.com](https://youtu.be/KcUHhwOSe34?si=YSFXPA9HxOnKBZnM)
```

---

## Notes

- Products automatically seed on first backend startup  
- Invoice generation uses PDFKit  
- REST endpoints tested with Postman  
- UI tested on mobile + desktop  
- Code structured following modern clean-architecture patterns  

---

## End of Document
