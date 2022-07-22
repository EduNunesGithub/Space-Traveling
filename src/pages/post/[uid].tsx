import {
    GetStaticPaths,
    GetStaticProps
} from "next";
import Head from "next/head";
import Image from "next/image";
import { asHTML } from "@prismicio/helpers";
import {
    FiCalendar,
    FiClock,
    FiUser
} from "react-icons/fi";

import {
    Post as PostInterface,  // Interface
    requestAllPosts,        //
    requestPost             // Função
} from "../../lib/API_prismic";

import styles from "./PostStyles.module.scss";

interface PostProps {
    postResponse: PostInterface;
};

export default function Post({
    postResponse
}: PostProps) {
    if (!postResponse) {
        return (
            <>
                <Head>
                    <title>spacetraveling | Error</title>
                </Head>

                <span className={styles.error}>
                    Ops... something went wrong
                </span>
            </>
        );
    };

    return (
        <>
            <Head>
                <title>{`spacetraveling | ${postResponse.data.title ?? "..."}`}</title>
            </Head>

            <main className={styles['post-page']}>
                {postResponse.data.banner.url && (
                    <div className={styles.banner}>
                        <Image
                            alt="Post banner"
                            blurDataURL="/images/logo.png"
                            layout="fill"
                            objectFit="cover"
                            placeholder="blur"
                            priority
                            src={postResponse.data.banner.url}
                        />
                    </div>
                )}

                <article className={styles['article-container']}>
                    <header className={styles['article-header']}>
                        <h1 className={styles.title}>
                            {postResponse.data.title ?? "..."}
                        </h1>

                        <p className={styles.metadata}>
                            <span>
                                <FiCalendar />
                                {new Intl.DateTimeFormat("pt-BR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                }).format(new Date(postResponse.first_publication_date))}
                            </span>
                            <span>
                                <FiUser />
                                {postResponse.data.author ?? "..."}
                            </span>
                            <span>
                                <FiClock />
                                4 min
                            </span>
                        </p>
                    </header>

                    {postResponse.data.body.length !== 0 && (
                        <div className={styles['article-text-container']}>
                            {postResponse.data.body.map(({
                                items,
                                primary
                            }, blockIndex) => {
                                return (
                                    <div
                                        className={styles['text-block']}
                                        key={blockIndex}
                                    >
                                        <h2 className={styles.title}>
                                            {primary.heading ?? "..."}
                                        </h2>

                                        <div className={styles['paragraph-container']}>
                                            {items.map(({
                                                paragraph
                                            }, paragraphIndex) => {
                                                if (asHTML(paragraph) === "") return null;

                                                return (
                                                    <div
                                                        className={styles.paragraph}
                                                        dangerouslySetInnerHTML={{ __html: asHTML(paragraph) }}
                                                        key={`${blockIndex} ${paragraphIndex}`}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </article>
            </main>
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const data = await requestAllPosts("post");

    if (!data) return {
        fallback: true,
        paths: [{
            params: {
                uid: "dev"
            }
        }]
    };

    const uidArray = data.map(({ uid }) => {
        return {
            params: {
                uid: uid
            }
        };
    });

    return {
        fallback: true,
        paths: uidArray
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const data = await requestPost("post", `${params.uid}`);

    return {
        props: {
            postResponse: data
        },
        revalidate: 60	// 1 minuto
    };
};