import { app } from "./application";
import { logger } from "./application/logging";

const port = process.env.PORT || 3001;

app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});
