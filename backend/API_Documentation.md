# Patient Management API Documentation

Base URL: `http://localhost:5000`

---

## **Endpoints**

### 1. Get All Patients

**Endpoint:** `GET /api/patients`

**Description:** Retrieve all patients with optional search and filter

**Query Parameters:**
- `search` (optional) - Search term for patient names
- `status` (optional) - Filter by status (Inquiry, Onboarding, Active, Churned)

**Example Requests:**
```bash
# Get all patients
GET http://localhost:5000/api/patients

# Search for patients named "john"
GET http://localhost:5000/api/patients?search=john

# Filter by status
GET http://localhost:5000/api/patients?status=Active

# Combine search and filter
GET http://localhost:5000/api/patients?search=john&status=Active