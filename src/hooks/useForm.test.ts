import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useForm } from "./useForm";
import type { FieldConfig } from "../components/Form";

describe("useForm", () => {
  const fields: FieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      validate: (val: string) => (!val.includes("@") ? "Invalid email" : null),
      asyncValidate: async (val: string) =>
        val === "exists@example.com"
          ? {
              message: "Email already exists",
              valid: false,
            }
          : null,
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      validate: (val: string) => (val.length < 6 ? "Too short" : null),
    },
  ];

  it("handles sync and async validation", async () => {
    const { result } = renderHook(() =>
      useForm({
        fields,
        onSubmit: vi.fn(),
      })
    );

    act(() => {
      result.current.handleChange("email", "invalid");
    });

    await act(async () => {
      await result.current.handleBlur("email");
    });

    expect(result.current.errors.email).toBe("Invalid email");

    act(() => {
      result.current.handleChange("email", "exists@example.com");
    });

    await act(async () => {
      await result.current.handleBlur("email");
    });

    expect(result.current.errors.email).toBe("Email already exists");
  });
});
