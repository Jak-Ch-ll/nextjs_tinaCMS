import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import fs from "fs/promises";
import { IncomingForm } from "formidable";
import { IMAGE_UPLOAD_DIR } from "../../../_constants";
import { validateSession } from "../../../utils/api";
import slugify from "slugify";

const uploadDir = IMAGE_UPLOAD_DIR;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default nc<NextApiRequest, NextApiResponse>()
  .use(validateSession)
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
      const name = slugify(file.name!, {
        lower: true,
      });
      file.path = `${uploadDir}/${name}`;
      res.writeHead(201, {
        location: `/api/v1/images/${name}`,
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
