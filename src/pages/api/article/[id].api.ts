import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import prisma from "../../../../prisma/prisma";
import { validateSession } from "../../../utils/api";

const getId = (req: NextApiRequest) => {
  return parseInt(req.query.id as string);
};

const handler = nc<NextApiRequest, NextApiResponse>()
  .use(validateSession)
  .get(async (req, res) => {
    const id = parseInt(req.query.id as string);
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article)
      return res.writeHead(400, `Article with id ${id} not found`).end();
    return res.status(200).send(article);
  })

  .patch(async (req, res) => {
    const id = parseInt(req.query.id as string);
    if (!req.body) return res.writeHead(400, "Request is missing a body").end();
    try {
      const article = await prisma.article.update({
        where: {
          id,
        },
        data: req.body,
      });
      return res.status(200).send(article);
    } catch (err) {
      switch (err.code) {
        case "P2025":
          return res.writeHead(400, `Article with id ${id} not found`).end();
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

  .delete(async (req, res) => {
    const id = getId(req);

    try {
      const article = await prisma.article.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (err) {
      if (err.code === "P2025")
        res.writeHead(400, `Article with id ${id} not found`).end();
    }
  })

  .all((req, res) => {
    return res.status(405).end();
  });

export default handler;
