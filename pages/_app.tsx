import '../components/App.scss'

export default function MyApp(props: { Component: any; pageProps: any }) {
  let { Component, pageProps } = props
  return <Component {...pageProps} />
}
