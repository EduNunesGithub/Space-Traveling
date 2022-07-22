import {
	GetStaticProps,
	NextPage
} from "next";
import Head from "next/head";
import Link from "next/link";
import {
	useEffect,
	useState
} from "react";
import {
	FiCalendar,
	FiUser
} from "react-icons/fi";

import {
	Post,					// Interface
	RequestPostPagination,	// Interface
	requestPostPagination	// Função
} from "../lib/API_prismic";

import styles from "../styles/HomeStyles.module.scss";

interface HomeProps {
	posts: RequestPostPagination;
};

interface Response {
	data: RequestPostPagination | null;
};

const Home: NextPage = ({
	posts
}: HomeProps) => {
	const [arrayPosts, setArrayPosts] = useState<Post[]>([]);
	const [nextPage, setNextPage] = useState<string | null>(null);

	useEffect(() => {
		if (posts) {
			if (!sessionStorage.getItem("spacetraveling-home")) {
				setArrayPosts(posts.results);
				setNextPage(posts.next_page);
			} else {
				const session: {
					arrayPosts: Post[],
					nextPage: string
				} = JSON.parse(sessionStorage.getItem("spacetraveling-home"));

				setArrayPosts(session.arrayPosts);
				setNextPage(session.nextPage);
			}
		};
	}, [posts]);

	const loadMorePosts = async () => {
		const response: Response = {
			data: null
		};

		try {
			response.data = await fetch(nextPage).then(response => response.json());
		} catch (error) {
			return;
		};

		setArrayPosts(old => [...old, ...response.data.results]);
		setNextPage(response.data.next_page);

		const session = {
			arrayPosts: [...arrayPosts, ...response.data.results],
			nextPage: response.data.next_page
		};

		sessionStorage.setItem("spacetraveling-home", JSON.stringify(session));
	};

	if (!posts) return null;

	return (
		<>
			<Head>
				<title>spacetraveling | Home</title>
			</Head>

			<main className={styles['home-page']}>
				<section className={styles['links-container']}>
					{arrayPosts.map(({
						data,
						first_publication_date,
						uid
					}) => {
						const {
							author,
							subtitle,
							title
						} = data;

						return (
							<Link
								href={`/post/${uid}`}
								key={uid}
								scroll={false}
							>
								<a className={styles.link}>
									<header className={styles['link-header']}>
										<h2 className={styles.title}>
											{title ?? "..."}
										</h2>
										<p className={styles.subtitle}>
											{subtitle ?? "..."}
										</p>
									</header>

									<p className={styles.metadata}>
										<span>
											<FiCalendar />
											{new Intl.DateTimeFormat("pt-BR", {
												day: "numeric",
												month: "long",
												year: "numeric"
											}).format(new Date(first_publication_date))}
										</span>
										<span>
											<FiUser />
											{author ?? "..."}
										</span>
									</p>
								</a>
							</Link>
						);
					})}

					{nextPage && (
						<button
							className={styles['load-more-posts']}
							onClick={loadMorePosts}
						>
							Carregar mais posts
						</button>
					)}
				</section>
			</main>
		</>
	);
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const data = await requestPostPagination("post", 20);

	return {
		props: {
			posts: data
		},
		revalidate: 60	// 1 minuto
	};
};

export default Home;