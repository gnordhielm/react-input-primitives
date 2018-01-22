
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'lodash'
import { defaultDebounce } from 'constants'

class StringInput extends PureComponent {

    state = {
        value: this.props.value || ''
    }

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


    onBlur = event => {
        event.persist()
        this.forceParentOnChange(event)

        const { onBlur } = this.props
        if (onBlur) onBlur(event)
    }

    forceParentOnChange = event => {
        if (!this.pendingOnChange) return
        this.cancel()
        this.props.onChange(event.target.value)
    }

    // Utility

    moveCaretToEnd = evt => {
        evt.persist()
        // const stash = evt.target.value
        // evt.target.value = ''
        // evt.target.value = stash
        const el = evt.target
        el.scrollLeft = el.scrollWidth
        if (typeof el.selectionStart === "number") {
            el.selectionStart = el.selectionEnd = el.value.length
        } else if (typeof el.createTextRange !== "undefined") {
            el.focus()
            var range = el.createTextRange()
            range.collapse(false)
            range.select()
        }
    }

    // Rendering

    renderIcon = () => {
        const { onClear, icon, loading } = this.props
        if (loading) {
            return <i className="icon loading" />
        } else if (this.state.value && onClear) {
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

    render() {

        return (
            <div className={`av string input ${
                this.props.inline ? 'inline' : ''
            }`}>
                {this.renderDisabled(this.props.disabled)}
                <input
                    autoComplete="false"
                    autoFocus={this.props.autoFocus}
                    className="exempt"
                    disabled={this.props.disabled}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.moveCaretToEnd}
                    onKeyDown={this.checkEnterPress}
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

StringInput.propTypes = {
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
    icon: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
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
    * an array of options the user can chose from
    */
    options: PropTypes.array,
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

StringInput.defaultProps = {
    inline: false,
    debounce: false,
    disabled: false,
    icon: '',
    readOnly: false,
    value: ''
}

export default StringInput
