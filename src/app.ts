import { Route } from "@core/interfaces";
import express from "express";
import sql from "mssql";
import hpp from "hpp";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import Logger from "@core/utils/logger";
class App {
    public app: express.Application;
    public port: string | number;
    public production: boolean;

    constructor(routes: Route[]) {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.production = process.env.NODE_ENV == "production" ? true : false;

        this.initializeRoutes(routes);
        this.connectToDatabase();
        this.initializeMiddleware();
    }

    public listen() {
        this.app.listen(this.port, () => {
        Logger.info(`Server is listening on port ${this.port}`);
        });
    }

    private initializeRoutes(routes: Route[]) {
        routes.forEach((route) => {
        this.app.use("/", route.router);
        });
    }

    private initializeMiddleware() {
        if (this.production) {
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(morgan("combined"));
        this.app.use(cors({ origin: "your.domain.com", credentials: true }));
        } else {
        this.app.use(morgan("dev"));
        this.app.use(cors({ origin: true, credentials: true }));
        }
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        //this.app.use(errorMiddleware);
    }

    private connectToDatabase() {
        const config = {
        user: process.env.USER,
        password: process.env.PASSWORD,
        server: "113.160.113.200",
        database: process.env.DATABASE,
        port: 65000,
        options: {
            trustServerCertificate: true,
            encrypt: false,
        },
        };
        const poolPromise = new sql.ConnectionPool(config)
        .connect()
        .then((pool) => {
            Logger.info("Database connected...");
            return pool;
        })
        .catch((err) =>
            Logger.info("Database not connected...")
        );
        module.exports = {
        sql,
        poolPromise,
        };
    }
}

export default App;
