const mongoose = require("mongoose");

const password = process.argv[2];
const URL = `mongodb+srv://full-stack-2021:${password}@clusterfs.pycwl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const name = process.argv[3];
const number = process.argv[4];

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name: name,
    number: number,
});

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
} else if (process.argv.length === 5) {
    person.save().then((result) => {
        console.log(`added ${name} number ${number} to phonoebook`);
        mongoose.connection.close();
    });
} else if (process.argv.length === 3) {
    console.log("phonebook: ");
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
            mongoose.connection.close();
        });
    });
}
