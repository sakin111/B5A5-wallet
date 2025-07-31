import dotenv from "dotenv"

dotenv.config()

export interface envConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_ACCESS_EXPIRE : string,
    JWT_ACCESS_SECRET: string,
   JWT_REFRESH_SECRET :string
   JWT_REFRESH_EXPIRE: string
   BCRYPT_SALT_ROUND : string
   ADMIN_EMAIL: string
   ADMIN_PASSWORD : string

}


const envProviders = (): envConfig => {
    const requiredConfig: string[] = ['PORT', 'DB_URL', 'NODE_ENV','JWT_ACCESS_EXPIRE', 'JWT_ACCESS_SECRET', 'JWT_ACCESS_SECRET', 'JWT_ACCESS_SECRET' , 'BCRYPT_SALT_ROUND','ADMIN_EMAIL', 'ADMIN_PASSWORD']
    requiredConfig.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`please define the ${key} in your .env file`)
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
         JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,

    }
}




export const envVar = envProviders()
