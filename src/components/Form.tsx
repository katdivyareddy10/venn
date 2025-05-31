import { useState, type FormEvent } from "react";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "number" | "select" | "date";
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  validate?: (value: any, values: Record<string, any>) => string | null;
  asyncValidate?: (
    value: any,
    values: Record<string, any>
  ) => Promise<string | null>;
};

type FormProps = {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
};

// Generic form for reusability
export function Form({ fields, onSubmit, initialValues = {} }: FormProps) {
  const [form, setForm] = useState<Record<string, any>>(
    Object.fromEntries(fields.map((f) => [f.name, initialValues[f.name] ?? ""]))
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  function handleChange(name: string, value: any) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  async function handleBlur(name: string) {
    setTouched((t) => ({ ...t, [name]: true }));

    const field = fields.find((f) => f.name === name);
    const value = form[name];

    // 1. Sync validation
    if (field?.validate) {
      const err = field.validate(value, form);
      setErrors((e) => ({ ...e, [name]: err }));
      if (err) return; // stop here if sync failed
    }

    // 2. Async validation
    if (field?.asyncValidate) {
      setLoading((l) => ({ ...l, [name]: true }));
      const err = await field.asyncValidate(value, form);
      setLoading((l) => ({ ...l, [name]: false }));
      setErrors((e) => ({ ...e, [name]: err }));
    }
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
              onBlur={() => handleBlur(field.name)}
              disabled={touched[field.name] && loading[field.name]}
            />
            {touched[field.name] && errors[field.name] && (
              <div>{errors[field.name]}</div>
            )}
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
