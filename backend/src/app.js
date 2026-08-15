// Task:
// 1. Import express and cors.
// 2. Create the Express app.
// 3. Add cors middleware.
// 4. Add express.json() middleware.
// 5. Add a root GET / route that returns a small welcome message.
// 6. Mount the health router on /api/health.
// 7. Export the app.

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import accountRoutes from './routes/account.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/accounts', accountRoutes);

app.get('/',(req,res)=>{
    res.status(200).json({
        msg:"Welcome JPMorganChase Intern 2026 Pinak Thummar"
    })
});

export default app;