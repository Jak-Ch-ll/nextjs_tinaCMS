import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import prisma from "../../../../prisma/prisma";

const getId = (req: NextApiRequest) => {
  return parseInt(req.query.id as string);
};

const handler = nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const id = parseInt(req.query.id as string);
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) res.writeHead(400, `Article with id ${id} not found`).end();
    return res.status(200).send(article);
  })

  .patch(async (req, res) => {
    const id = parseInt(req.query.id as string);
    if (!req.body) return res.writeHead(400, "Request is missing a body").end();
    const data = JSON.parse(req.body);
    try {
      const article = await prisma.article.update({
        where: {
          id,
        },
        data,
      });
      return res.status(200).send(article);
    } catch (err) {
      if (err.code === "P2025")
        res.writeHead(400, `Article with id ${id} not found`).end();
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
