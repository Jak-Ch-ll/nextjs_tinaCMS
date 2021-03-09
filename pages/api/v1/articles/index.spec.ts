import fetch from "node-fetch";
import { NewArticle } from ".";
import prisma from "../../../../prisma/prisma";

const validArticle: NewArticle = {
  title: "This is a title",
  previewText: "This is the preview text",
  content: "This is some content",
  url: "this-is-the-url",
};

const endpoint = "http://localhost:3000/api/v1/articles/";

const postNewArticle = async (article = validArticle) => {
  const body = JSON.stringify(article);
  return await fetch(endpoint, {
    method: "POST",
    body,
  });
};

const getAllArticles = async () => {
  return await fetch(endpoint);
};

beforeEach(async () => {
  await prisma.article.deleteMany();
});

describe("GET request to /api/articles", () => {
  it("returns '200' on GET request to /articles", async () => {
    const res = await getAllArticles();

    expect(res.status).toBe(200);
  });

  it("returns all articles in the databse on GET request", async () => {
    const dbArticle = await prisma.article.create({
      data: validArticle,
    });

    const res = await getAllArticles();
    const articles = await res.json();
    expect(articles[0].id).toBe(dbArticle.id);
  });
});

describe("POST request to /api/articles", () => {
  it("returns '201 Created' on valid request", async () => {
    const res = await postNewArticle();
    expect(res.status).toBe(201);
  });

  it("saves new article to database", async () => {
    await postNewArticle();
    const articles = await prisma.article.findMany();
    expect(articles.length).toBe(1);
  });

  it("returns back the correct url in header-location", async () => {
    const res = await postNewArticle();
    const dbArticle = await prisma.article.findFirst({
      rejectOnNotFound: true,
    });

    const url = res.headers.get("location");
    expect(url).toBe("/" + dbArticle.url);
  });

  it("returns status '400' and message 'Request is missing a body' on missing body", async () => {
    const res = await fetch(endpoint, {
      method: "POST",
    });

    expect(res.status).toBe(400);
    expect(res.statusText).toBe("Request is missing a body");
  });

  it.todo("sends error 'Not a valid URL format' on invalid URL");
});

describe("Other requests to /api/articles", () => {
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
