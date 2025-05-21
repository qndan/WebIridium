import styles from "./PropertyList.module.css";

export interface PropertyListProps {
  children: React.ReactNode;
}

const PropertyList = ({ children }: PropertyListProps) => {
  return <div className={styles.propertyList}>{children}</div>;
};

export default PropertyList;
