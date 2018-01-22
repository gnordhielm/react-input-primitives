
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { debounce, defer, isEmpty } from 'lodash'
import { defaultDebounce } from 'constants'
import { uuid } from 'filters'

class BaseInput extends PureComponent {

    state = {
        value: this.props.value || ''
    }

    getInputRef = el => { this.inputEl = el }

    pendingOnChange = false

    debounceBy = !this.props.debounce ?
        0 : typeof this.props.debounce === 'number' ?
        this.props.debounce : defaultDebounce

    parentOnChange = debounce(value => {
        this.pendingOnChange = false
        this.props.onChange(value)
    }, this.debounceBy)

    triggerParentOnChange = value => {
        this.pendingOnChange = true
        this.parentOnChange(value)
    }

    flush = () => this.parentOnChange.flush()

    cancel = () => {
        this.pendingOnChange = false
        this.parentOnChange.cancel()
    }

    componentWillReceiveProps({ value }) {

        if (this.pendingOnChange) return
        if (typeof value !== 'undefined' && this.state.value !== value) {
            this.setState(() => ({ value }))
        }

    }

    componentWillUnmount() { this.flush() }

    onChange = event => {
        event.persist()

        const newValue = event.target.value
        this.setState(() => ({ value: newValue }), () => {
            this.triggerParentOnChange(newValue)
        })
    }

    onClear = () => {
        const newValue = ''
        this.setState(() => ({ value: newValue }), () => {
            this.flush()
            if (this.props.onClear) {
                this.props.onClear(newValue)
            } else {
                this.triggerParentOnChange(newValue)
            }
        })
    }


    checkEnterPress = event => {
        event.persist()

        if (event.key === 'Enter') {
            this.forceParentOnChange(event)
            const { onEnter } = this.props
            if (onEnter) onEnter(event)
        }
    }


    onBlur = evt => {
        const persistedEvent = evt
        this.forceParentOnChange(persistedEvent)

        const { onBlur } = this.props
        if (onBlur) onBlur(persistedEvent)
    }

    forceParentOnChange = evt => {
        if (!this.pendingOnChange) return
        this.cancel()
        this.props.onChange(evt.target.value)
    }

    // User event handling

    onKeyDown = evt => {
        const key = evt.key
        evt.stopPropagation()
        if (key !== 'Tab') evt.preventDefault()

        switch (key) {
            case 'ArrowUp':
                break
            case 'ArrowLeft':
                break
            case 'ArrowDown':
                break
            case 'ArrowRight':
                break
            case ' ':
            case 'Enter':
                break
            case 'Escape':
                break
            default:
                break
        }

    }

    // Focus handling

	inputElToken = uuid()

	focusInputEl = () => { this.inputEl.focus() }

	blurInputEl = () => { this.inputEl.blur() }

	onInputFocus = e => {
		this.setState(() => ({ hasFocus: true }))
	}

	onInputBlur = e => {
		const event = e
		event.preventDefault()
		event.stopPropagation()
		const { onBlur } = this.props

		// Defer one tick so the function has access to the new focused element
		defer(() => {

			const activeElData = document.activeElement.attributes.data
			const didBlur = !activeElData ||
				activeElData.value !== this.inputElToken

			if (didBlur) {
				this.setState(() => ({
					hasFocus: false ,
					focusedDate: this.props.value || moment(),
				}), () => {
					this.forceParentOnChange(event)
					this.onBlur()
				})
			}
		})
    }

	onDropdownFocus = e => { this.inputEl.focus() }

    // Rendering

    renderIcon = () => {
        const { onClear, icon, loading } = this.props
        if (loading) {
            return <i className="icon loading" />
        } else if (!isEmpty(this.state.value) && onClear) {
            return <i
                className="icon remove av action"
                onClick={this.onClear}
            />
        } else if (icon && typeof icon === 'string') {
            return <i className={`icon ${icon}`} />
        } else if (icon) {
            return <i className="icon search" />
        }
    }

    renderDisabled = disabled => {

        if (!disabled) return

        return (<div className="disabled-overlay">
            {typeof disabled === 'string' &&
                <p>{disabled}</p>}
        </div>)
    }

    renderDropdown = focusedDate => (
        <div
            className="dropdown"
            onFocus={this.onDropdownFocus}
            tabIndex={1}
        >
        </div>
    )

    render() {

        return (
            <div className={`av input ${
                this.props.inline ? 'inline' : ''
            }`}>
                {this.renderDisabled(this.props.disabled)}
                <input
                    autoComplete="false"
                    autoFocus={this.props.autoFocus}
                    className="exempt"
					data={this.inputElToken}
                    disabled={this.props.disabled}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.moveCaretToEnd}
                    onKeyDown={this.onKeyDown}
                    placeholder={this.props.placeholder}
                    spellCheck="false"
                    type="text"
                    value={this.state.value}
                />
                {this.renderIcon()}
            </div>

        )
    }

}

// TO DO - if there is no debounce set, this can be a stateless functional component, implement that

BaseInput.propTypes = {
    /**
    * focus the input as soon as it enters the DOM
    */
    autoFocus: PropTypes.bool,
    /**
    * provides a different set of styles ideal for
    * use within lines of text (formerly called 'compact')
    */
    inline: PropTypes.bool,
    /**
    * when present, delays onChange invocation
    * either by a specified number of milliseconds
    * or the default specified in the constants file
    */
    debounce: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
    ]),
    /**
    * stop the component from receiving user input, when passed a
    * string, that string will be displayed on hover
    */
    disabled: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    /**
    * display the specified icon in the right side of the input
    */
    icon: PropTypes.string,
    /**
    * display a loading animation (overwrites the icon)
    */
    loading: PropTypes.bool,
    /**
    * invoke on input blur
    */
    onBlur: PropTypes.func,
    /**
    * invoke with the new value whenever the value changes
    */
    onChange: PropTypes.func.isRequired,
    /**
    * display a clear button when there is an input value,
    * invoke when it's clicked
    */
    onClear: PropTypes.func,
    /**
    * invoke on enter press
    */
    onEnter: PropTypes.func,
    /**
    * display the plain value without edit capabilities
    */
    readOnly: PropTypes.bool,
    /**
    * text to display when the input value is empty
    */
    placeholder: PropTypes.string,
    /**
    * the value of the input
    */
    value: PropTypes.string.isRequired
}

// TO DO - a bunch of these can easily be made into a parent class.

BaseInput.defaultProps = {
    inline: false,
    debounce: false,
    disabled: false,
    icon: '',
    readOnly: false,
    value: ''
}

export default BaseInput
