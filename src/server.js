require("express-async-errors");
require("dotenv/config");

const uploadConfig = require("./configs/upload");

const appError = require("./utils/AppError");
const migrationsRun = require("./database/sqlite/migrations");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

migrationsRun();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof appError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })
});

const PORT = process.env.PORT || 3333;
//listen é para esperar na PORT a variavel que criei para ser a porta;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))