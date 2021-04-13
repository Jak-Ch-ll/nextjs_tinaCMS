import { Article } from "@prisma/client";
import prisma from "../../prisma/prisma";

const articleToDateString = (article: Article) => {
  return {
    ...article,
    createdAt: article.createdAt.toLocaleDateString(),
    updatedAt: article.updatedAt.toLocaleDateString(),
  };
};

export const getArticleToRender = async ({
  id,
  url,
}: {
  id?: number;
  url?: string;
}) => {
  const article = await prisma.article.findUnique({
    where: {
      id,
      url,
    },
    rejectOnNotFound: true,
  });

  return articleToDateString(article);
};

export const getArticlesToRender = async () => {
  const articles = await prisma.article.findMany();

  return articles.map(articleToDateString);
};

export const redirectOnNoAccess = () => {
  return {
    redirect: {
      destination: "/auth",
      permanent: false,
    },
  };
};
