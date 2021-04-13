import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { NextHandler } from "next-connect";

export const validateSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const session = await getSession({ req });
  if (session) return next();

  res.status(401).end();
};
