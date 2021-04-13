import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { BlogForm } from "../../components/tina/BlogForm";
import { Tina } from "../../components/tina/Tina";
import { redirectOnNoAccess } from "../../utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) return redirectOnNoAccess();

  return {
    props: {},
  };
};

export default function NewBlogpost() {
  return (
    <Tina>
      <BlogForm />
    </Tina>
  );
}
