import BooleanProperty from "./BooleanProperty";
import ColorProperty from "./ColorProperty";
import StringProperty from "./StringProperty";
import NumericProperty from "./NumericProperty";
import NumericSliderProperty from "./NumericSliderProperty";
import SelectProperty, {
  type SelectPropertyGroupedProps,
} from "./SelectProperty";

export type Properties = { [name: string]: string | number | boolean };
export interface PropertyGeneratorProps {
  /** The properties to generate property inputs for. */
  properties: Properties;
  setProperty: (name: string, value: unknown) => void;
  /**
   * Displayed names used for the properties. Only properties with names
   * will have inputs generated for them.
   */
  names: { [name: string]: string };
  /** Additional restrictions that can be applied to the properties. */
  restrictions: PropertyRestriction[];
}

type RestrictionBase = { property: string } | { properties: string[] };

/**
 * Requires that a string is a color. Will also use <ColorProperty/> for it instead of
 * <StringProperty/>.
 */
export type ColorRestriction = RestrictionBase & {
  restriction: "color";
};

/**
 * Restriction for properties that represent a range. One property is the `maxProperty`
 * which can never be less than the `minProperty` and vice versa.
 *
 * Used for properties like `startTime` and `endTime`.
 */
export type RangeRestriction = {
  restriction: "range";
  minProperty: string;
  maxProperty: string;
};

export type IntegerRestriction = RestrictionBase & {
  restriction: "integer";
};

export type BoundsRestriction = RestrictionBase & {
  restriction: "bounds";
  min: number;
  max: number;
};

/**
 * Makes a <NumericProperty/> into a <NumericSliderProperty/>.
 * Note that the bounds for this are only the bounds for the slider,
 * not the actual value.
 */
export type SliderRestriction = RestrictionBase & {
  restriction: "slider";
  min: number;
  max: number;
  step: number;
};

/**
 * When the `toggleProperty` evaluates to true, these properties
 * will not be rendered, otherwise they will.
 **/
export type DisappearRestriction = RestrictionBase & {
  restriction: "disappear";
  toggleProperty: string;
};

export type AppearRestriction = RestrictionBase & {
  restriction: "appear";
  toggleProperty: string;
};

export type SelectRestriction = RestrictionBase & {
  restriction: "selectWithGroups";
  groups: SelectPropertyGroupedProps["groups"];
};

export type PropertyRestriction =
  | ColorRestriction
  | RangeRestriction
  | IntegerRestriction
  | BoundsRestriction
  | SliderRestriction
  | DisappearRestriction
  | AppearRestriction
  | SelectRestriction;

/**
 * Utility component to generate property inputs for use inside <PropertyList/>
 * Types for properties inferred to the most general option (i.e. the string "#fff" will be
 * inferred to StringProperty rather than ColorProperty), but you can choose a more specific input via
 * the restrictions option.
 *
 * @example
 * ```
 * <PropertyList>
 *   {generatePropertyInputs({
 *     values: {a: 123, b: true, c: "#fff"},
 *     names: {a: "Property A", b: "Property B", c: "Color"},
 *     restrictions: [
 *       { restriction: "color", property: "c" },
 *     ]
 *   })}
 * </PropertyList>
 * ```
 *
 * @remarks
 * This component should not be extended for one-off properties.
 * When adding a custom property, do it like this instead:
 * ```
 * <PropertyList>
 *   <PropertyGenerator />
 *   <CustomProperty />
 * </PropertyList>
 * ```
 */
const PropertyGenerator = ({
  properties,
  setProperty,
  names,
  restrictions,
}: PropertyGeneratorProps) => {
  const restrictionMap: Record<string, PropertyRestriction[]> = {};
  for (const restriction of restrictions) {
    for (const property of getRestrictedPropertiesFrom(restriction)) {
      if (!restrictionMap[property]) {
        restrictionMap[property] = [restriction];
      } else {
        restrictionMap[property].push(restriction);
      }
    }
  }

  const handleChangeFor = (property: string) => {
    return (newValue: Properties[string]) => {
      setProperty(property, newValue);
    };
  };

  const validatorFor = (property: string) => {
    const restrictions = restrictionMap[property];
    return (newValue: Properties[string]) => {
      return !restrictions.some((r) =>
        isRestricted(r, properties, property, newValue),
      );
    };
  };

  return Object.entries(names).map(([property, displayName]) => {
    const disappearRestriction = restrictionMap[property]?.find(
      (r) => r.restriction === "disappear",
    );
    if (
      disappearRestriction &&
      properties[disappearRestriction.toggleProperty]
    ) {
      return;
    }

    const appearRestriction = restrictionMap[property]?.find(
      (r) => r.restriction === "appear",
    );
    if (appearRestriction && !properties[appearRestriction.toggleProperty]) {
      return;
    }

    const value = properties[property];
    switch (typeof value) {
      case "boolean":
        return (
          <BooleanProperty
            key={property}
            name={displayName}
            value={value}
            onChange={handleChangeFor(property)}
          />
        );

      case "number": {
        const sliderRestriction = restrictionMap[property]?.find(
          (r) => r.restriction === "slider",
        );
        if (sliderRestriction) {
          return (
            <NumericSliderProperty
              key={property}
              name={displayName}
              value={value}
              onChange={handleChangeFor(property)}
              min={sliderRestriction.min}
              max={sliderRestriction.max}
              step={sliderRestriction.step}
            />
          );
        } else {
          return (
            <NumericProperty
              key={property}
              name={displayName}
              value={value}
              onChange={handleChangeFor(property)}
              validator={validatorFor(property)}
            />
          );
        }
      }

      case "string": {
        const selectRestriction = restrictionMap[property]?.find(
          (r) => r.restriction === "selectWithGroups",
        );
        if (selectRestriction) {
          return (
            <SelectProperty
              key={property}
              name={displayName}
              value={value}
              groups={selectRestriction.groups}
              onChange={handleChangeFor(property)}
            />
          );
        } else if (
          restrictionMap[property]?.find((r) => r.restriction === "color")
        ) {
          return (
            <ColorProperty
              key={property}
              name={displayName}
              value={value}
              onChange={handleChangeFor(property)}
            />
          );
        } else {
          return (
            <StringProperty
              key={property}
              name={displayName}
              value={value}
              onChange={handleChangeFor(property)}
            />
          );
        }
      }
    }
  });
};

const getRestrictedPropertiesFrom = (
  restriction: PropertyRestriction,
): string[] => {
  if (restriction.restriction === "range") {
    return [restriction.minProperty, restriction.maxProperty];
  } else if ("properties" in restriction) {
    return restriction.properties;
  } else {
    return [restriction.property];
  }
};

const isRestricted = (
  restriction: PropertyRestriction,
  properties: Properties,
  name: string,
  value: Properties[string],
): boolean => {
  switch (restriction.restriction) {
    case "range":
      if (restriction.maxProperty === name) {
        return value <= properties[restriction.minProperty];
      } else {
        return value >= properties[restriction.maxProperty];
      }

    case "integer":
      if (typeof value !== "number") {
        return false;
      } else {
        return Math.floor(value) !== value;
      }

    case "bounds":
      if (typeof value !== "number") {
        return false;
      } else {
        return !(restriction.min <= value && value <= restriction.max);
      }

    default:
      // TODO: implement validation for other types of properties
      return false;
  }
};

export default PropertyGenerator;
