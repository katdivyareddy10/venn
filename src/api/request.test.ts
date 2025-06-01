import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRequest, postRequest } from "./request";
import { BASE_URI } from "../utils";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getRequest (corporation number API)", () => {
  const CORRECT = {
    corporationNumber: "123456789",
    valid: true,
  };

  const INCORRECT = {
    valid: false,
    message: "Invalid corporation number",
  };

  it("returns success for a valid corporation number", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => CORRECT,
    });

    const res = await getRequest(`${BASE_URI}/corporation-number/123456789`);
    expect(res.success).toBe(true);
    expect(res.status).toBe("ok");
    expect(res.response).toEqual(CORRECT);
    expect(res.statusCode).toBe(200);
    expect(res.response.valid).toBe(true);
    expect(res.response.corporationNumber).toBe("123456789");
  });

  it("returns invalid for an invalid corporation number", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => INCORRECT,
    });

    const res = await getRequest(`${BASE_URI}/corporation-number/987654321`);
    expect(res.success).toBe(false);
    expect(res.status).toBe("invalid");
    expect(res.response).toEqual(INCORRECT);
    expect(res.statusCode).toBe(400);
    expect(res.response.valid).toBe(false);
    expect(res.response.message).toMatch(/invalid corporation number/i);
  });
});

describe("postRequest (profile-details API)", () => {
  const VALID_INPUT = {
    firstName: "Hello",
    lastName: "World",
    corporationNumber: "826417395",
    phone: "+13062776103",
  };

  const INVALID_PHONE = {
    message: "Invalid phone number",
  };

  it("returns success on 200 (valid input, no response body)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi.fn(), // shouldn't be called since status is 200
    });

    const res = await postRequest({
      url: "https://fe-hometask-api.qa.vault.tryvault.com/profile-details",
      body: VALID_INPUT,
    });

    expect(res.success).toBe(true);
    expect(res.status).toBe(200);
  });

  it("returns invalid with error message on 400", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 400,
      json: vi.fn().mockResolvedValue(INVALID_PHONE),
    });

    const res = await postRequest({
      url: "https://fe-hometask-api.qa.vault.tryvault.com/profile-details",
      body: { ...VALID_INPUT, phone: "bad" },
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe("invalid");
    expect(res.statusCode).toBe(400);
    expect(res.response).toEqual(INVALID_PHONE);
    expect(res.response.message).toMatch(/invalid phone number/i);
  });
});
