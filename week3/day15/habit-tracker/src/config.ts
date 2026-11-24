import { existsSync } from "node:fs";
import { parse } from "node:path";
import {z} from "zod";
if(existsSync(`.env`)){
    process.loadEnvFile();
}
const envSchema = z.object({
    NODE_ENV: z.enum(["development","test","production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    HOST: z.string().default("127.0.0.1")
});
const parsed = envSchema.safeParse(process.env);
if(!parsed.success){
    console.error("Invalid Environment Variable:", z.flattenError(parsed.error).fieldErrors);
    process.exit(1);
}
export type Config = z.infer<typeof envSchema>;
export const config = parsed.data;