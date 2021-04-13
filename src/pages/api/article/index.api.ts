import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import prisma from "../../../../prisma/prisma";
import { validateSession } from "../../../utils/api";

export default nc<NextApiRequest, NextApiResponse>()
  .use(validateSession)
  .get(async (req, res) => {
    const articles = await prisma.article.findMany();

    return res.status(200).json(articles);
  })

  .post(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.writeHead(400, "Request is missing a body").end();
    }
    try {
      const newArticle = await prisma.article.create({
        data: req.body,
      });
      return res
        .writeHead(201, {
          location: `/${newArticle.url}`,
        })
        .end();
    } catch (err) {
      switch (err.code) {
        case "P2002": // at the moment, only if url is already in use
          return res
            .writeHead(
              400,
              `${err.meta.target[0].toUpperCase()} already in use.`
            )
            .end();
        default:
          return res.writeHead(
            500,
            "Something went wrong, please try again later."
          );
      }
    }
  })

  .all((req, res) => {
    return res.status(405).end();
  });
