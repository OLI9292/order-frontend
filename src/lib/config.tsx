import * as dotenv from "dotenv"
dotenv.config()

export default {
  API_URL: process.env.API_URL || "http://localhost:4000"
}
