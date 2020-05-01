import css from './ScreenCenter.module.scss'

export const ScreenCenter = (props: { children: React.ReactNode }) => {
  return <div className={css.screenCenter}>{props.children}</div>
}
