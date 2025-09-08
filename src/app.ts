
import express from 'express'
import { Request, Response } from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import { router } from './app/routes'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import notFound from './app/middleware/notFound'
import { envVar } from './app/config/env'

const app = express()


app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1) 
app.use(cors({
  origin: envVar.FRONTEND_URL,
  credentials: true
}));
app.use("/api/v1", router)


app.get("/" , ( req:Request, res: Response ) =>{
    res.status(200).json({
        message: "Welcome to the pocket wallet backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;