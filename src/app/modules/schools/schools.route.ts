import express from "express";
import { SchoolControllers } from "./schools.controller";

const router = express.Router();

router.post("/addSchool", SchoolControllers.addSchool);

router.get("/listSchools", SchoolControllers.getAllSchools);

export const SchoolRoutes = router;
