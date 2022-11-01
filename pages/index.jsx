import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from './sections/Hero'
import Book from './sections/Book'
import Image from 'next/image'
import styles from 'styles/index.scss'

const Home{ Component, pageProps } {
	return (
		<div className="app-wrapper">
			<Navbar />
			<Hero />
			<Book />
			<Footer />
		</div>
	);
}

export default Home