# Instructions

## Prereqs
- Node.js
- MongoDB Community Edition
- Git

## 1. Install Dependencies

### Frontend Dependencies
```bash
# from project root (safework-app-fe)
npm install
```

### Backend Dependencies
```bash
# nav to backend folder
cd backend
npm install
```

## 2. MongoDB Setup

### Mac:
```bash
# start MongoDB service:
brew services start mongodb/brew/mongodb-community

# test connection:
mongosh
```
## 3. Environment Configuration

### Create Backend .env File
```bash
# nav to backend folder
cd backend

# create .env file with this:
DATABASE_URL=mongodb://localhost:27017/safework
```

the database name `safework` will be created automatically.

## 4. Database Setup & Seed Data

### Step 1: Start the Backend
```bash
# from backend folder
npx ts-node server.ts
```

### Step 2: Create Data

**Using MongoDB Compass (GUI)**
**Create Workplaces:**
Add these documents to the `workplaces` collection:

```json
{
  "_id": {"$oid": "684e5bfc8fe1c860d4b53d0f"},
  "name": "Construction Site A",
  "location": "Sydney CBD"
}
```

```json
{
  "_id": {"$oid": "684e5c118fe1c860d4b53d11"},
  "name": "Office Building B", 
  "location": "Parramatta"
}
```

**Create Users:**
Add these documents to the `users` collection:

```json
{
  "_id": {"$oid": "684e5ced8fe1c860d4b53d1a"},
  "name": "Ashley User",
  "email": "ashley@safework.com",
  "role": "user",
  "workplaceId": {"$oid": "684e5bfc8fe1c860d4b53d0f"}
}
```

```json
{
  "_id": {"$oid": "684e5c768fe1c860d4b53d15"},
  "name": "John Foreman",
  "email": "john@safework.com", 
  "role": "foreman",
  "workplaceId": {"$oid": "684e5bfc8fe1c860d4b53d0f"}
}
```

## 5. Running the Application

### Terminal 1 - Backend:
```bash
cd backend
npx ts-node server.ts
```

### Terminal 2 - Frontend:
```bash
# from project root
npm run dev
```