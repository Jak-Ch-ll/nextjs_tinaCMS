/**
 * @jest-environment node
 */

import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import FormData from "form-data";
import { UPLOAD_DIR } from "../../../../ImageStore/_constants";
import axios from "axios";

const endpoint = "http://localhost:3000/api/v1/images/";

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

describe("GET to /images", () => {
  beforeAll(async () => {
    await fs.rm(UPLOAD_DIR, {
      recursive: true,
      force: true,
    });
    await fs.mkdir(UPLOAD_DIR);
    await fs.appendFile(
      path.join(UPLOAD_DIR, testFileName.GET),
      "Hello get request",
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
    await fs.rm(UPLOAD_DIR, {
      recursive: true,
      force: true,
    });
    await fs.mkdir(UPLOAD_DIR);
  });

  it("returns status '201'", async () => {
    const res = await postNewImage();

    expect(res.status).toBe(201);
  });

  it(`creates a file with the name '${testFileName.POST}'`, async () => {
    await postNewImage();
    const files = await fs.readdir(UPLOAD_DIR);

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
    },
  );
});
