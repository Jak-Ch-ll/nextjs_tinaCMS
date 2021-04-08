import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import fs from "fs/promises";
import { IncomingForm } from "formidable";
import { UPLOAD_DIR } from "../../../../ImageStore/_constants";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const imageNames = await fs.readdir(UPLOAD_DIR);

    return res.json(imageNames);
  })

  .post(async (req, res) => {
    const form = new IncomingForm({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
    });
    form.on("fileBegin", (_, file) => {
      file.path = `${UPLOAD_DIR}/${file.name}`;
      res.writeHead(201, {
        location: `/api/v1/images/${file.name}`,
      });
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).end();
      }
      res.end();
    });
  })

  .all((req, res) => {
    return res.status(405).end();
  });
