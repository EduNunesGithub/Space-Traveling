import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./HeaderStyles.module.scss";

import logo from "../../../public/images/logo.png";

export const Header = () => {
    const router = useRouter();

    return (
        <header className={styles['header-component']}>
            <div
                className={`${styles['header-content']} ${router.pathname === "/" && styles['header-content-home']
                    }`}
            >
                <Link
                    href="/"
                    scroll={false}
                >
                    <a className={styles['logo-link']}>
                        <Image
                            alt="Voltar para home"
                            layout="fill"
                            objectFit="contain"
                            priority
                            src={logo}
                        />
                    </a>
                </Link>
            </div>
        </header>
    );
};