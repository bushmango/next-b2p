import Router from 'next/router'
export const navTo = (href: string) => {
  if (Router.pathname !== href) {
    Router.push(href)
  }
}
