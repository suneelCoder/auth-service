import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = () => {
    try {
        app.listen(Config.PORT, () =>
            // console.log(`server is running on ${Config.PORT}`),
            logger.info(`server is running on ${Config.PORT}`),
        );
    } catch (error) {
        // console.log(error);
        process.exit(1);
    }
};

startServer();
