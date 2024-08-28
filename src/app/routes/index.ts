import express from "express";
import app from "../../app";
import { SchoolRoutes } from "../modules/schools/schools.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: SchoolRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
