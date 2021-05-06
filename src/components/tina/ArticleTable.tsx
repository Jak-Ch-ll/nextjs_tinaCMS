import { ArticleTableData } from "../../utils/ArticleDB"
import { useRouter } from "next/router"
import MaterialTable from "material-table"
import { ArticleAPI } from "../../utils/ArticleAPI"
import { useState } from "react"
import { useSession } from "next-auth/client"

export interface ArticleTableProps {
  articles: ArticleTableData[]
}

export const ArticleTable = ({ articles }: ArticleTableProps): JSX.Element => {
  const [session] = useSession()
  const [tableData, setTableData] = useState(articles)

  const router = useRouter()

  const api = new ArticleAPI()

  return (
    <MaterialTable
      title={`Hello ${session ? session.user.name : ""}`}
      columns={[
        { title: "ID", field: "id" },
        { title: "Title", field: "title" },
        { title: "Created at", field: "createdAt" },
        { title: "Updated at", field: "updatedAt" },
        { title: "Published", field: "publishedAt" },
        { title: "URL", field: "url" },
      ]}
      data={tableData}
      actions={[
        {
          position: "row",
          icon: "edit",
          tooltip: "Edit article",
          onClick: (_, rowData) => {
            const data = rowData as ArticleTableData
            router.push(`/tina/${data.url}`)
          },
        },
        {
          position: "row",
          icon: "delete",
          tooltip: "Delete article",
          onClick: async (_, rowData) => {
            const data = rowData as ArticleTableData

            const confirmed = window.confirm(`Delete article '${data.title}'?`)
            if (!confirmed) return

            try {
              await api.delete(data.id)
              setTableData((tableData) =>
                tableData.filter((article) => article.id !== data.id)
              )
            } catch (err) {
              console.log(err)
            }
          },
        },
        {
          position: "toolbar",
          icon: "add",
          tooltip: "New article",
          onClick: () => router.push("/tina/new"),
        },
      ]}
      options={{
        draggable: false,
        actionsColumnIndex: -1,
        filtering: true,
        pageSize: 10,
      }}
    />
  )
}
