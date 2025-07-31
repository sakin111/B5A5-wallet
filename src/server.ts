import { Server } from 'http'
import mongoose from 'mongoose'
import { envVar } from './app/config/env'
import app from './app'
import { seedAdmin } from './app/utils/seedAdmin'


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

(async() =>{
   await StartServer()
  await  seedAdmin()
})()

process.on("SIGTERM", (err) => {
    console.log("sigterm  detected, shutting down the server...." ,err)
    if (server){
        server.close(() =>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection is detected, shutting down the server" ,err)
    if (server){
        server.close(() =>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("uncaughtException", (err) => {
    console.log("uncaughtException is detected, shutting down the server" ,err)
    if (server){
        server.close(() =>{
            process.exit(1)
        })
    }
    process.exit(1)
})

