import { twMerge } from "tailwind-merge";
import { getSanitizedHandlerInfo } from "../(index)/LocalIndex";

const IS_DEV = process.env.NODE_ENV === "development";

export default async function ProvidersPage() {
  const handlers = await getSanitizedHandlerInfo();

  const sampleProviders = [
    {
      id: "a0471574-159c-43e7-8cc5-798873e27366",
      user_id: "89494365-6f4d-43f5-b57d-26aec42bf766",
      provider_name: "github",
      client_id: "Ov23liYEfWeC2lBrVvVb",
      client_secret: "3eeb61c749bcbe86b3f65658033fb09999b3ffce",
      scopes: ["email"],
      created_at: "2025-09-17T11:43:46.325912+00:00",
      updated_at: "2025-09-17T11:43:46.325912+00:00",
    },
    {
      id: "b1592685-2c0e-4f2e-9a6c-0f0a1b2c3d4e",
      user_id: "89494365-6f4d-43f5-b57d-26aec42bf766",
      provider_name: "spotify",
      client_id: "1a2b3c4d5e6f7g8h9i0j",
      client_secret: "sp0t1fycl13ntsecretexample00000000000000",
      scopes: ["user-read-email"],
      created_at: "2025-09-17T11:43:46.325912+00:00",
      updated_at: "2025-09-17T11:43:46.325912+00:00",
    },
  ];

  let data = sampleProviders as Array<{
    id: string;
    user_id: string;
    provider_name: string;
    client_id: string;
    client_secret: string;
    scopes: string[];
    created_at: string;
    updated_at: string;
  }>;

  try {
    const mod = await import("~/lib/supabse");
    const fetched = await mod.getAllProviders();
    if (Array.isArray(fetched) && fetched.length) {
      data = fetched as typeof data;
    }
  } catch (err) {
    // Ignore and use sampleProviders
  }

  const configuredNames = new Set(data.map((p) => p.provider_name));
  const configuredHandlers = handlers.filter(
    (h) => configuredNames.has(h.id) || configuredNames.has(h.provider.id),
  );

  const itemsFromHandlers = configuredHandlers.map((handler) => {
    const base = `/auth/${handler.id}/redirect`;
    let args = "state=12345&callback_uri=http://localhost:3000/done";

    if (handler.id === "shopify") {
      args += "&extras.shop=example.myshopify.com";
    }

    return (
      <li
        key={handler.id}
        className="relative flex w-full flex-col gap-4 rounded-lg border bg-gray-50 p-5"
      >
        <div className="flex flex-row items-center gap-2">
          <img
            className="inline-block"
            src={handler.provider.logo}
            width={20}
            alt=""
          />
          <strong className="font-medium">{handler.provider.title}</strong>
          <span
            className={twMerge(
              "ml-auto font-mono text-xs text-gray-500",
              handler.id === handler.provider.id && "opacity-30",
            )}
          >
            id: {handler.id}
          </span>
        </div>

        <div>
          <p className="mb-1">Initiate auth by sending users to:</p>
          <code className="text-sm">
            <a href={`${base}?${args}`} target="_blank" className="group">
              <div>
                <div>https://YOUR_HANDSHAKE_INSTANCE{base}</div>
                <div className="ml-6 block w-fit opacity-70 transition group-hover:opacity-100">
                  {args.split("&").map((arg, index) => (
                    <div key={index}>
                      {index > 0 ? "&" : "?"}
                      {arg}
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </code>
        </div>

        <div>
          <p className="mb-1">Authorize this callback URL in your provider console:</p>
          <code className="text-sm">
            https://YOUR_HANDSHAKE_INSTANCE/auth/{handler.id}/callback
          </code>
        </div>
      </li>
    );
  });

  // Fallback rendering based purely on provider data when no handlers are configured
  const itemsFromData = data.map((p) => {
    const providerId = p.provider_name;
    const base = `/auth/${providerId}/redirect`;
    let args = "state=12345&callback_uri=http://localhost:3000/done";
    if (providerId === "shopify") {
      args += "&extras.shop=example.myshopify.com";
    }
    const logo = `https://handshake.cool/images/provider-logos/original/${providerId}.svg`;

    return (
      <li
        key={p.id}
        className="relative flex w-full flex-col gap-4 rounded-lg border bg-gray-50 p-5"
      >
        <div className="flex flex-row items-center gap-2">
          <img className="inline-block" src={logo} width={20} alt="" />
          <strong className="font-medium">{providerId}</strong>
          <span className="ml-auto font-mono text-xs text-gray-500">id: {providerId}</span>
        </div>
        <div>
          <p className="mb-1">Initiate auth by sending users to:</p>
          <code className="text-sm">
            <a href={`${base}?${args}`} target="_blank" className="group">
              <div>
                <div>https://YOUR_HANDSHAKE_INSTANCE{base}</div>
                <div className="ml-6 block w-fit opacity-70 transition group-hover:opacity-100">
                  {args.split("&").map((arg, index) => (
                    <div key={index}>
                      {index > 0 ? "&" : "?"}
                      {arg}
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </code>
        </div>
        <div>
          <p className="mb-1">Authorize this callback URL in your provider console:</p>
          <code className="text-sm">
            https://YOUR_HANDSHAKE_INSTANCE/auth/{providerId}/callback
          </code>
        </div>
      </li>
    );
  });

  const hasHandlerItems = itemsFromHandlers.length > 0;
  const hasDataItems = itemsFromData.length > 0;

  return (
    <main className="justify-top flex min-h-screen w-full flex-col items-start gap-8 p-8">
      <section>
        <h2 className="text-lg font-semibold">Configured providers</h2>
        {IS_DEV && (
          <p className="text-sm text-gray-600">
            Development mode: using database results when available; otherwise sample data.
          </p>
        )}
      </section>

      {hasHandlerItems ? (
        <ul className="flex w-full max-w-[900px] flex-col gap-5">{itemsFromHandlers}</ul>
      ) : hasDataItems ? (
        <ul className="flex w-full max-w-[900px] flex-col gap-5">{itemsFromData}</ul>
      ) : (
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">No providers are configured.</h3>
          <p>Add handlers in <code>app/options.ts</code> to see them listed here.</p>
        </div>
      )}
    </main>
  );
} 