import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import fs from "fs/promises";
import { UPLOAD_DIR } from "../../../../ImageStore/_constants";

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const { filename } = req.query;
    try {
      const buffer = await fs.readFile(`${UPLOAD_DIR}/${filename}`);
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

  .delete(async (req, res) => {
    const { filename } = req.query;
    try {
      await fs.rm(`${UPLOAD_DIR}/${filename}`);
      return res.status(204).end();
    } catch {
      return res.writeHead(400, `No file with name '${filename}' found`).end();
    }
  })

  .all((req, res) => {
    return res.status(405).end();
  });
