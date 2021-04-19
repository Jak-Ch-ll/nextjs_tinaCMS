import { Prisma } from "@prisma/client";
import axios from "axios";
import { API_ARTICLE_ENDPOINT_INTERNAL } from "../_constants";

const ax = axios.create({
  baseURL: API_ARTICLE_ENDPOINT_INTERNAL,
});

export interface NewArticle
  extends Omit<Prisma.ArticleCreateInput, "id" | "createdAt" | "updatedAt"> {}

export type UpdateArticle = Partial<NewArticle>;

interface ArticleAPIInterface {
  post: (article: NewArticle) => Promise<void>;
  patch: (id: number, article: UpdateArticle) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

export class ArticleAPI implements ArticleAPIInterface {
  public async post(data: NewArticle) {
    try {
      await ax.post("/", data);
    } catch (err) {
      console.log(err);
    }
  }

  public async patch(id: number, data: UpdateArticle) {
    try {
      await ax.patch(`/${id}`, data);
    } catch (err) {
      console.log(err);
    }
  }

  public async delete(id: number) {
    try {
      await ax.delete(`/${id}`);
    } catch (err) {
      console.log(err);
    }
  }
}
