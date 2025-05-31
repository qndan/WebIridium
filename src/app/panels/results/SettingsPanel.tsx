import { useAtom } from "jotai";
import { graphSettingsAtom } from "@/stores/workspace";
import styles from "./Results.module.css";
import PropertyList from "@/components/property-list/PropertyList";
import PropertyAccordion from "@/components/property-accordion/PropertyAccordion";
import PropertyAccordionItem from "@/components/property-accordion/PropertyAccordionItem";
import PropertyGenerator, {
  type Properties,
} from "@/components/property-list/PropertyGenerator";

// NOTE: Might be a good idea to have more atomic state updates.
//       Right now every single component is updated when one property is updated.
//       Not an issue at the moment...
const SettingsPanel = () => {
  const [graphSettings, setGraphSettings] = useAtom(graphSettingsAtom);

  const setSetting = (name: string, value: unknown) => {
    setGraphSettings({
      ...graphSettings,
      [name]: value,
    });
  };

  return (
    <div className={styles.settingsContainer}>
      <PropertyAccordion defaultValue={["bounds"]}>
        <PropertyAccordionItem title="Bounds" value="bounds">
          <PropertyList>
            <PropertyGenerator
              properties={graphSettings as unknown as Properties}
              setProperty={setSetting}
              names={{
                isAutoscaledX: "Autoscale X",
                isAutoscaledY: "Autoscale Y",
                maxX: "X Maximum",
                minX: "X Minimum",
                maxY: "Y Maximum",
                minY: "Y Minimum",
              }}
              restrictions={[
                {
                  restriction: "range",
                  maxProperty: "maxX",
                  minProperty: "minX",
                },
                {
                  restriction: "range",
                  maxProperty: "maxY",
                  minProperty: "minY",
                },
                {
                  restriction: "disappear",
                  properties: ["maxX", "minX"],
                  toggleProperty: "isAutoscaledX",
                },
                {
                  restriction: "disappear",
                  properties: ["maxY", "minY"],
                  toggleProperty: "isAutoscaledY",
                },
              ]}
            />
          </PropertyList>
        </PropertyAccordionItem>

        <PropertyAccordionItem title="Graph" value="graph">
          <PropertyList>
            <PropertyGenerator
              properties={graphSettings as unknown as Properties}
              setProperty={setSetting}
              names={{
                backgroundColor: "Background Color",
                drawingAreaColor: "Drawing Area Color",
                includeTitle: "Include Title",
                title: "Title",
                includeBorder: "Include Border",
                borderColor: "Border Color",
                borderThickness: "Border Thickness",
              }}
              restrictions={[
                {
                  restriction: "appear",
                  properties: ["title"],
                  toggleProperty: "includeTitle",
                },
                {
                  restriction: "appear",
                  properties: ["borderColor", "borderThickness"],
                  toggleProperty: "includeBorder",
                },
                {
                  restriction: "color",
                  properties: [
                    "backgroundColor",
                    "drawingAreaColor",
                    "borderColor",
                  ],
                },
                {
                  restriction: "slider",
                  property: "borderThickness",
                  min: 0,
                  max: 10,
                  step: 0.5,
                },
              ]}
            />
          </PropertyList>
        </PropertyAccordionItem>
      </PropertyAccordion>
    </div>
  );
};

export default SettingsPanel;
