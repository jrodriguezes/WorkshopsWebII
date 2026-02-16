const express = require("express")
const path = require ("path")

const app = express()

app.use(express.static(path.join(__dirname)))

app.get("/professor-panel", async (req, res) => {
    res.sendFile(path.join(__dirname, "views", "professor-panel.html"))
})

app.get("/course-panel", async (req, res) => {
    res.sendFile(path.join(__dirname, "views", "course-panel.html"))
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
});