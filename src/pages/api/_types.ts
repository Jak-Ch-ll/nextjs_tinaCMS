import { Prisma } from "@prisma/client";

export type NewArticle = Prisma.ArticleGetPayload<{
  select: {
    title: true;
    teaser: true;
    content: true;
    url: true;
    img: true;
  };
}>;
