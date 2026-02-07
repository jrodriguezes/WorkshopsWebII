const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Course = require("./models/course");
const path = require("path");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);
const database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log("Database Connected");
});

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(
    cors({
        domains: "*",
        methods: "*",
    }),
);

app.use(express.static(path.join(__dirname, "..", "public")));

//routes
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "courses-panel.html"));
});

// get all courses or single course by id
app.get("/course", async(req, res) => {
    try {
        //if id is passed as query param, return single course else return all courses
        if (!req.query._id) {
            const data = await Course.find();
            return res.status(200).json(data);
        }
        const data = await Course.findById(req.query.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// create course
app.post("/course", async(req, res) => {
    const course = new Course({
        name: req.body.name,
        credits: req.body.credits,
    });

    try {
        const courseCreated = await course.save();
        //add header location to the response
        res.header("Location", `/course?id=${courseCreated._id}`);
        res.status(201).json(courseCreated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put("/course", async(req, res) => {
    try {
        const id = req.query.id;

        const { name, credits } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        course.name = name ?? course.name;
        course.credits = credits ?? course.credits;

        const updatedCourse = await course.save();
        res.status(200).json(updatedCourse);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/course", async(req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        await course.deleteOne();
        res.status(200).json({ message: "Course deleted successfully" });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

//start the app
app.listen(3001, () => console.log(`UTN API service listening on port 3001!`));