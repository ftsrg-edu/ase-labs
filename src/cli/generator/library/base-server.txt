import express from 'express';
import { Server } from 'http';

export abstract class BaseServer {

    constructor(
        private readonly port: number | string,
        private readonly name: string
    ) { }

    start(): Server {
        const app = express();

        app.use(express.json());

        this.registerEndpoints(app);

        return app.listen(this.port, () => {
            console.log(`${this.name} running on port ${this.port}`);
        });
    }

    abstract registerEndpoints(app: express.Express): void;
}
