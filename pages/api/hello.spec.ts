// import request from "supertest";
import hello from "./hello";
import { testClient } from "../../jest/testClient";

describe("Hello API", () => {
  it("returns 200 OK on request", async () => {
    const request = testClient(hello);
    const res = await request.get("/api/hello");
    expect(res.status).toBe(200);
  });
});
