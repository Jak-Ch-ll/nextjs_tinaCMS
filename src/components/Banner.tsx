import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import styles from "./Banner.module.scss";
import LinkTo from "./LinkTo";

export function Banner() {
  const router = useRouter();
  const [session] = useSession();

  const navTargets = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/tina",
      text: "Tina",
      needsLogin: true,
    },
    {
      url: "/tina/new",
      text: "New",
      needsLogin: true,
    },
    {
      url: "/auth",
      text: session ? "Logout" : "Login",
    },
  ];

  const renderedLinks = navTargets.map((target) => {
    if (target.needsLogin && !session) return null;

    return (
      <li key={target.url}>
        <LinkTo
          href={target.url}
          {...(target.url === router.pathname && {
            className: styles.active,
          })}
        >
          {target.text}
        </LinkTo>
      </li>
    );
  });

  return (
    <header className={styles.banner}>
      <div className={styles.container}>
        <div>
          <LinkTo className={styles.logo} href="/">
            My Blog
          </LinkTo>
        </div>
        <nav>
          <ul>{renderedLinks}</ul>
        </nav>
      </div>
    </header>
  );
}
