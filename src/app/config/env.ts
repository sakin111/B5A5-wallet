import dotenv from "dotenv"

dotenv.config()

export interface envConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",

}


const envProviders = (): envConfig => {
    const requiredConfig: string[] = ['PORT', 'DB_URL', 'NODE_ENV']
    requiredConfig.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`please define the ${key} in your .env file`)
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",

    }
}




export const envVar = envProviders()
