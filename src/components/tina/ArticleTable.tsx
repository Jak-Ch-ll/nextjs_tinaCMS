import { ArticleTableData } from "../../utils/ArticleDB"
import { useRouter } from "next/router"
import MaterialTable from "material-table"
import { ArticleAPI } from "../../utils/ArticleAPI"
import { useState } from "react"
import { useSession } from "next-auth/client"
import { signOut } from "next-auth/client"

export interface ArticleTableProps {
  articles: ArticleTableData[]
}

export const ArticleTable = ({ articles }: ArticleTableProps): JSX.Element => {
  const [session] = useSession()
  const [tableData, setTableData] = useState(articles)
  const [showFilter, setShowFilter] = useState(false)

  const router = useRouter()

  const api = new ArticleAPI()

  return (
    <MaterialTable
      title={`Hello ${session ? session.user?.name : ""}`}
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
              console.log("logged error:", err)
            }
          },
        },
        {
          position: "toolbar",
          icon: "filter_list",
          tooltip: "Filter",
          onClick: () => setShowFilter((showFilter) => !showFilter),
        },
        {
          position: "toolbar",
          icon: "add",
          tooltip: "New article",
          onClick: () => router.push("/tina/new"),
        },

        {
          position: "toolbar",
          icon: "logout",
          tooltip: "Logout",
          onClick: () => {
            const confirm = window.confirm("Are you sure, you want to log out?")
            if (confirm) signOut({ callbackUrl: `/` })
          },
        },
      ]}
      options={{
        draggable: false,
        actionsColumnIndex: -1,
        filtering: showFilter,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50],
      }}
    />
  )
}
