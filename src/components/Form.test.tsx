import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, type FieldConfig } from "./Form";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

function renderForm(fields: FieldConfig[], onSubmit = vi.fn()) {
  return render(
    <Form
      title="Test Form"
      fields={fields}
      onSubmit={onSubmit}
      initialValues={{}}
    />
  );
}

describe("Form component", () => {
  it("renders all field types", () => {
    const fields: FieldConfig[] = [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "age", label: "Age", type: "number" },
    ];
    renderForm(fields);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });

  it("shows required error on blur", async () => {
    const fields: FieldConfig[] = [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        validate: (v) => (!v ? "Required" : null),
      },
    ];
    renderForm(fields);

    const input = screen.getByLabelText(/name/i);
    await userEvent.click(input);
    await userEvent.tab();
    await waitFor(() => {
      expect(screen.getByText(/Required/i)).toBeInTheDocument();
    });
  });

  it("shows sync validation error", async () => {
    const fields: FieldConfig[] = [
      {
        name: "age",
        label: "Age",
        type: "number",
        validate: (v) => (v < 18 ? "Too young" : null),
      },
    ];
    renderForm(fields);

    const input = screen.getByLabelText(/age/i);
    await userEvent.type(input, "15");
    fireEvent.blur(screen.getByLabelText(/age/i));
    await waitFor(() => {
      screen.debug();
      expect(screen.getByText(/too young/i)).toBeInTheDocument();
    });
  });

  it("shows async validation error", async () => {
    const fields: FieldConfig[] = [
      {
        name: "corp",
        label: "Corp #",
        type: "text",
        asyncValidate: async (v) =>
          v !== "123456789" ? { message: "Not valid!" } : null,
      },
    ];
    renderForm(fields);

    const input = screen.getByLabelText(/corp/i);
    await userEvent.type(input, "111111111");
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText(/not valid/i)).toBeInTheDocument();
    });
  });

  it("enables submit onyl when ALL fields are valid", async () => {
    const fields: FieldConfig[] = [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        validate: (v) => (!v ? "Required" : null),
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        validate: (v) => (parseInt(v) < 18 ? "Too young" : null),
      },
    ];
    renderForm(fields);

    screen.debug();

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/name/i), "Tom");
    await userEvent.type(screen.getByLabelText(/age/i), "20");
    fireEvent.blur(screen.getByLabelText(/age/i));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).not.toBeDisabled();
    });
  });

  it("calls onSubmit with correct values", async () => {
    const onSubmit = vi.fn();
    const fields: FieldConfig[] = [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        validate: (v) => (!v ? "Required" : null),
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        validate: (v) => (v < 18 ? "Too young" : null),
      },
    ];
    renderForm(fields, onSubmit);

    await userEvent.type(screen.getByLabelText(/name/i), "Tom");
    await userEvent.type(screen.getByLabelText(/age/i), "22");

    fireEvent.blur(screen.getByLabelText(/age/i));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).not.toBeDisabled();
    });

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: "Tom", age: "22" });
    });
  });
});
