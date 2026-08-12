// Task:
// 1. Import the app from app.js.
// 2. Import env config from config/env.js.
// 3. Start the server using app.listen().
// 4. Log the running port in the console.

import app from "./app.js"
import config from "./config/env.js"

app.listen(config.port,()=>{
    console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
});
