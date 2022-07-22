import type { AppProps } from 'next/app';

import { Header } from '../components/Header/Header';

import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div className='page-container'>
			<Header />

			<Component {...pageProps} />
		</div>
	);
};

export default MyApp;