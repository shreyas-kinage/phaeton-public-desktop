import React from "react";
import styles from "./input.css";

const Input = ({
  className = styles.styledinput,
  type,
  width,
  height,
  placeholder,
  onChange,
  fontSize,
  margin,
  padding,
  value,
  bgColor,
  opacity = 1,
  disabled = false,
  color,
  name,
  border,
  maxLength,
  minLength,
  id,
  required,
  onKeyPress,
}) => (
  <input
    type={type}
    id={id}
    onKeyPress={onKeyPress}
    maxLength={maxLength}
    minLength={minLength}
    style={{
      width,
      height,
      fontSize,
      margin,
      padding,
      backgroundColor: bgColor,
      color,
      opacity,
      border,
    }}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={className}
    required={required}
  />
);

const TextArea = ({
  className = styles.styledinput,
  width,
  rows,
  height,
  id,
  placeholder,
  onChange,
  fontSize,
  margin,
  maxLength,
  name,
  padding,
  bgColor,
  opacity = 1,
  disabled = false,
  color,
  border,
  required,
}) => (
  <textarea
    rows={rows}
    maxLength={maxLength}
    id={id}
    name={name}
    style={{
      resize: "none",
      width,
      height,
      fontSize,
      margin,
      padding,
      backgroundColor: bgColor,
      color,
      opacity,
      border,
    }}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={className}
    required={required}
  />
);

export { Input, TextArea };

export default Input;
