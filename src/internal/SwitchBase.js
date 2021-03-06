// @flow

import React from 'react';
import type { Node } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '../styles/withStyles';
import IconButton from '../IconButton';
import CheckBoxOutlineBlankIcon from '../svg-icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '../svg-icons/CheckBox';
import Icon from '../Icon';

export const styles = {
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'none',
  },
  input: {
    cursor: 'inherit',
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
  },
  default: {},
  checked: {},
  disabled: {},
};

type ProvidedProps = {
  classes: Object,
  /**
   * @ignore
   */
  theme?: Object,
};

// NB: If changed, please update Checkbox, Switch and Radio
// so that the API documentation is updated.
export type Props = {
  /**
   * Other base element props.
   */
  [otherProp: string]: any,
  /**
   * If `true`, the component is checked.
   */
  checked?: boolean | string,
  /**
   * The icon to display when the component is checked.
   * If a string is provided, it will be used as a font ligature.
   */
  checkedIcon: Node,
  /**
   * @ignore
   */
  children?: Node,
  /**
   * Useful to extend the style applied to components.
   */
  classes?: Object,
  /**
   * @ignore
   */
  className?: string,
  /**
   * @ignore
   */
  defaultChecked?: boolean,
  /**
   * If `true`, the switch will be disabled.
   */
  disabled?: boolean,
  /**
   * If `true`, the ripple effect will be disabled.
   */
  disableRipple: boolean,
  /**
   * The icon to display when the component is unchecked.
   * If a string is provided, it will be used as a font ligature.
   */
  icon: Node,
  /**
   * If `true`, the component appears indeterminate.
   */
  indeterminate?: boolean,
  /**
   * The icon to display when the component is indeterminate.
   * If a string is provided, it will be used as a font ligature.
   */
  indeterminateIcon?: Node,
  /**
   * Properties applied to the `input` element.
   */
  inputProps?: Object,
  /**
   * Use that property to pass a ref callback to the native input component.
   */
  inputRef?: Function,
  /**
   * The input component property `type`.
   */
  inputType: string,
  /*
   * @ignore
   */
  name?: string,
  /**
   * Callback fired when the state is changed.
   *
   * @param {object} event The event source of the callback
   * @param {boolean} checked The `checked` value of the switch
   */
  onChange?: Function,
  /**
   * @ignore
   */
  tabIndex?: number | string,
  /**
   * The value of the component.
   */
  value?: string,
};

type State = {
  checked?: boolean,
};

/**
 * @ignore - internal component.
 */
class SwitchBase extends React.Component<ProvidedProps & Props, State> {
  static defaultProps = {
    checkedIcon: (<CheckBoxIcon />: Node), // defaultCheckedIcon
    disableRipple: false,
    icon: (<CheckBoxOutlineBlankIcon />: Node), // defaultIcon
    inputType: 'checkbox',
  };

  static contextTypes = {
    muiFormControl: PropTypes.object,
  };

  state = {};

  componentWillMount() {
    const { props } = this;

    this.isControlled = props.checked !== undefined;

    if (!this.isControlled) {
      // not controlled, use internal state
      this.setState({
        checked: props.defaultChecked !== undefined ? props.defaultChecked : false,
      });
    }
  }

  input = null;
  button = null;
  isControlled = null;

  handleInputChange = (event: SyntheticInputEvent<*>) => {
    const checked = event.target.checked;

    if (!this.isControlled) {
      this.setState({ checked });
    }

    if (this.props.onChange) {
      this.props.onChange(event, checked);
    }
  };

  render() {
    const {
      checked: checkedProp,
      classes,
      className: classNameProp,
      checkedIcon,
      disabled: disabledProp,
      icon: iconProp,
      inputProps,
      inputRef,
      inputType,
      name,
      onChange,
      tabIndex,
      value,
      ...other
    } = this.props;

    const { muiFormControl } = this.context;
    let disabled = disabledProp;

    if (muiFormControl) {
      if (typeof disabled === 'undefined') {
        disabled = muiFormControl.disabled;
      }
    }

    const checked = this.isControlled ? checkedProp : this.state.checked;
    const className = classNames(classes.root, classes.default, classNameProp, {
      [classes.checked]: checked,
      [classes.disabled]: disabled,
    });

    let icon = checked ? checkedIcon : iconProp;

    if (typeof icon === 'string') {
      icon = <Icon>{icon}</Icon>;
    }

    return (
      <IconButton
        data-mui-test="SwitchBase"
        component="span"
        className={className}
        disabled={disabled}
        tabIndex={null}
        role={undefined}
        rootRef={node => {
          this.button = node;
        }}
        {...other}
      >
        {icon}
        <input
          type={inputType}
          name={name}
          checked={this.isControlled ? checkedProp : undefined}
          onChange={this.handleInputChange}
          className={classes.input}
          disabled={disabled}
          tabIndex={tabIndex}
          value={value}
          {...inputProps}
          ref={node => {
            this.input = node;
            if (inputRef) {
              inputRef(node);
            }
          }}
        />
      </IconButton>
    );
  }
}

export default withStyles(styles, { name: 'MuiSwitchBase' })(SwitchBase);
