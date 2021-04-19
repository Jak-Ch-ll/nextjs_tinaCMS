import axios from "axios";
import { API_ARTICLE_ENDPOINT_INTERNAL } from "../_constants";

const ax = axios.create({
  baseURL: API_ARTICLE_ENDPOINT_INTERNAL,
});

interface ArticleAPIInterface {
  delete: (id: number) => Promise<void>;
}

export class ArticleAPi implements ArticleAPIInterface {
  async delete(id: number) {
    try {
      await ax.delete(`/${id}`);
    } catch (err) {
      return err;
    }
  }
}
