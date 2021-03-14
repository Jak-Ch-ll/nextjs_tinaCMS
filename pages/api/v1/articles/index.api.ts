import { Prisma } from "@prisma/client";
import { checkSchema } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler, RequestHandler } from "next-connect";
import prisma from "../../../../prisma/prisma";

export type NewArticle = Prisma.ArticleGetPayload<{
  select: {
    title: true;
    previewText: true;
    content: true;
    url: true;
  };
}>;

const handler = nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const articles = await prisma.article.findMany();

    return res.status(200).json(articles);
  })

  .post(async (req, res) => {
    if (!req.body) return res.writeHead(400, "Request is missing a body").end();
    const data = JSON.parse(req.body);

    const newArticle = await prisma.article.create({
      data,
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

export default handler;
