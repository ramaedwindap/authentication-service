// types/express.d.ts
import { Request } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: any; // You can replace `any` with a more specific type if you have a User type defined
    }
}
