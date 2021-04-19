import { toDateString } from ".";
import prisma from "../../prisma/prisma";
import { API_IMAGE_ENDPOINT } from "../_constants";

export interface PreviewArticle {
  id: number;
  title: string;
  date: string; // make it flexible, which data point is actually used for the date
  text: string;
  url: string;
  img: string;
}

export interface ArticleData {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  url: string;
}

export interface ArticleDBInterface {
  getPreviewArticles: () => Promise<PreviewArticle[]>;
  getArticleData: () => Promise<ArticleData[]>;
}

export class ArticleDB implements ArticleDBInterface {
  public async getPreviewArticles() {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        teaser: true,
        url: true,
        img: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return articles.map(({ id, title, createdAt, teaser, url, img }) => ({
      id,
      title,
      date: toDateString(createdAt),
      text: teaser,
      url,
      img: img ? `${API_IMAGE_ENDPOINT}/${img}` : "/img/placeholder.jpg",
    }));
  }

  public async getArticleData() {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        published: true,
        url: true,
      },
    });

    return articles.map((article) => ({
      ...article,
      createdAt: toDateString(article.createdAt),
      updatedAt: toDateString(article.updatedAt),
    }));
  }
}
