import { useForm } from "../hooks/useForm";

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
  const form = useForm({
    fields,
    onSubmit,
    initialValues,
  });

  return (
    <form onSubmit={form.handleSubmit}>
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
              value={form.values[field.name]}
              onChange={(e) => form.handleChange(field.name, e.target.value)}
              onBlur={() => form.handleBlur(field.name)}
              disabled={form.touched[field.name] && form.loading[field.name]}
            />
            {form.touched[field.name] && form.errors[field.name] && (
              <div>{form.errors[field.name]}</div>
            )}
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
