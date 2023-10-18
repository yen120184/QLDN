import { Route } from "core/interfaces";
import express from "express";
import sql from "mssql";
class App {
    public app: express.Application;
    public port: string | number;

    constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 5000;

    this.initializeRoutes(routes);
    this.connectToDatabase();

    }

    public listen() {
    this.app.listen(this.port, () => {
        console.log(`Server is listening on port ${this.port}`);
    });
    }

    private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
        this.app.use("/", route.router);
    });
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
                console.log("Connected to MSSQL");
                return pool;
                })
                .catch((err) =>
                console.log("Database Connection Failed! Bad Config: ", err.message)
                );  
                module.exports = {  
                sql, poolPromise  
}  
    }

}

export default App;
