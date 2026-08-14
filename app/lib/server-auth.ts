export function assertAdminRequest(request: Request) {
  const expectedSecret =
    process.env.BIASLY_ADMIN_SECRET ??
    process.env.SKEW_ADMIN_SECRET ??
    process.env["x-SKEW-admin-secret"]

  if (!expectedSecret) {
    return Response.json(
      { error: "BIASLY_ADMIN_SECRET or SKEW_ADMIN_SECRET is not configured" },
      { status: 500 },
    )
  }

  const providedSecret =
    request.headers.get("x-biasly-admin-secret") ??
    request.headers.get("x-skew-admin-secret")

  if (providedSecret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}

export function assertCronRequest(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  const expectedSecret = process.env.CRON_SECRET

  if (!expectedSecret) {
    return Response.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 },
    )
  }

  const authHeader = request.headers.get("authorization")
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null

  if (bearerToken !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}
