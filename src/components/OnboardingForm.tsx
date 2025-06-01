import { Form, type FieldConfig } from "./Form";
import "../styles/form.css";
import { getRequest, postRequest } from "../api/request";
import { BASE_URI } from "../utils";
import { useState } from "react";

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
    style: { gridColumn: "1/3" },
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
    style: { gridColumn: "1/3" },
    validate: (v: string) =>
      !v
        ? "Corporation number is required"
        : v.length !== 9
        ? "Must be 9 digits"
        : null,
    asyncValidate: async (v: string) => {
      if (!v || v.length !== 9) return null;
      const res = await getRequest(
        `${BASE_URI}/corporation-number/${encodeURIComponent(v)}`
      );
      return res.response;
    },
  },
];

export default function OnboardingForm() {
  const [submissionMessage, setSubmissionMessage] = useState<string | null>();
  const handleSubmit = async (values: Record<string, any>) => {
    const result = await postRequest({
      url: `${BASE_URI}/profile-details`,
      body: values,
      headers: { "Content-Type": "application/json" },
    });

    if (result.success) {
      setSubmissionMessage(null);
      // TODO - Show next step of the form?
      alert("Form submission successful");
    } else if (result.statusCode === 400) {
      setSubmissionMessage(result.response?.message);
    }
  };

  return (
    <>
      <p className="step-text">Step 1 of 5</p>
      <Form fields={fields} title="Onboarding Form" onSubmit={handleSubmit} />
      {submissionMessage && (
        <div className="form-error">{submissionMessage}</div>
      )}
    </>
  );
}
