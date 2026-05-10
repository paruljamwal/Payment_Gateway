import type { CurrencyType } from "@/types/payment";
import { currencies } from "@/types/payment";
import FormField from "@/components/payment/FormField";

export type CurrencySelectProps = {
  id: string;
  label: string;
  value: CurrencyType;
  onChange: (value: CurrencyType) => void;
  onBlur: () => void;
  error?: string;
};

export default function CurrencySelect({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
}: CurrencySelectProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          if (next === "INR" || next === "USD") {
            onChange(next);
          }
        }}
        onBlur={onBlur}
      >
        {currencies.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </FormField>
  );
}
