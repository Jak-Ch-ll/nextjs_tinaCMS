import { Article } from "@prisma/client";

export interface ArticleToRender
  extends Omit<Article, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}
