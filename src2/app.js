import express from "express"
import cors from "cors"
import router from "./src2/routes/router.js"

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use("/api2", router)


export default app
