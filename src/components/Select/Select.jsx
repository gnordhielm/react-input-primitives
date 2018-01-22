
import BaseInput from '../BaseInput/BaseInput.jsx'
import React from 'react'
import PropTypes from 'prop-types'

import { fuzzyMatch } from 'filters'

class SelectInput extends BaseInput {

	state = {
		text: '',
        displayValue: this.props.value ? this.props.value : '',
		value: null,
		focusedOptionIndex: this.props.value ?
			this.props.options.indexOf(this.props.value) : 0,
		hasFocus: false,
		options: this.props.options
    }

	componentWillReceiveProps({ value, options }) {
		
		const { optionDisplay } = this.props

		this.setState(prevState => {
			const newState = {}
			newState.options = options
				.filter(option =>
					fuzzyMatch(optionDisplay(option), prevState.text))

			if (!this.pendingOnChange &&
				typeof value !== 'undefined'
				&& this.state.value !== value) {
				newState.value = value
				newState.displayValue = optionDisplay(value)
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
				.filter(option =>
					fuzzyMatch(this.props.optionDisplay(option), text))
		}))
	}

	onClear = () => {
		const newValue = ''
		this.setState(() => ({
			displayValue: newValue,
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
			displayValue: this.props.optionDisplay(newValue),
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

	renderDropdown = (options, focusedIndex) =>
		<div
			className="dropdown"
			onFocus={this.onDropdownFocus}
			tabIndex={1}
		>
			{options.map((option, idx) => (
				<div className="option" key={idx} onClick={e => {
					this.handleSelectOption(option)
				}}>
					{this.props.optionDisplay(option)}
				</div>
			))}
		</div>

	renderGroupedDropdown = (options, optionGroup, focusedIndex) => {

		const groupedOptions = {}

		options.forEach(option => {
			const group = optionGroup(option)
			if (groupedOptions[group]) {
				groupedOptions[group].push(option)
			} else {
				groupedOptions[group] = [option]
			}
		})

		const groups = Object.keys(groupedOptions).sort((a, b) => {
			return groupedOptions[a].length - groupedOptions[b].length
		})

		return (
			<div
				className="dropdown"
				onFocus={this.onDropdownFocus}
				tabIndex={1}
			>
				{groups.map(group => (
					<div className="group" key={group}>
						<div className="title">{group}</div>
						{groupedOptions[group].map((option, idx) => (
							<div className="option" key={idx} onClick={e => {
								this.handleSelectOption(option)
							}}>{this.props.optionDisplay(option)}</div>
						))}
					</div>
				))}
			</div>
		)
	}

    render() {
		const { options, focusedOptionIndex } = this.state
		const { optionGroup } = this.props

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
                    value={this.state.text || this.state.displayValue || ''}
                />
                {!this.state.hasFocus && this.renderIcon()}
                {this.state.hasFocus ? this.props.optionGroup ?
					 this.renderGroupedDropdown(
						 options, optionGroup, focusedOptionIndex
					 ) :
					 this.renderDropdown(
						 options, focusedOptionIndex
					 ) : null
				 }
            </div>

        )
    }
}

SelectInput.defaultProps = {
	...BaseInput.defaultProps,
	icon: 'dropdown',
	options: [],
	optionDisplay: _ => _
}

SelectInput.propTypes = {
	...BaseInput.propTypes,
	value: PropTypes.oneOfType([
        PropTypes.string,
		PropTypes.object
    ]),
	optionGroup: PropTypes.func
}

export default SelectInput
