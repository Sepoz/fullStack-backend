const mongoose = require("mongoose");

const URL = process.env.MONGODB_URI;
mongoose
    .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .catch((error) =>
        console.log("error connecting to MongoDB:", error.message)
    );

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
