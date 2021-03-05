// from https://dev.to/noclat/build-a-full-api-with-next-js-1ke

import { createServer } from "http";
import { apiResolver } from "next/dist/next-server/server/api-utils";
import request from "supertest";

export const testClient = (handler) =>
  request(
    createServer(async (req, res) => {
      return apiResolver(req, res, undefined, handler);
    }),
  );
