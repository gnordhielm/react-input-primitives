
import BaseInput from '../BaseInput/BaseInput.jsx'
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { fuzzyMatch } from 'filters'

class UserInput extends BaseInput {

	state = {
		text: '',
		value: {},
		focusedOptionIndex: this.props.value ?
			this.props.options.indexOf(this.props.value) : 0,
		hasFocus: false,
		options: this.props.options
    }

	componentWillReceiveProps({ value, options }) {

		this.setState(prevState => {
			const newState = {}
			newState.options = options
				.filter(option => fuzzyMatch(option.name, prevState.text))

			if (!this.pendingOnChange &&
				typeof value !== 'undefined'
				&& this.state.value !== value) {
				newState.value = value
			}

			return newState
		})

	}

	// User event handling

	onInputTextChange = evt => {
		const text = evt.target.value
		this.setState(() => ({
			text,
			options: this.props.options
				.filter(option => fuzzyMatch(option.name, text))
		}))
	}

	onClear = () => {
		const newValue = ''
		this.setState(() => ({
			value: newValue,
			text: '',
			options: this.props.options
		}), () => {
			this.flush()
			if (this.props.onClear) {
				this.props.onClear()
			} else {
				this.triggerParentOnChange()
			}
		})
	}

	onKeyDown = evt => {

	}

	handleSelectOption = newValue => {
		this.setState(prevState => ({
			value: newValue,
			text: '',
			options: this.props.options,
			hasFocus: false
		}), () => {
            this.triggerParentOnChange(newValue)
			this.inputEl.blur()
		})
	}

	// Focus handling

	onBlur = evt => {
		const persistedEvent = evt
		this.forceParentOnChange(persistedEvent)

		this.setState(() => ({
			text: '',
			options: this.props.options
		}))

		const { onBlur } = this.props
		if (onBlur) onBlur(persistedEvent)
	}


	// Rendering

    renderIcon = () => {
        const { onClear, icon, loading } = this.props
        if (loading) {
            return <i className="icon loading" />
        } else if (this.state.value.name && onClear) {
            return <i
                className="icon remove av action"
                onClick={this.onClear}
            />
        } else if (icon && typeof icon === 'string') {
            return <i className={`icon ${icon}`} />
        } else if (icon) {
            return <i className="icon user" />
        }
    }

	renderDropdown = (options, focusedIndex) => (
		<div
			className="dropdown"
			onFocus={this.onDropdownFocus}
			tabIndex={1}
		>
			{options.map(option => (
				<div className="option" key={option.id} onClick={e => {
					this.handleSelectOption(option)
				}}>
					{option.name}
				</div>
			))}
		</div>
	)

    render() {
		const { options, focusedOptionIndex } = this.state

		return (
            <div className={`av select input ${
                this.props.inline ? 'inline' : ''
            }`}>
                {this.renderDisabled(this.props.disabled)}
				<input
                    autoComplete="false"
                    autoFocus={this.props.autoFocus}
                    className="exempt"
					data={this.inputElToken}
                    disabled={this.props.disabled}
                    onChange={this.onInputTextChange}
                    onBlur={this.onInputBlur}
                    onFocus={this.onInputFocus}
                    onKeyDown={this.onKeyDown}
                    placeholder={this.props.placeholder}
					ref={this.getInputRef}
                    spellCheck="false"
                    type="text"
                    value={this.state.text || this.state.value.name || ''}
                />
                {!this.state.hasFocus && this.renderIcon()}
                {this.state.hasFocus &&
					 this.renderDropdown(options, focusedOptionIndex)}
            </div>

        )
    }
}

UserInput.defaultProps = {
	...BaseInput.defaultProps,
	icon: 'dropdown',
	options: []
}

UserInput.propTypes = {
	...BaseInput.propTypes,
    /**
    * stop the component from receiving user input, when passed a
    * string, that string will be displayed on hover
    */
    icon: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    /**
    * the value of the input
    */
    value: PropTypes.object.isRequired
}

const mapState = ({ enumerations }) => ({
	options: enumerations.users
})

export default connect(mapState)(UserInput)
