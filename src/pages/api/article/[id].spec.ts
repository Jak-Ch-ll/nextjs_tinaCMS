/**
 * @jest-environment node
 */

import { NewArticle } from "../_types";
import prisma from "../../../../prisma/prisma";
import { API_ARTICLE_ENDPOINT } from "../_constants";
import fetch from "node-fetch";
import axios from "axios";

const validArticle: NewArticle = {
  title: "This is a title",
  teaser: "This is the preview text",
  content: "This is some content",
  url: "this-is-the-url",
  img: "image.jpg",
};

const endpoint = API_ARTICLE_ENDPOINT + "/";

beforeEach(async () => {
  await prisma.article.deleteMany();
});

afterEach(() => {
  prisma.$disconnect();
});

describe("/api/articles/[id]", () => {
  describe("GET", () => {
    it("returns '200' on valid request", async () => {
      const newArticle = await prisma.article.create({
        data: validArticle,
      });

      const res = await axios(endpoint + newArticle.id);
      expect(res.status).toBe(200);
    });

    it("returns article with corret ID on GET request", async () => {
      const newArticle = await prisma.article.create({
        data: validArticle,
      });

      const res = await axios(endpoint + newArticle.id);
      expect(res.data.id).toBe(newArticle.id);
    });
  });

  describe("PATCH", () => {
    it("returns '200' on PATCH request to valid /article/:id", async () => {
      const newArticle = await prisma.article.create({
        data: validArticle,
      });

      const data = {
        title: "A new title",
      };

      const res = await axios.patch(endpoint + newArticle.id, data);
      expect(res.status).toBe(200);
    });

    it("updates the given ressource correctly on PATCH request", async () => {
      const articleBefore = await prisma.article.create({
        data: validArticle,
      });

      const titleAfter = articleBefore.title + "???";

      const data = {
        title: titleAfter,
      };
      await axios.patch(endpoint + articleBefore.id, data);

      const articleAfter = await prisma.article.findUnique({
        where: {
          id: articleBefore.id,
        },
        rejectOnNotFound: true,
      });
      expect(articleAfter.title).toBe(titleAfter);
    });

    it("sends back the updated ressource on PATCH request", async () => {
      const articleBefore = await prisma.article.create({
        data: validArticle,
      });

      const titleAfter = articleBefore.title + "???";

      const data = {
        title: titleAfter,
      };
      const res = await axios.patch(endpoint + articleBefore.id, data);

      expect(res.data.title).toBe(titleAfter);
    });

    it("returns status '400' on PATCH request to invalid id", async () => {
      const data = { title: "Some title" };

      const res = await axios.patch(endpoint + "1", data, {
        validateStatus: () => true,
      });

      expect(res.status).toBe(400);
    });

    it("returns message 'Article with id 1 not found' on invalid id", async () => {
      const data = { title: "Some title" };

      const res = await axios.patch(endpoint + "1", data, {
        validateStatus: () => true,
      });

      expect(res.statusText).toBe("Article with id 1 not found");
    });

    it("returns status '400' and message 'Request is missing a body' on PATCH request without body", async () => {
      const res = await fetch(endpoint + "1", {
        method: "PATCH",
      });

      expect(res.status).toBe(400);
      expect(res.statusText).toBe("Request is missing a body");
    });
  });

  describe("DELETE", () => {
    it("returns '204' on valid request", async () => {
      const article = await prisma.article.create({
        data: validArticle,
      });

      const res = await axios.delete(endpoint + article.id);

      expect(res.status).toBe(204);
    });

    it("deletes the ressource on valid request", async () => {
      const article = await prisma.article.create({
        data: validArticle,
      });

      const res = await axios.delete(endpoint + article.id);

      const articles = await prisma.article.findMany();

      expect(articles.length).toBe(0);
    });
  });

  describe("General requests", () => {
    it.each([["POST"], ["PUT"], ["OPTIONS"], ["TRACE"]])(
      "sends back status '405' on method '%s'",
      async (method: any) => {
        const res = await axios(endpoint + "1", {
          method,
          validateStatus: () => true,
        });
        expect(res.status).toBe(405);
      }
    );

    it.each([["GET"], ["DELETE"]])(
      "returns status '400' and message 'Article with id 1 not found' on %s request to invalid id",
      async (method: any) => {
        const res = await axios(endpoint + "1", {
          method,
          validateStatus: () => true,
        });

        expect(res.status).toBe(400);

        expect(res.statusText).toBe("Article with id 1 not found");
      }
    );
  });
});
