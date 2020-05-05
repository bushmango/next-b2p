import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import classes from './Input.module.scss'

export type InputType = 'text' | 'password' | 'email'

export type InputAutocompleteType =
  | 'name'
  | 'email'
  | 'new-password'
  | 'current-password'
  | 'off'
  | 'username'

let timeoutId = 0
const setupDebounce = (cb: any, delay: number = 1000) => {
  clearDebounce()
  timeoutId = setTimeout(cb, delay) as any
}
const clearDebounce = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}

export const Input = forwardRef(
  (
    props: {
      ref?: any
      value?: string
      onChange?: (newVal: string) => void
      onChangeImmediate?: (newVal: string) => void
      onFocus?: (ref: any) => void
      onBlur?: (ref: any) => void
      onEnter?: (newVal: string) => void
      onKeyDown?: (
        event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => void
      width?: string
      className?: string
      name?: string
      testId?: string
      placeholder?: string
      maxLength?: number
      autofocus?: boolean
      readOnly?: boolean
      borderless?: boolean
      inputType?: InputType
      autoComplete?: InputAutocompleteType
      multiline?: boolean
      notResizable?: boolean
      label?: React.ReactNode
    },
    ref?: any,
  ) => {
    let [isFocused, setIsFocused] = React.useState(false)
    let [focusedText, setFocusedText] = React.useState(props.value)

    const onFocus = () => {
      setIsFocused(true)
      setFocusedText(props.value)
      if (props.onFocus) {
        props.onFocus(refTextArea.current)
      }
    }
    const onBlur = () => {
      setIsFocused(false)
      clearDebounce()
      if (props.onBlur) {
        props.onBlur(refTextArea.current)
      }
      if (props.onChange) {
        if (focusedText && focusedText !== props.value) {
          props.onChange(focusedText)
        }
      }
    }

    const onChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      let newVal = event.target.value
      if (props.onChangeImmediate) {
        props.onChangeImmediate(newVal)
      }
      setFocusedText(newVal)
      setupDebounce(() => {
        if (props.onChange && props.value !== newVal) {
          props.onChange(newVal)
        }
      })
    }
    const defaultOnKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (event.keyCode === 13) {
        if (props.onEnter) {
          props.onEnter(focusedText || '')
        }
      }
    }

    const onKeyDown = props.onKeyDown || defaultOnKeyDown

    let refTextArea = React.createRef<HTMLTextAreaElement>()
    let refInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (props.autofocus) {
        // Timing issue, this needs to be run on the next frame
        setTimeout(() => {
          if (refInput.current) {
            refInput.current.focus()
          }
        }, 60 / 1000) // 1/60th of a second
      }
    }, [props.autofocus, refInput])

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (refInput.current) {
          refInput.current.focus()
        }
        if (refTextArea.current) {
          refTextArea.current.focus()
        }
      },
      blur: () => {
        if (refInput.current) {
          refInput.current.blur()
        }
        if (refTextArea.current) {
          refTextArea.current.blur()
        }
      },
      setSelectionRange: (start: number, end: number) => {
        if (refInput.current) {
          refInput.current.setSelectionRange(start, end)
        }
        if (refTextArea.current) {
          refTextArea.current.setSelectionRange(start, end)
        }
      },
    }))

    let className = classes.inputText
    // if (!props.multiline) {
    //   className += ' ' + classes.singleLine
    // }
    if (props.readOnly) {
      className += ' ' + classes.readOnly
    }
    if (props.borderless) {
      className += ' ' + classes.borderless
    }
    if (props.notResizable) {
      className += ' ' + classes.notResizable
    }

    let { autoComplete: autocomplete } = props
    if (autocomplete === 'off' || !autocomplete) {
      autocomplete = ('' + Math.random()) as any
    }

    if (props.multiline) {
      return (
        <div>
          <textarea
            ref={refTextArea}
            className={className}
            onChange={onChange}
            value={isFocused ? focusedText : props.value || ''}
            style={{
              width: props.width,
              minWidth: props.width,
            }}
            name={props.name}
            data-testid={props.testId}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            readOnly={props.readOnly}
            rows={8}
            autoComplete={autocomplete}
          />
        </div>
      )
    }

    return (
      <div>
        <label>{props.label}</label>
        <input
          ref={refInput}
          className={className}
          type={props.inputType || 'text'}
          onChange={onChange}
          value={isFocused ? focusedText : props.value || ''}
          style={{
            width: props.width,
            minWidth: props.width,
          }}
          name={props.name}
          data-testid={props.testId}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          readOnly={props.readOnly}
          autoComplete={autocomplete}
        />
      </div>
    )
  },
)
