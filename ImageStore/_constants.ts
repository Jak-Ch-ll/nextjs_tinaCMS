import path from "path";

export const API_PATH = "/api/v1/images";
export const UPLOAD_DIR = path.join(
  process.cwd(),
  "ImageStore",
  process.env.NODE_ENV === "production" ? "upload_prod" : "upload_dev",
);
