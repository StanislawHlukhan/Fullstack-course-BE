"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const EnvSchema_1 = require("src/types/EnvSchema");
EnvSchema_1.EnvSchema.parse(process.env);
