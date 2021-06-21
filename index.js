const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms - :data"
    )
);
app.use(cors());
app.use(express.static("build"));

morgan.token("data", (req, res) => JSON.stringify(req.body));

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then((person) => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: "name or number missing" });
    }

    Person.find({ name: body.name }).then((person) => {
        if (person.length !== 0) {
            return res.status(400).json({ error: "name must be unique" });
        } else {
            const person = new Person({
                name: body.name,
                number: body.number,
            });

            person.save().then((savedPerson) => {
                res.json(savedPerson);
            });
        }
    });
});

app.get("/info", (req, res) => {
    const event = new Date();

    Person.find({})
        .then((result) => {
            console.log(result.length);
            const phonebookEntries = result.length;
            res.send(
                `<h2>Phonebook has info for ${phonebookEntries}</h2> <h2>${event.toString()}</h2>`
            );
        })
        .catch((error) => console.log(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
