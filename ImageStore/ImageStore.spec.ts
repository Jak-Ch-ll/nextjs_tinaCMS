import axios from "axios";
import { ImageStore } from "./ImageStore";
import { API_PATH } from "./_constants";

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
      const medias = await imageStore.persist([
        {
          directory: "/",
          file: testFile,
        },
      ]);

      const formData = new FormData();
      formData.append(testFile.name, testFile);
      console.log(formData);

      expect(mockedAxios.post).toHaveBeenCalledWith(API_PATH, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
  });
});
