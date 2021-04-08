/**
 * @jest-environment node
 */

import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import FormData from "form-data";
import axios from "axios";

import { API_IMAGE_ENDPOINT } from "../_constants";
import { IMAGE_UPLOAD_DIR } from "../_constants";

const endpoint = API_IMAGE_ENDPOINT;
const uploadDir = IMAGE_UPLOAD_DIR;

enum testFileName {
  GET = "getRequest.txt",
  POST = "postRequest.txt",
}

const getAllImages = async () => {
  return await axios(endpoint);
};

const postNewImage = async () => {
  const formData = new FormData();
  formData.append("file", "Hello world", testFileName.POST);

  return axios.post(endpoint, formData.getBuffer(), {
    headers: formData.getHeaders(),
  });
};

afterAll(async () => {
  await fs.rm(uploadDir, {
    recursive: true,
    force: true,
  });
  await fs.mkdir(uploadDir);
});

describe("GET to /images", () => {
  beforeAll(async () => {
    await fs.rm(uploadDir, {
      recursive: true,
      force: true,
    });
    await fs.mkdir(uploadDir);
    await fs.appendFile(
      path.join(uploadDir, testFileName.GET),
      "Hello get request"
    );
  });

  it("returns status '200'", async () => {
    const res = await getAllImages();

    expect(res.status).toBe(200);
  });

  it("returns an array of length 1", async () => {
    const res = await getAllImages();

    expect(res.data).toHaveLength(1);
  });

  it("returns the correct filename as first element", async () => {
    const res = await getAllImages();

    expect(res.data[0]).toBe(testFileName.GET);
  });
});

describe("POST to /images", () => {
  beforeEach(async () => {
    await fs.rm(uploadDir, {
      recursive: true,
      force: true,
    });
    await fs.mkdir(uploadDir);
  });

  it("returns status '201'", async () => {
    const res = await postNewImage();

    expect(res.status).toBe(201);
  });

  it(`creates a file with the name '${testFileName.POST}'`, async () => {
    await postNewImage();
    const files = await fs.readdir(uploadDir);

    expect(files[0]).toBe(testFileName.POST);
  });
});

describe("Other requests to /images", () => {
  it.each([["PUT"], ["PATCH"], ["DELETE"], ["OPTIONS"], ["TRACE"]])(
    "sends back status '405' on method '%s'",
    async (method) => {
      const res = await fetch(endpoint, {
        method,
      });
      expect(res.status).toBe(405);
    }
  );
});
