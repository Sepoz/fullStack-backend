const express = require("express");
const app = express();

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

app.get("/api/persons", (req, res) => {
    res.json(phonebookEntries);
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
