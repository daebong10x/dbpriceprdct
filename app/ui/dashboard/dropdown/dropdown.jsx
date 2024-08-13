import React from 'react';
import styles from './dropdown.module.css';

const Dropdown = ({ options, value, onChange }) => {
  return (
    <select className={styles.dropdown} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
