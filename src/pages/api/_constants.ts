import path from "path";

export const API_ENDPOINT = "http://localhost:3000/api";
export const API_ARTICLE_ENDPOINT = `${API_ENDPOINT}/article`;
export const API_IMAGE_ENDPOINT = `${API_ENDPOINT}/image`;

export const API_ENDPOINT_INTERNAL = "/api";
export const API_ARTICLE_ENDPOINT_INTERNAL = `${API_ENDPOINT_INTERNAL}/article`;
export const API_IMAGE_ENDPOINT_INTERNAL = `${API_ENDPOINT_INTERNAL}/image`;

export const IMAGE_UPLOAD_DIR = path.join(
  process.cwd(),
  "imageDB",
  process.env.NODE_ENV === "production" ? "upload_prod" : "upload_dev"
);
