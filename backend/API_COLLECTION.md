# Sabari Portfolio - API Collection

Base URL: `http://localhost:5000/api`

This document contains all the available API endpoints for the Sabari Portfolio backend. 
You can use these endpoints in Postman, Thunder Client, or any frontend application.

## 1. Health Check
- **Endpoint:** `/health`
- **Method:** `GET`
- **Description:** Checks if the API is running correctly.

## 2. Authentication
- **Setup Admin User:** 
  - **Endpoint:** `/auth/setup`
  - **Method:** `POST`
  - **Body:** `{ "name": "Admin", "email": "admin@example.com", "password": "password123" }`
- **Login:** 
  - **Endpoint:** `/auth/login`
  - **Method:** `POST`
  - **Body:** `{ "email": "admin@example.com", "password": "password123" }`
- **Get Current User:** 
  - **Endpoint:** `/auth/me`
  - **Method:** `GET` (Requires Auth Token)

## 3. Profile
- **Get Profile:** `/profile` (`GET`)
- **Update Profile:** `/profile` (`PUT`, Requires Auth)

## 4. Projects
- **Get All Projects:** `/projects` (`GET`)
- **Create Project:** `/projects` (`POST`, Requires Auth)
- **Get Project by Slug:** `/projects/:slug` (`GET`)
- **Update Project:** `/projects/:id` (`PUT`, Requires Auth)
- **Delete Project:** `/projects/:id` (`DELETE`, Requires Auth)

## 5. Skills
- **Get All Skills:** `/skills` (`GET`)
- **Add Skill:** `/skills` (`POST`, Requires Auth)
- **Update Skill:** `/skills/:id` (`PUT`, Requires Auth)
- **Delete Skill:** `/skills/:id` (`DELETE`, Requires Auth)

## 6. Contact Messages
- **Send Message:** `/contact` (`POST`)
  - **Body:** `{ "name": "John Doe", "email": "john@test.com", "message": "Hello!" }`
- **Get All Messages:** `/contact` (`GET`, Requires Auth)
- **Mark as Read:** `/contact/:id/read` (`PUT`, Requires Auth)
- **Delete Message:** `/contact/:id` (`DELETE`, Requires Auth)

## 7. Experience, Education, Certifications & Social Links
The following endpoints follow the same standard REST pattern (GET all, POST to create, PUT to update by ID, DELETE by ID):
- `/experience`
- `/education`
- `/certifications`
- `/social-links`
