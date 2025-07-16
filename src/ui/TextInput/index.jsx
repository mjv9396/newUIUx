import { useState, useEffect, useRef } from "react";
import styles from "./TextInput.module.css";

const ExpandableFilterInput = ({
  label,
  value = "",
  onChange,
  name,
  type = "text",
  placeholder = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClick = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      setIsExpanded(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  let labelClass = styles.label;
  if (isHovered) labelClass += " " + styles.labelHover;

  let inputClass = styles.input;
  if (isFocused) inputClass += " " + styles.inputFocus;

  return (
    <div className={styles.container}>
      {!isExpanded ? (
        <div
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={labelClass}
        >
          {label}
        </div>
      ) : (
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder || label}
          className={inputClass}
        />
      )}
    </div>
  );
};

export default ExpandableFilterInput;
