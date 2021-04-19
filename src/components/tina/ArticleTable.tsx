import { ArticleData } from "../../utils/ArticleDB";
import { useRouter } from "next/router";
import MaterialTable, { Action } from "material-table";
import { ArticleAPi } from "../../utils/ArticleAPI";
import { useState } from "react";

export interface ArticleTableProps {
  articles: ArticleData[];
}

export const ArticleTable = ({ articles }: ArticleTableProps): JSX.Element => {
  const [tableData, setTableData] = useState(articles);

  const router = useRouter();

  const api = new ArticleAPi();

  return (
    <MaterialTable
      columns={[
        { title: "ID", field: "id" },
        { title: "Title", field: "title" },
        { title: "Created at", field: "createdAt" },
        { title: "Updated at", field: "updatedAt" },
        { title: "Published", field: "published" },
        { title: "URL", field: "url" },
      ]}
      data={tableData}
      actions={[
        {
          position: "row",
          icon: "edit",
          tooltip: "Edit article",
          onClick: (_, rowData) => {
            const data = rowData as ArticleData;
            router.push(`/tina/${data.url}`);
          },
        },
        {
          position: "row",
          icon: "delete",
          tooltip: "Delete article",
          onClick: async (_, rowData) => {
            const data = rowData as ArticleData;
            try {
              await api.delete(data.id);
              setTableData((tableData) =>
                tableData.filter((article) => article.id !== data.id)
              );
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]}
      options={{
        draggable: false,
        actionsColumnIndex: -1,
        filtering: true,
      }}
    />
  );
};
