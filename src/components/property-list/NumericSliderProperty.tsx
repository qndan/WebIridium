import type React from "react";
import { Slider as RadixSlider } from "radix-ui";
import styles from "./PropertyList.module.css";
import { clsx } from "clsx";

export interface NumericSliderProperty {
  name: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (newValue: number) => void;
}

const NumericSliderProperty = ({
  name,
  value,
  min,
  max,
  step,
  onChange,
}: NumericSliderProperty) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = +e.target.value;
    if (!Number.isNaN(number) && min <= number && number <= max) {
      onChange(number);
    }
  };

  return (
    <div className={styles.property}>
      <label htmlFor={name} className={styles.propertyName}>
        {name}
      </label>

      <input
        id={name}
        className={clsx([styles.propertyInput, styles.secondary])}
        type="number"
        value={value}
        step={step}
        onChange={handleChange}
      />

      <RadixSlider.Root
        className={styles.sliderRoot}
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
      >
        <RadixSlider.Track className={styles.sliderTrack}>
          <RadixSlider.Range className={styles.sliderRange} />
        </RadixSlider.Track>
        <RadixSlider.Thumb className={styles.sliderThumb} />
      </RadixSlider.Root>
    </div>
  );
};

export default NumericSliderProperty;
