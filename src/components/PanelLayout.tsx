/**
 * This is temporary till we add panel resizing and docking/undocking.
 */
import styles from "./PanelLayout.module.css";

export interface PanelLayoutProps {
  children: React.ReactNode;
}

const PanelLayout = ({ children }: PanelLayoutProps) => {
  return <div className={styles.panelLayout}>{children}</div>;
};

export default PanelLayout;
