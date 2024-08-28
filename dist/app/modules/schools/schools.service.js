"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolServices = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const schools_constant_1 = require("./schools.constant");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const calculateDistance_1 = require("../../../helpers/calculateDistance");
const addSchoolIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, latitude, longitude } = payload;
    // Validate that name and address have at least 2 characters
    if (!name || name.length < 2) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Name must be at least 2 characters long.");
    }
    if (!address || address.length < 2) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Address must be at least 2 characters long.");
    }
    const createdPostData = yield prisma_1.default.school.create({
        data: payload,
    });
    return createdPostData;
});
const getAllSchoolsFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const andConditions = [];
    const { searchTerm, latitude, longitude } = params, filterData = __rest(params, ["searchTerm", "latitude", "longitude"]);
    console.log(latitude, longitude);
    const userLatitude = Number(latitude);
    const userLongitude = Number(longitude);
    console.log(userLatitude, userLongitude);
    if (searchTerm) {
        console.log(searchTerm);
        andConditions.push({
            OR: schools_constant_1.schoolSearchableFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = { AND: andConditions };
    const schools = yield prisma_1.default.school.findMany({
        where: whereConditions,
        // include: {},
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
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
            const distance = (0, calculateDistance_1.calculateDistance)(userLatitude, userLongitude, school.latitude, school.longitude);
            return Object.assign(Object.assign({}, school), { distance });
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
});
exports.SchoolServices = {
    addSchoolIntoDB,
    getAllSchoolsFromDB,
};
