import { useRouter } from "next/router";

import styles from "./Banner.module.scss";
import LinkTo from "./LinkTo";

export function Banner() {
  const router = useRouter();
  const navTargets = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/blog",
      text: "Blog",
    },
    {
      url: "/tina",
      text: "Tina",
    },
    {
      url: "/tina/new",
      text: "New",
    },
  ];

  return (
    <header className={styles.banner}>
      <div className={styles.container}>
        <div>
          <LinkTo className={styles.logo} href="/">
            My Blog
          </LinkTo>
        </div>
        <nav>
          <ul>
            {navTargets.map((target, i) => {
              return (
                <li key={i}>
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
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
