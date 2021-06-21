const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");

const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms - :data"
    )
);
app.use(cors());

morgan.token("data", (req, res) => JSON.stringify(req.body));

app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then((persons) => res.json(persons))
        .catch((error) => next(error));
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

app.post("/api/persons", (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: "name or number missing" });
    }

    Person.find({ name: body.name })
        .then((person) => {
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
        })
        .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
    const event = new Date();

    Person.find({})
        .then((result) => {
            console.log(result.length);
            const phonebookEntries = result.length;
            res.send(
                `<h2>Phonebook has info for ${phonebookEntries}</h2> <h2>${event.toString()}</h2>`
            );
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
    console.log(err);
    if ((err.name = "CastError")) {
        return res.status(400).send({ error: "malformatted id" });
    }
    if (error.name === "ValidationError") {
        return res.status(400).send({ error: "unexpected format" });
    }
    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
