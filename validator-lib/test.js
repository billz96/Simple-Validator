import Validator from './validator';

let PersonSchema = {
    name: {
        type: "string",
        minLen: 4,
        maxLen: 10
    },
    age: {
        type: "number",
        min: 15,
        max: 65
    },
    friends: {
        type: ["string"]
    },
    gender: {
        type: "string",
        values: ["Male", "Female", "Other"]
    },
    email: {
        isEmail: true
    },
    phone: {
        isPhoneNo: true
    }
};

let validator = new Validator(PersonSchema);

let person = {
    name: "Billy",
    age: 14,
    gender: 66,
    email: "billzografos96yahoo.com",
    phone: "693667818"
};

let person2 = {
    name: "John",
    age: 18,
    friends: ["Bob", "Jim", "May"],
    gender: "Male",
    email: "johnzografos48@yahoo.gr",
    phone: "6946067818"
};

// fails
let errors = validator.validate(person);
console.log(errors); // object

// succeeds
let errors2 = validator.validate(person2);
console.log(errors2); // undefined
