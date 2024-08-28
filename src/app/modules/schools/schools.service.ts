import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { ISchooltFilterRequest } from "./schools.interface";
import { schoolSearchableFields } from "./schools.constant";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { calculateDistance } from "../../../helpers/calculateDistance";

const addSchoolIntoDB = async (payload: any) => {
  const { name, address, latitude, longitude } = payload;

  // Validate that name and address have at least 2 characters
  if (!name || name.length < 2) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Name must be at least 2 characters long."
    );
  }
  if (!address || address.length < 2) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Address must be at least 2 characters long."
    );
  }
  const createdPostData = await prisma.school.create({
    data: payload,
  });

  return createdPostData;
};

const getAllSchoolsFromDB = async (
  params: ISchooltFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const andConditions: Prisma.SchoolWhereInput[] = [];

  const { searchTerm, latitude, longitude, ...filterData } = params;

  console.log(latitude, longitude);

  const userLatitude = Number(latitude);
  const userLongitude = Number(longitude);

  console.log(userLatitude, userLongitude);

  if (searchTerm) {
    console.log(searchTerm);
    andConditions.push({
      OR: schoolSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //   Implementing Filtering On Specific Fields And Values
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.SchoolWhereInput = { AND: andConditions };

  const schools = await prisma.school.findMany({
    where: whereConditions,
    // include: {},
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  // Calculate distance and sort by proximity
  let sortedSchools = schools;
  if (userLatitude !== undefined && userLongitude !== undefined) {
    sortedSchools = schools
      .map((school) => {
        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          school.latitude,
          school.longitude
        );
        return { ...school, distance };
      })
      .sort((a, b) => a.distance - b.distance); // Sort by distance
  }

  const paginatedSchools = sortedSchools.slice(skip, skip + limit);

  const total = sortedSchools.length; // Total schools before pagination

  return {
    success: true,
    statusCode: 200,
    message: "Schools list retrieved successfully!",
    meta: {
      page,
      limit,
      total,
    },
    data: paginatedSchools,
  };
};

export const SchoolServices = {
  addSchoolIntoDB,
  getAllSchoolsFromDB,
};
