
# Mini Cloud Security Posture Management (Mini-CSPM)

A **full-stack Cloud Security Posture Management (CSPM) web application** that scans AWS resources (EC2 & S3) for common security misconfigurations and visualizes the findings in a cyberpunk-themed dashboard.

---

## 🚀 Features

- **Dual scan modes**
  - **Mock mode** – Uses realistic mock AWS payloads for demos and testing
  - **Real mode** – Scans a real AWS account using provided credentials
- **Security checks**
  - EC2: Publicly exposed & running instances
  - S3: Encryption, public access, logging, and versioning
- **Risk classification**
  - High / Medium / Low
- **Interactive dashboard**
  - Filters, search, and metadata inspection

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom cyberpunk theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Validation & Settings**: Pydantic v2, Pydantic Settings
- **Cloud SDK**: Boto3 (AWS)
- **Logging**: Structured logging

---

## 📂 Workflow

1. **Launch**  
   User opens the application and sees the **"Uplink Initialized"** screen.

2. **Config**  
   User selects **Mock** or **Real** mode.
   - **Mock**: Enter any dummy text for Access Key and Secret (e.g., `test`, `test`).
   - **Real**: Enter valid AWS Access Key, Secret Key and Region.

3. **Scan**  
   Frontend sends credentials to `POST /api/v1/scan`.

4. **Process**
   - Backend authenticates via Boto3 (for real mode).
   - Fetches EC2 and S3 configuration.
   - `analysis.py` evaluates resources against security policies.

5. **Visualize**  
   Dashboard renders the risk matrix, allowing filtering (e.g., *Critical Only*) or search by resource ID.

---

## ⚡ Quickstart (Local)

### Prerequisites
- Node.js v18+
- Python 3.9+
- Git
- Optional: Docker & Docker Compose

### Clone the repository
```bash
git clone https://github.com/gk6450/mini-cloud-security-posture-management.git
cd mini-cloud-security-posture-management
```

---

## 🧠 Backend

### Install
```bash
cd backend

python -m venv .venv
source .venv/bin/activate      # macOS / Linux
# OR on Windows:
# .venv\Scripts\activate

pip install -r requirements.txt
```

### Run (development)
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open the OpenAPI docs:
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 📡 API Reference

### `POST /api/v1/scan`
Trigger a security scan.

#### Request body
```json
{
  "access_key_id": "string | null",
  "secret_access_key": "string | null",
  "region": "string",
  "mode": "mock"
}
```

**Notes**
- `mock` mode returns canned fixtures (useful for UI testing).
- `real` mode initializes a boto3 session, validates credentials via STS, and enumerates EC2 and S3 resources.

### Example (mock mode)
```bash
curl -s -X POST http://localhost:8000/api/v1/scan   -H "Content-Type: application/json"   -d '{
    "access_key_id": "dummy",
    "secret_access_key": "dummy",
    "region": "us-east-1",
    "mode": "mock"
  }' | jq
```

### Example (real mode)
```bash
curl -s -X POST http://localhost:8000/api/v1/scan   -H "Content-Type: application/json"   -d '{
    "access_key_id": "AKIA...YOURKEY",
    "secret_access_key": "yourSecretKeyHere",
    "region": "us-east-1",
    "mode": "real"
  }' | jq
```

#### Response (trimmed)
```json
{
  "total": 2,
  "mode": "mock",
  "resources": [
    {
      "id": "i-0123456789abcdef0",
      "name": "web-server",
      "type": "EC2",
      "risk": "High",
      "compliance": "Fail",
      "reasons": ["EC2 running and public-facing"],
      "metadata": { /* raw AWS metadata */ }
    }
  ]
}
```

---

## 🖥 Frontend

### Install & run (development)
```bash
cd frontend
npm install

echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
npm run dev
```

By default, Vite serves on http://localhost:5173.

### Build (production)
```bash
cd frontend
npm run build
```

**Styling & Theme**
- Tailwind CSS with custom cyberpunk color palette
- Custom animations (scan line effect) and glassmorphism-inspired UI

---

## 🧪 Tests

### Backend tests
```
backend/
  tests/
    test_analysis.py   # validates risk evaluation using mock payloads
```

Run tests:
```bash
cd backend
pytest -q
```

---

## 🐳 Running with Docker

### Prerequisites
- Docker Desktop (Linux containers enabled)
- Docker Compose v2+
- `.env.production` (Docker / production)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### ▶️ Start the application

```bash
docker compose down -v
docker compose up --build
```

### 🌐 Access the application

- Frontend UI: http://localhost
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

---

## 🔐 Security Notes

- AWS credentials are **never persisted**
- Credentials are used **in‑memory only** for the lifetime of a request

---