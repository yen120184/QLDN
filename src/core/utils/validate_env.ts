import { cleanEnv, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    USER: str(),
    PASSWORD: str(),
    DATABASE: str(),
  });
};

export default validateEnv;
