# School Management Server

## Live URL

You can access the live version of the application [here](https://school-management-node-sql.vercel.app/).

## Features

1. **Add School:** Users can add a new school to the database by providing the school's name, address, latitude, and longitude.
2. **List Schools:** Users can retrieve a list of all schools, sorted by their proximity to the user's location based on the provided latitude and longitude.
3. **Input Validation:** The API validates all input data to ensure fields are non-empty and of the correct data type before adding or listing schools.
4. **Proximity-Based Sorting:** The API calculates the geographical distance between the user's coordinates and each school's coordinates, returning the schools sorted by the nearest to the farthest.
5. **Pagination and Filtering:** The application supports pagination and filtering of donor lists for easier navigation and search.
