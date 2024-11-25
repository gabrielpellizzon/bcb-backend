# BCB – Big Chat Brasil

**BCB – Big Chat Brasil** is a platform for sending SMS and WhatsApp messages, developed as part of a technical challenge. The system allows clients to send messages to end-users and includes financial functionalities to manage payment plans (prepaid and postpaid), balances, and limits.

## **Project Assumptions**

1. **Message Sending**:

   - Each SMS message costs **R$0.25**.
   - Clients can choose to send messages via **WhatsApp** or **SMS**.
   - WhatsApp messages have no additional cost.

2. **Client Plans**:

   - **Prepaid**:
     - Clients need to have an available balance to send messages.
     - The balance is deducted with each sent message.
   - **Postpaid**:
     - Clients can consume messages up to a configured limit.
     - Usage is logged monthly and needs to be settled later.

3. **Financial Operations**:

   - The system must allow adding credits for prepaid clients.
   - For postpaid clients, it should allow adjusting the credit limit.

4. **Data Management**:
   - Basic client data (name, CPF, CNPJ, email, phone) must be registered.

---

## **Technologies Used**

- **Backend**: NestJS, Prisma ORM, PostgreSQL (executed via Docker).
- **Frontend**: NextJS with TypeScript.
- **Database**: PostgreSQL.
- **Infrastructure**: Docker Compose to orchestrate services.

---

## **How to Run the Backend**

### **1. Prerequisites**

Make sure you have the following tools installed:

- [Docker & Docker Compose](https://docs.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### **2. Environment Configuration**

1. Clone the repository:

   ```bash
   git clone https://github.com/gabrielpellizzon/bcb-backend.git
   cd bcb-backend

   ```

2. Set up the .env file:
   - Copy the .env.example file to .env
   - Edit the environment variables as needes (database credentials, ports, etc).

### **3. Running the Backend**

1. Navigate to the backend folder:

   ```bash
   cd bcb-backend
   ```

2. Start the Docker container with the database:

   ```bash
   docker-compose up -d
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Run Prisma migrations to create the database tables:

   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:

   ```bash
   npx prisma db seed
   ```

6. Start the server:

   ```bash
   npm run start:dev
   ```

7. Access the Swagger documentation in your browser:
   - http://localhost:3000/api

## Project Structure

```plaintext
bcb-backend/
│ └── common/
│ └── prisma/
│ └── src/
│ └── test/
│ └── .env.example
│ └── docker-compose.yml
│ └── package.json
│ └── package-lock.json/
│ └── README.md
│ └── .gitignore
└──
```
