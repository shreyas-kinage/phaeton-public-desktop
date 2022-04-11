import React from "react";
import styles from "./button.css";

const DarkButton = ({
  style,
  content,
  width,
  height,
  onClick,
  type,
  fontSize,
  padding,
  margin,
  bgColor,
  opacity = 1,
  startIcon,
  disabled = false,
  color,
  border,
  classes,
  ...props
}) => (
  <button
    type={type}
    style={style}
    onClick={onClick}
    disabled={disabled}
    className={`${styles.darkbutton} ${classes} btn`}
    {...props}
  >
    {startIcon ? <i className={startIcon} /> : ""}
    {content}
  </button>
);

const ColouredButton = ({
  style,
  content,
  width,
  type,
  height,
  onClick,
  fontSize,
  padding,
  margin,
  classes,
  backgroundColor,
  opacity = 1,
  disabled = false,
  color,
  title,
  startIcon,
  border,
  borderRadius,
  onMouseEnter,
  onMouseLeave,
  dataToggle, 
  dataTarget,
  ariaControls,
  ...props
}) => (
  <button
    style={{
      width,
      height,
      fontSize,
      margin,
      padding,
      backgroundColor: backgroundColor,
      color,
      opacity,
      border,
      borderRadius,
    }}
    type={type}
    title={title}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    disabled={disabled}
    className={`${styles.colouredbutton} ${classes} btn`}
    data-toggle={dataToggle}
    data-target={dataTarget}
    aria-controls={ariaControls}
    {...props}
  >
    {startIcon ? <i className={startIcon} /> : ""}
    {content}
  </button>
);

const TransparentButton = ({
  content,
  width,
  height,
  onClick,
  type,
  fontSize,
  padding,
  classes,
  margin,
  opacity = 1,
  disabled = false,
  color,
  border,
  endIcon,
  justify,
  ...props
}) => (
  <button
    endIcon={endIcon}
    type={type}
    style={{
      width,
      height,
      fontSize,
      margin,
      padding,
      color,
      opacity,
      border,
      justify,
    }}
    onClick={onClick}
    disabled={disabled}
    className={`${styles.transparentbutton} ${classes}`}
    {...props}
  >
    {content}
  </button>
);

export { DarkButton, ColouredButton, TransparentButton };
export default ColouredButton;
