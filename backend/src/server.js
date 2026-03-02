import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";
import authServices from "./services/auth.services.js";

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    await authServices.createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
