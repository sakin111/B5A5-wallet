
import express from 'express'
import { Request, Response } from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import { router } from './app/routes'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import notFound from './app/middleware/notFound'

const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api/v1", router)


app.get("/" , ( req:Request, res: Response ) =>{
    res.status(200).json({
        message: "Welcome to the PH Tour Management backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;