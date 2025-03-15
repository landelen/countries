# SETUP
```
git clone https://github.com/landelen/countries
cd countries
npm install
```
# Database Configuration
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_database
```
npx prisma migrate dev --name init
npx prisma generate
```
