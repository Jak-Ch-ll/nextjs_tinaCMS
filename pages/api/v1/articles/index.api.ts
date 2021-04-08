import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import prisma from "../../../../prisma/prisma";

export type NewArticle = Prisma.ArticleGetPayload<{
  select: {
    title: true;
    teaser: true;
    content: true;
    url: true;
    img: true;
  };
}>;

export const articlesEndpoint = "/api/v1/articles";

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const articles = await prisma.article.findMany();

    return res.status(200).json(articles);
  })

  .post(async (req, res) => {
    if (!req.body) {
      return res.writeHead(400, "Request is missing a body").end();
    }

    const newArticle = await prisma.article.create({
      data: req.body,
    });
    return res
      .writeHead(201, {
        location: `/${newArticle.url}`,
      })
      .end();
  })

  .all((req, res) => {
    return res.status(405).end();
  });
