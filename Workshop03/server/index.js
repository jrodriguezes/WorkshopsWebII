const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Course = require("./models/course")
const Professor = require("./models/professor")
require ("dotenv").config()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;

db.on("error", (error) => {
    console.log(error)
});

db.once("connected", () => {
    console.log("Database Connected")
});

const app = express()

app.use(bodyParser.json())

app.use(
    cors({
        domains: "*",
        methods: "*",
    }),
)

// course routes

app.get("/courses", async (req, res) => {
    try {
        if (!req.query.id) {
            const data = await Course.find()
            return res.status(200).json(data)
        }

        const data = await Course.findById(req.query.id)
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ errorCode: "COURSE_GET_FAILED" })
    }
})

app.post("/courses", async (req, res) => {
    const courseData = new Course(
        {
            courseCode: req.body.courseCode,
            name: req.body.name,
            description: req.body.description,
            professorId: req.body.professorId,
        }
    )

    try {
        const courseSaved = await courseData.save()
        res.status(201).json(courseSaved)
    } catch (error) {
        res.status(500).json({ errorCode: "COURSE_CREATE_FAILED" })
    }
})

app.put("/courses", async (req, res) => {
    try {
        if (!req.query._id) {
            return res.status(400).json({ errorCode: "COURSE_ID_REQUIRED" })
        }

        const courseData = await Course.findById(req.query._id)

        courseData.courseCode = req.body.courseCode;
        courseData.name = req.body.name;
        courseData.description = req.body.description;
        courseData.professorId = req.body.professorId;

        const courseUpdated = await courseData.save()
        res.status(200).json(courseUpdated)

    } catch (error) {
            res.status(500).json({ errorCode: "PROF_UPDATE_FAILED" })
        }
})

app.delete("/courses", async (req, res) => {
    try {
        const courseDeleted = await Course.findByIdAndDelete(req.query._id)
        res.status(204).json(courseDeleted)

    } catch (error) {
        res.status(500).json({ errorCode: "COURSE_DELETE_FAILED" })
    }
})

// professor routes

app.get("/professors", async (req, res) => {
    try {
        if (!req.query.id) { 
            const data = await Professor.find()
            return res.status(200).json(data)
        }

        const data = await Professor.findById(req.query.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ errorCode: "PROF_GET_FAILED" })
    }
})

app.post("/professors", async (req, res) => {
    const professorData = new Professor(
        {
            idNumber: req.body.idNumber,
            name: req.body.name,
            lastName: req.body.lastName,
            age: req.body.age,
        }
    )

    try {
        const professorSaved = await professorData.save()
        res.status(201).json(professorSaved)

    } catch (error) {
        console.log(error);
        res.status(500).json({ errorCode: "PROF_CREATE_FAILED" })
    }
})

app.put("/professors", async (req, res) => {
    try {
        if (!req.query._id) {
            return res.status(400).json({ errorCode: "PROF_ID_REQUIRED" })
        }

        const professorData = await Professor.findById(req.query._id)

        professorData.idNumber = req.body.idNumber;
        professorData.name = req.body.name;
        professorData.lastName = req.body.lastName;
        professorData.age = req.body.age;


        const professorUpdated = await professorData.save()
        res.status(200).json(professorUpdated)

    } catch (error) {
            res.status(500).json({ errorCode: "PROF_UPDATE_FAILED" })
        }
})

app.delete("/professor", async (req, res ) => {
    try {
        if (!req.query.id) {
            return res.status(400).json({ errorCode: "PROF_ID_REQUIRED" })
        }

        await Professor.findByIdAndDelete(req.query.id)
        res.status(204).json()

    } catch (error) {
        res.status(500).json({ errorCode: "PROF_DELETE_FAILED" })
    }
    
})

app.listen(3001, () => {
    console.log("Server is running on port 3001")
})