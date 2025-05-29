import { Tabs as RadixTabs } from "radix-ui";
import styles from "./Sidebar.module.css";
import TimeCourseIcon from "@/icons/TimeCourseIcon";
import ParameterScanIcon from "@/icons/ParameterScanIcon";

export type SidebarTab = "TimeCourse" | "ParameterScan";

// eslint-disable-next-line
const sidebarTabIcons: Record<SidebarTab, React.FC> = {
  TimeCourse: TimeCourseIcon,
  ParameterScan: ParameterScanIcon,
} as const;

interface SidebarItemProps {
  tab: SidebarTab;
}

const SidebarItem = ({ tab }: SidebarItemProps) => {
  const TabIcon = sidebarTabIcons[tab];
  return (
    <RadixTabs.Trigger className={styles.trigger} value={tab}>
      <TabIcon />
    </RadixTabs.Trigger>
  );
};

export interface SidebarProps {
  tabs: SidebarTab[];
  currentTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

const Sidebar = ({ tabs, currentTab, onTabChange }: SidebarProps) => {
  return (
    <RadixTabs.Root
      className={styles.root}
      value={currentTab}
      onValueChange={onTabChange as (_: string) => void}
      orientation="vertical"
    >
      <RadixTabs.List className={styles.list}>
        {tabs.map((tab) => (
          <SidebarItem key={tab} tab={tab} />
        ))}
      </RadixTabs.List>
    </RadixTabs.Root>
  );
};

export default Sidebar;
