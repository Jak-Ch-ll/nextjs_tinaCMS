import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import fs from "fs/promises";
import { IMAGE_UPLOAD_DIR } from "../../../_constants";
import { validateSession } from "../../../utils/api";

const uploadDir = IMAGE_UPLOAD_DIR;

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const { filename } = req.query;
    try {
      const buffer = await fs.readFile(`${uploadDir}/${filename}`);
      const img = buffer;
      return res
        .writeHead(200, {
          "Transfer-Encoding": "chunked",
          "Content-Type": "image/jpeg",
        })
        .end(img);
    } catch {
      return res.writeHead(400, `No file with name '${filename}' found`).end();
    }
  })

  .delete(validateSession, async (req, res) => {
    const { filename } = req.query;
    try {
      await fs.rm(`${uploadDir}/${filename}`);
      return res.status(204).end();
    } catch {
      return res.writeHead(400, `No file with name '${filename}' found`).end();
    }
  })

  .all(validateSession, (req, res) => {
    return res.status(405).end();
  });
