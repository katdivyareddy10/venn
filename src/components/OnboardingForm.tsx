import { useForm } from "../hooks/useForm";
import type { FieldConfig } from "./Form";
import "../styles/form.css";

const fields: FieldConfig[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    maxLength: 50,
    required: true,
    validate: (v: string) =>
      !v ? "First name is required" : v.length > 50 ? "Max 50 chars" : null,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    maxLength: 50,
    required: true,
    validate: (v: string) =>
      !v ? "Last name is required" : v.length > 50 ? "Max 50 chars" : null,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: true,
    validate: (v: string) => {
      if (!v) return "Phone number is required";
      if (!/^\+1\d{10}$/.test(v)) return "Enter valid number (+1XXXXXXXXXX)";
      return null;
    },
  },
  {
    name: "corporationNumber",
    label: "Corporation Number",
    type: "text",
    required: true,
    validate: (v: string) =>
      !v
        ? "Corporation number is required"
        : v.length !== 9
        ? "Must be 9 digits"
        : null,
    asyncValidate: async (v: string) => {
      if (!v || v.length !== 9) return null;
      // Simulated API call (replace with real fetch)
      await new Promise((res) => setTimeout(res, 800));
      return "Invalid corporation number";
    },
  },
];

export default function OnboardingForm() {
  const form = useForm({
    fields,
    onSubmit: async (values) => {
      alert("Success!\n" + JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="form-card">
      <h2>Onboarding Form</h2>
      <form onSubmit={form.handleSubmit}>
        <div className="form-fields">
          {fields.map((field) => (
            <div
              key={field.name}
              style={
                ["phone", "corporationNumber"].includes(field.name)
                  ? { gridColumn: "1/3" }
                  : {}
              }
            >
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
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
                <div className="field-loading">Checking…</div>
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
        {/* TODO - Handle submit errors */}
      </form>
    </div>
  );
}
