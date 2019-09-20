function Validator(schema) {
    this.schema = schema;
}

Validator.prototype.type = (arg, t) => {
    return typeof arg === t ? 'pass' : `is not a "${t}"`;
};

Validator.prototype.array = (arg, t) => {
    if (Array.isArray(arg)) {
        return arg.every(el => (typeof el === t)) ? 'pass' : `is not a list of "${t}"`;
    } else {
        return `is not a list of "${t}"`;
    }
};

Validator.prototype.values = function (arg, arr) {
    return arr.some(el => el === arg) ? 'pass' : `is none of "${arr}"`;
}

Validator.prototype.isEmail = function (arg) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return typeof arg === "string" && re.test(arg) ? 'pass' : `is not an email`;
}

Validator.prototype.isPhoneNo = function (arg) {
    let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return typeof arg === "string" && re.test(arg) ? 'pass' : `is not an phone number`;
}

Validator.prototype.isURL = function (arg) {
    let re = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
    return typeof arg === "string" && re.test(arg) ? 'pass' : `is not an url`;
}

Validator.prototype.minLen = (str, n) => {
    return typeof str === "string" && str.length >= n ? 'pass' : `min length is ${n}`;
};

Validator.prototype.maxLen = (str, n) => {
    return typeof str === "string" && str.length <= n ? 'pass' : `max length is ${n}`;
};

Validator.prototype.min = (n, N) => {
    return typeof n === "number" && n >= N ? 'pass' : `min number is ${N}`;
};

Validator.prototype.max = (n, N) => {
    return typeof n === "number" && n <= N ? 'pass' : `max number is ${N}`;
};

Validator.prototype._validate = function (data) {
    let props = Object.keys(this.schema);

    let results = props.map(prop => {
        let value = data[prop] ? data[prop] : null;
        if (value == null) return ['field is required']; // every prop is required!
        let configs = Object.entries(this.schema[prop]); // [['type', ['string']], ['min', 12], ...]

        let result = configs.map(config => {
            let [name, arg] = config;
            if (Array.isArray(arg) && name == 'type') {
                return this.array(value, arg[0]);
            } else if (typeof arg == "boolean") {
                return this[name](value);
            } else {
                return this[name](value, arg);
            }
        });

        return result;
    });

    let checks = results.map(result => {
        return result.every(res => (res == 'pass')); // check if prop passed all validations
    });

    let passed = checks.every(check => (check == true)); // check if all props passed their validations

    if (passed) {
        return; // validation succeeded
    } else {
        let errors = props.map((prop, i) => {
            let messages = results[i].filter(result => result != 'pass');
            if (messages.length == 0) return; // returns undefined if the field has passed the validation
            return [prop, messages];
        });

        errors = errors.filter(err => err != undefined); // remove undefined values

        const errorObj = {};

        errors.forEach(err => {
            let [prop, messages] = err;
            errorObj[prop] = messages;
        });

        return errorObj; // validation failed
    }
};

Validator.prototype.validate = function (data, callback) {
    if (!callback) {
        return this._validate(data);
    } else {
        let that = this;
        setTimeout(() => {
            let errors = that._validate(data);
            if (errors) {
                callback(err);
            } else {
                callback();
            }
        }, 0);
    }
}

export {Validator};