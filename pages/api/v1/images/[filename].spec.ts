/**
 * @jest-environment node
 */

import axios, { Method } from "axios";
import fs from "fs/promises";
import path from "path";

import { UPLOAD_DIR } from "../../../../ImageStore/_constants";

const endpoint = "http://localhost:3000/api/v1/images";
const testFileName = "someFile.txt";
const fileContent = "Hello test";

const invalidFileName = "someOtherFile.txt";

const getImage = () => {
  return axios.get(`${endpoint}/${testFileName}`);
};

const getInvalidImage = () => {
  return axios.get(`${endpoint}/${invalidFileName}`, {
    validateStatus: () => true,
  });
};

const deleteImage = () => {
  return axios.delete(`${endpoint}/${testFileName}`);
};

const deleteInvalidImage = () => {
  return axios.delete(`${endpoint}/${invalidFileName}`, {
    validateStatus: () => true,
  });
};

beforeEach(async () => {
  await fs.rm(UPLOAD_DIR, {
    recursive: true,
    force: true,
  });
  await fs.mkdir(UPLOAD_DIR);
  await fs.appendFile(path.join(UPLOAD_DIR, testFileName), fileContent);
});

describe(`GET to /api/images/[filename]`, () => {
  it("returns status 200", async () => {
    const res = await getImage();

    expect(res.status).toBe(200);
  });

  it("returns the correct content of the file", async () => {
    const { data } = await getImage();

    expect(data).toBe(fileContent);
  });

  it("return status 400 on invalid image name", async () => {
    const res = await getInvalidImage();

    expect(res.status).toBe(400);
  });

  it(`Returns status text "No file with name '${invalidFileName}' found"`, async () => {
    const res = await getInvalidImage();

    expect(res.statusText).toBe(`No file with name '${invalidFileName}' found`);
  });
});

describe(`DELETE to /api/images/[filename]`, () => {
  it("returns status 204", async () => {
    const res = await deleteImage();

    expect(res.status).toBe(204);
  });

  it("successfully deletes the file", async () => {
    await deleteImage();

    const file = await fs.readdir(UPLOAD_DIR);

    expect(file).toHaveLength(0);
  });

  it("return status 400 on invalid image name", async () => {
    const res = await deleteInvalidImage();

    expect(res.status).toBe(400);
  });

  it(`Returns status text "No file with name '${invalidFileName}' found"`, async () => {
    const res = await deleteInvalidImage();

    expect(res.statusText).toBe(`No file with name '${invalidFileName}' found`);
  });
});

describe("Other requests to /images/[filename]", () => {
  it.each([["POST"], ["PUT"], ["PATCH"], ["OPTIONS"], ["TRACE"]])(
    "sends back status '405' on method '%s'",
    async (method: any) => {
      const res = await axios(`${endpoint}/${testFileName}`, {
        method,
        validateStatus: () => true,
      });
      expect(res.status).toBe(405);
    },
  );
});
