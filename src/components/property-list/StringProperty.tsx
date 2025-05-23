import styles from "./PropertyList.module.css";

export interface StringPropertyProps {
  name: string;
  value: string;
  onChange: (newValue: string) => void;
}

const StringProperty = ({ name, value, onChange }: StringPropertyProps) => {
  return (
    <div className={styles.property}>
      <label className={styles.propertyLabel}>
        <span className={styles.propertyName}>{name}</span>
        <input
          className={styles.propertyInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default StringProperty;
