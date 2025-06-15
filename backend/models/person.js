"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
const mongoose_1 = require("mongoose");
;
const personSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    age: { type: String, required: true },
    occupation: { type: String, default: 'No data' }
});
//ES TS export default
exports.Person = (0, mongoose_1.model)('Person', personSchema);
