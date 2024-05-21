import cors from "cors";
import express from "express";
import midNotJson from "./midNotJson";
import midNotFound from "./midNotFound";
import midConnectDB from "./midConnectDB";
import midValidJson from "./midValidJson";
import midErrorHandler from "./midErrorHandler";
import midToken from "./midToken";

export const midJson = () => express.json();

export const midCors = () => cors({ credentials: true, origin: true });

export { midNotJson };

export { midNotFound };

export { midConnectDB };

export { midValidJson };

export { midErrorHandler };

export { midToken };
