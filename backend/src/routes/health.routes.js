// Task:
// 1. Create an Express router.
// 2. Add GET / route.
// 3. Return JSON like:
//    {
//      status: "ok",
//      message: "Backend is running"
//    }
// 4. Export the router.

import express from 'express';

const router = express.Router();

router.get('/',(req,res)=>{
  res.status(200).json({
    status: "ok",
    message: "Backend is running",
    timestamp: Date.now()
  })
})

export default router;

