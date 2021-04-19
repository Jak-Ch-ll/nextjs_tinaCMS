import { Article, Prisma } from "@prisma/client";

export type ArticleInForm = Omit<Article, "createdAt" | "updatedAt"> & {
  published: boolean;
};

export interface ArticleToRender extends ArticleInForm {
  createdAt: string;
  updatedAt: string;
}

export type NewArticle = Prisma.ArticleCreateInput;
