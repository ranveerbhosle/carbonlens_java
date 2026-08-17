# 🌿 CarbonLens — Personal Carbon Footprint Tracker

A full-stack web application that lets users upload electricity, fuel, or LPG bills, automatically extracts consumption data via OCR, and calculates their carbon emissions.

---

## 📁 Project Structure

```
mpj/
├── frontend/          ← React + Vite + Tailwind CSS
├── backend/           ← Spring Boot 3 + Java 17
└── database/
    └── schema.sql     ← MySQL database schema
```

---

## ⚙️ Prerequisites — What to Install

### 1. Java 17 (JDK)
- Download: https://adoptium.net/en-GB/temurin/releases/?version=17
- Choose: **Windows x64 MSI installer**
- During install, check "Add to PATH" ✅
- Verify: `java -version` (should say 17.x.x)

### 2. Apache Maven
- Download: https://maven.apache.org/download.cgi → **Binary zip archive**
- Extract to `C:\Program Files\Apache\maven`
- Add `C:\Program Files\Apache\maven\bin` to **System PATH**
- Verify: `mvn -version`

### 3. MySQL 8.0
- Download: https://dev.mysql.com/downloads/mysql/
- Choose: **MySQL Installer for Windows**
- During install, set **root password** (remember this!)
- Verify: `mysql -u root -p`

### 4. Node.js 20+ (for frontend)
- Download: https://nodejs.org/ → LTS version
- Verify: `node -v` and `npm -v`

### 5. Tesseract OCR (for bill scanning)
- Download: https://github.com/UB-Mannheim/tesseract/wiki
- Install the **Windows exe installer** (tesseract-ocr-w64-setup-x.x.x.exe)
- Default path: `C:\Program Files\Tesseract-OCR`
- During install, select **"Add to PATH"** ✅
- Verify: `tesseract --version`

---

## 🗄️ Database Setup

1. Open MySQL Workbench or the MySQL command line
2. Run the schema file:

```sql
source C:/Users/Paras kore/Desktop/mpj/database/schema.sql
```

Or copy-paste the contents of `database/schema.sql` into MySQL Workbench and execute.

---

## 🔧 Backend Setup (Spring Boot)

### 1. Configure Database Connection
Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/carbonlens?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE   ← Change this!
```

### 2. Configure Tesseract Path
In the same `application.properties`:

```properties
tesseract.datapath=C:/Program Files/Tesseract-OCR/tessdata
```

> Make sure this path exists after installing Tesseract.

### 3. Run the Backend

```bash
cd C:\Users\Paras kore\Desktop\mpj\backend
mvn spring-boot:run
```

The server will start at **http://localhost:8080**

---

## 💻 Frontend Setup (React + Vite)

### 1. Navigate to frontend folder

```bash
cd C:\Users\Paras kore\Desktop\mpj\frontend
```

### 2. Install dependencies (already done if you ran the init script)

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will open at **http://localhost:5173**

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| POST | `/api/bills/upload` | ✅ | Upload bill image/PDF |
| GET | `/api/bills/history` | ✅ | Get all user bills |
| GET | `/api/bills/{id}` | ✅ | Get single bill |
| GET | `/api/dashboard/summary` | ✅ | Summary stats |
| GET | `/api/dashboard/trend` | ✅ | Monthly trend data |
| GET | `/api/dashboard/breakdown` | ✅ | Breakdown by type |

> ✅ Protected routes require `Authorization: Bearer <token>` header

---

## 📱 Pages

| Route | Page | Auth Required |
|-------|------|--------------|
| `/` | Landing Page | ❌ |
| `/login` | Sign In | ❌ |
| `/register` | Create Account | ❌ |
| `/dashboard` | Dashboard | ✅ |
| `/upload` | Upload Bill | ✅ |
| `/history` | Bill History | ✅ |
| `/tips` | Sustainability Tips | ✅ |

---

## 🧪 Carbon Calculation Formulas

| Bill Type | Formula | Unit |
|-----------|---------|------|
| Electricity | kWh × 0.82 | kg CO₂ |
| Petrol | Liters × 2.31 | kg CO₂ |
| Diesel | Liters × 2.68 | kg CO₂ |
| LPG | kg × 2.98 | kg CO₂ |

**Emission Levels:**
- 🟢 **Low**: Electricity <100kg, Fuel <20kg, LPG <30kg
- 🟡 **Medium**: Electricity 100–300kg, Fuel 20–60kg, LPG 30–90kg
- 🔴 **High**: Above those thresholds

---

## 🚨 Common Issues

**"java not found"** → Ensure JDK 17 is installed and JAVA_HOME is set in PATH  
**"mvn not found"** → Add Maven's `bin` folder to System PATH  
**MySQL connection error** → Check if MySQL service is running (`net start mysql80` in cmd)  
**Tesseract error** → Make sure path in `application.properties` is correct  
**CORS error** → Backend must be running on port 8080; frontend on 5173

---

## 👥 Team

Built with ❤️ for a greener planet — CarbonLens Team
