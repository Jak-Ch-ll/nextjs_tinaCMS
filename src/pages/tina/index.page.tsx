import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { getSession, signIn } from "next-auth/client";
import LinkTo from "../../components/LinkTo";
import { ArticleToRender } from "../../_types";
import { getArticlesToRender, redirectOnNoAccess } from "../../utils";
import { API_ARTICLE_ENDPOINT_INTERNAL } from "../../_constants";

interface TinaPageProps {
  articles: ArticleToRender[];
}

export const getServerSideProps: GetServerSideProps<TinaPageProps> = async (
  context
) => {
  const session = await getSession(context);
  if (!session) return redirectOnNoAccess();

  const articles = await getArticlesToRender();

  return {
    props: {
      articles,
    },
  };
};

export default function TinaPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [articles, setArticles] = useState(props.articles);

  const deleteArticle = async (id: number) => {
    try {
      await axios.delete(`${API_ARTICLE_ENDPOINT_INTERNAL}/${id}`);

      setArticles((articles) => {
        return articles.filter((article) => article.id !== id);
      });
    } catch (err) {
      console.log("Error while deleting", err);
    }
  };

  const renderedArticles = articles.map((article) => {
    return (
      <tr key={article.id}>
        <td>{article.id}</td>
        <td>{article.title}</td>
        <td>{article.createdAt}</td>
        <td>{article.updatedAt}</td>
        <td>
          <LinkTo href={`/tina/${article.url}`}>Update</LinkTo>
        </td>
        <td>
          <button onClick={() => deleteArticle(article.id)}>Delete</button>
        </td>
      </tr>
    );
  });

  // const [session, loading] = useSession();

  return (
    <>
      <div>Hello, this is Tina</div>
      <LinkTo href="/tina/new">New Article</LinkTo>
      {/* <div>You are {!loading && !session && "not"} signed in</div> */}
      <button onClick={() => signIn()}>Sign in</button>

      <h2>All articles:</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created</th>
            <th>Last Updated</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{renderedArticles}</tbody>
      </table>
    </>
  );
}
