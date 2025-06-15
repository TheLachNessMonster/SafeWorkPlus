"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workplace = void 0;
const mongoose_1 = require("mongoose");
;
const workplaceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
});
//ES TS export default
exports.Workplace = (0, mongoose_1.model)('Workplace', workplaceSchema);
