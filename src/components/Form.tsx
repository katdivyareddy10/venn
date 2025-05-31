import { useState, type FormEvent } from "react";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "number" | "select" | "date";
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
};

type FormProps = {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, any>) => void;
};

// Generic form for reusability
export function Form({ fields, onSubmit }: FormProps) {
  // Init state - empty strings
  const [form, setForm] = useState<Record<string, any>>(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  function handleChange(name: string, value: any) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              maxLength={field.maxLength}
              placeholder={field.placeholder}
              required={field.required}
              value={form[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
