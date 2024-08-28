"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolRoutes = void 0;
const express_1 = __importDefault(require("express"));
const schools_controller_1 = require("./schools.controller");
const router = express_1.default.Router();
router.post("/addSchool", schools_controller_1.SchoolControllers.addSchool);
router.get("/listSchools", schools_controller_1.SchoolControllers.getAllSchools);
exports.SchoolRoutes = router;
