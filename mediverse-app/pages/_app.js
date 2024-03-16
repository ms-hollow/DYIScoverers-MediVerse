import '../styles/globals.css'
import Link from 'next/link';
import Image from 'next/image';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} /> {/**renders the pages */}
    </div>
  )
}

export default MyApp