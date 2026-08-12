// Task:
// 1. Import and configure dotenv.
// 2. Read PORT and NODE_ENV from process.env.
// 3. Export them in one config object.
// 4. Use a fallback port like 4000 if PORT is missing.

import dotenv from "dotenv"
dotenv.config();

const config = {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || 'development'
}

export default config;

// It reads .env file and exports the variables.
// If PORT is missing, it uses 4000.
// If NODE_ENV is missing, it uses 'development'.
// Node_env is mode it has three types  1. Development, 2. Test, 3. Production 

/* Security:

Different Environments: 
We often have sensitive information like database passwords or secret API keys. 
We never want to write these directly in our code because if we upload our code to GitHub, 
anyone could see them. Instead, we put them in a .env file (which is ignored by Git thanks 
to our .gitignore file) and load them in safely.

When you run the app on your computer (development mode), you might use port 4000 and a local test database. 
But when you deploy it to a real server on the internet (production mode), the server might automatically assign it port 8080 and a real database. 
Using env.js allows your code to adapt to wherever it's running without you having to manually change the code!

Clean Code: By keeping all our environment variables in one configuration file (env.js), 
if we ever need to add a new variable (like a database URL), we only have to change it in one place, keeping our code organized.
*/