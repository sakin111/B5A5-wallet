import { Server } from 'http'
import mongoose from 'mongoose'
import { envVar } from './app/config/env'
import app from './app'


let server: Server

const StartServer = async () =>{
    try {
        await mongoose.connect(envVar.DB_URL)

        console.log("connected to DB")
        server = app.listen(envVar.PORT, () => {
            console.log(`server is running on the port ${envVar.PORT}` )
        })

    } catch (error) {
        console.log(error)
    }
}

