export async function getRequest(url: string) {
  try {
    const resp = await fetch(url, { method: "GET" });
    const response = await resp.json();

    if (!resp.ok) {
      return {
        success: false,
        status:
          resp.status >= 400 && resp.status < 500 ? "invalid" : "server-error",
        statusCode: resp.status,
        response,
      };
    }

    return {
      success: true,
      status: "ok",
      response,
      statusCode: resp.status,
    };
  } catch {
    return {
      success: false,
    };
  }
}

export async function postRequest(opts: {
  url: string;
  body?: any;
  headers?: Record<string, string>;
}) {
  const { url, body, headers = {} } = opts;

  try {
    let fetchOptions: RequestInit = {
      method: "POST",
      headers: { ...headers },
    };

    // Can be extended for fileTypes & others, best to keep separate from GET
    if (body) {
      fetchOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }

    const resp = await fetch(url, fetchOptions);

    if (resp.status === 200) {
      return {
        success: true,
        status: resp.status,
      };
    }

    const response = await resp.json();

    return {
      success: false,
      status:
        resp.status >= 400 && resp.status < 500 ? "invalid" : "server-error",
      statusCode: resp.status,
      response,
    };
  } catch {
    return {
      success: false,
    };
  }
}
