import styles from "./PropertyList.module.css";

export interface StringPropertyProps {
  name: string;
  value: string;
  onChange: (newValue: string) => void;
}

const StringProperty = ({ name, value, onChange }: StringPropertyProps) => {
  return (
    <div className={styles.property}>
      <label htmlFor={name} className={styles.propertyName}>
        {name}
      </label>

      <input
        id={name}
        className={styles.propertyInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default StringProperty;
