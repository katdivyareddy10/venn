import { useState, type FormEvent } from "react";
import type { FieldConfig } from "../components/Form";

type UseFormOptions = {
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
};

export function useForm({
  fields,
  initialValues = {},
  onSubmit,
}: UseFormOptions) {
  const [values, setValues] = useState<Record<string, any>>(
    Object.fromEntries(fields.map((f) => [f.name, initialValues[f.name] ?? ""]))
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  function handleChange(name: string, value: any) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleBlur(name: string) {
    setTouched((t) => ({ ...t, [name]: true }));

    const field = fields.find((f) => f.name === name);
    const value = values[name];

    // 1. Sync validation
    if (field?.validate) {
      const err = field.validate(value, values);
      setErrors((e) => ({ ...e, [name]: err }));
      if (err) return; // stop here if sync failed
    }

    // 2. Async validation
    if (field?.asyncValidate) {
      setLoading((l) => ({ ...l, [name]: true }));
      const err = await field.asyncValidate(value, values);
      setLoading((l) => ({ ...l, [name]: false }));
      setErrors((e) => ({ ...e, [name]: err }));
    }
  }

  async function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();

    try {
      await onSubmit(values);
    } catch (err: any) {
      // TODO - implement error to display user message?
      console.log(err);
    }
  }

  function setValue(name: string, value: any) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  return {
    values,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
  };
}
