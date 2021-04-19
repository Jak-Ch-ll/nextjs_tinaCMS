import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { BlogForm } from "../../components/tina/BlogForm";
import { Tina } from "../../components/tina/Tina";
import { getArticleToRender, redirectOnNoAccess } from "../../utils";
import {
  ArticleDB,
  ArticleFormData,
  ArticleRenderData,
} from "../../utils/ArticleDB";

interface ArticlePageProps {
  article: ArticleFormData;
}

const db = new ArticleDB();

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) return redirectOnNoAccess();

  const url = context.params!.url as string;

  try {
    const article = await db.getArticleFormData(url);

    return {
      props: {
        article,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function ArticleEditPage({ article }: ArticlePageProps) {
  return (
    <Tina>
      <BlogForm article={article} />
    </Tina>
  );
}
