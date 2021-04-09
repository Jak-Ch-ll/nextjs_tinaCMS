import { Article } from "@prisma/client";
import { GetServerSideProps } from "next";
import { BlogForm } from "../../components/tina/BlogForm";
import { Tina } from "../../components/tina/Tina";
import { getArticleToRender } from "../../utils";

interface ArticleToRender extends Omit<Article, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

interface ArticlePageProps {
  article: ArticleToRender;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const url = params!.url as string;

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
