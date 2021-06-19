const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let phonebookEntries = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1,
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2,
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3,
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4,
    },
];

function generateID(max) {
    return Math.floor(Math.random() * max);
}

app.get("/api/persons", (req, res) => {
    res.json(phonebookEntries);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = phonebookEntries.find((person) => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    phonebookEntries = phonebookEntries.filter((person) => person.id !== id);

    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    const personName = phonebookEntries.find(
        (person) => person.name === body.name
    );

    if (!body.name || !body.number) {
        return res.status(400).json({ error: "name or number missing" });
    } else if (personName !== undefined) {
        return res.status(400).json({ error: "name must be unique" });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateID(1000000),
    };

    phonebookEntries = phonebookEntries.concat(person);

    res.status(200).end();
});

app.get("/info", (req, res) => {
    const event = new Date();
    // prettier-ignore
    res.send(`<h2>Phonebook has info for ${phonebookEntries.length}</h2> <h2>${event.toString()}</h2>`);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
