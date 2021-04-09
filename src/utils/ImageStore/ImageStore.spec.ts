import axios from "axios";
import { ImageStore } from "./ImageStore";
import { API_IMAGE_ENDPOINT_INTERNAL } from "../../_constants";

const endpoint = API_IMAGE_ENDPOINT_INTERNAL;

const imageStore = new ImageStore();

const testFile = new File(["Hello world"], "testFile.txt");

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.post.mockResolvedValue({
  status: 200,
});

describe("ImageStore.ts", () => {
  describe(".persist", () => {
    it("makes a POST request containing file data and name", async () => {
      await imageStore.persist([
        {
          directory: "/",
          file: testFile,
        },
      ]);

      const formData = new FormData();
      formData.append(testFile.name, testFile);

      expect(mockedAxios.post).toHaveBeenCalledWith(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
  });
});
