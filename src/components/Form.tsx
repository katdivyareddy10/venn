import type { CSSProperties } from "react";
import { useForm } from "../hooks/useForm";

export type InputType = "text" | "tel" | "email" | "number" | "select" | "date";

export type FieldConfig = {
  name: string;
  label: string;
  type: InputType;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  style?: CSSProperties;
  validate?: (value: any, values: Record<string, any>) => string | null;
  asyncValidate?: (
    value: any,
    values: Record<string, any>
  ) => Promise<Record<string, any> | null>;
};

type FormProps = {
  title?: string;
  fields: FieldConfig[];
  onSubmit: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
};

// Generic form for reusability
export function Form({
  title,
  fields,
  onSubmit,
  initialValues = {},
}: FormProps) {
  const form = useForm({
    fields,
    onSubmit,
    initialValues,
  });

  return (
    <div className="form-card">
      <h2>{title}</h2>
      <form autoComplete="off" onSubmit={form.handleSubmit}>
        <div className="form-fields">
          {fields.map((field, index) => (
            <div key={field.name} style={field.style}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                autoFocus={!index}
                aria-autocomplete="none"
                name={field.name}
                type={field.type}
                maxLength={field.maxLength}
                required={field.required}
                value={form.values[field.name]}
                onChange={(e) => form.handleChange(field.name, e.target.value)}
                onBlur={() => form.handleBlur(field.name)}
                autoComplete="off"
              />
              {form.loading[field.name] && (
                <div className="field-loading">Validating...</div>
              )}
              {form.touched[field.name] && form.errors[field.name] && (
                <div className="field-error">{form.errors[field.name]}</div>
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={!form.allFieldsValid}>
          Submit →
        </button>
      </form>
    </div>
  );
}
