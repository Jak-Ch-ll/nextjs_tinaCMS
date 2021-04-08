import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import fs from "fs/promises";
import { IncomingForm } from "formidable";
import { IMAGE_UPLOAD_DIR } from "../_constants";

const uploadDir = IMAGE_UPLOAD_DIR;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const imageNames = await fs.readdir(uploadDir);

    return res.json(imageNames);
  })

  .post(async (req, res) => {
    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
    });
    form.on("fileBegin", (_, file) => {
      file.path = `${uploadDir}/${file.name}`;
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
