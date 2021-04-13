import { Article } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { BlogForm } from "../../components/tina/BlogForm";
import { Tina } from "../../components/tina/Tina";
import { getArticleToRender, redirectOnNoAccess } from "../../utils";

interface ArticleToRender extends Omit<Article, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

interface ArticlePageProps {
  article: ArticleToRender;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) return redirectOnNoAccess();

  const url = context.params!.url as string;

  try {
    const article = await getArticleToRender({ url });

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
