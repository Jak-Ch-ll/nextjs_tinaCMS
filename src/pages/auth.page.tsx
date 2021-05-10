import { signIn, signOut, useSession } from "next-auth/client"

import LinkTo from "../components/LinkTo"

import styles from "./auth.module.scss"

const IndexPage = () => {
  const [session, loading] = useSession()

  const renderBody = () => {
    if (loading) return <div>Loading ...</div>
    if (session) {
      return (
        <>
          <div>Hello {session.user?.name}, what do you want to do today?</div>
          <LinkTo className={styles.button} href="/tina/new">
            Create a new article
          </LinkTo>
          <LinkTo className={styles.button} href="/tina">
            Go to article overview
          </LinkTo>
          <button className={styles.button} onClick={() => signOut()}>
            Sign Out
          </button>
        </>
      )
    }
    return (
      <>
        <div>Please sign in to continue:</div>
        <button
          className={styles.button}
          onClick={() =>
            signIn("email", {
              callbackUrl: "/tina",
            })
          }
        >
          Sign In
        </button>
      </>
    )
  }
  return (
    <>
      <main className={styles.page}>{renderBody()}</main>
    </>
  )
}

export default IndexPage
