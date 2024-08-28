import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { SchoolServices } from "./schools.service";
import pick from "../../../shared/pick";
import { schoolFilterableFilds } from "./schools.constant";

const addSchool = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);

  const result = await SchoolServices.addSchoolIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New school added successfully!",
    data: result,
  });
});

const getAllSchools = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, schoolFilterableFilds);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await SchoolServices.getAllSchoolsFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schools list retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const SchoolControllers = {
  addSchool,
  getAllSchools,
};
