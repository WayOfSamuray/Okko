"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CountrySelect.module.css";

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
};

const countries = [
  "США",
  "Россия",
  "Франция",
  "Великобритания",
  "Германия",
  "Канада",
  "Япония",
];

export default function CountrySelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (country: string) => {
    if (value.includes(country)) {
      onChange(value.filter((c) => c !== country));
    } else {
      onChange([...value, country]);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.input} onClick={() => setOpen((p) => !p)}>
        {value.length > 0 ? value.join(", ") : "Выберите страны"}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {countries.map((c) => (
            <label key={c} className={styles.option}>
              <input
                type="checkbox"
                checked={value.includes(c)}
                onChange={() => toggle(c)}
              />
              {c}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
