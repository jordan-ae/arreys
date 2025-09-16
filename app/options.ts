import assert from "assert";
import { HandshakeOptions, makeFromNextAuth } from "handshake";
import { getAllProviders } from "~/lib/supabse";

const ALLOWED_REDIRECT_HOST = process.env.ALLOWED_REDIRECT_HOST || "";
assert(ALLOWED_REDIRECT_HOST, "Specify a value for ALLOWED_REDIRECT_HOST.");

type ProviderRow = {
  id: string;
  user_id: string | null;
  provider_name: string; // matches next-auth providers folder (e.g., "google", "github", "azure-ad-b2c", "42-school", etc.)
  client_id: string;
  client_secret: string;
  scopes: string[] | null;
};

async function resolveNextAuthFactory(name: string) {
  try {
    const mod = await import(`next-auth/providers/${name}`);
    const factory = mod?.default;
    if (typeof factory !== "function") return null;
    return makeFromNextAuth(factory);
  } catch {
    return null;
  }
}

async function buildHandlers() {
  const rows = (await getAllProviders()) as ProviderRow[];

  const handlers: any[] = [];
  for (const p of rows ?? []) {
    const factory = await resolveNextAuthFactory(p.provider_name);
    if (!factory) {
      console.warn(`Provider "${p.provider_name}" not available via next-auth/providers/${p.provider_name}`);
      continue;
    }
    handlers.push(
      factory({
        clientId: p.client_id,
        clientSecret: p.client_secret,
        scope: (p.scopes ?? []).join(" "),
      }),
    );
  }
  return handlers;
}

export async function buildOptions(): Promise<HandshakeOptions> {
  const handlers = await buildHandlers();

  return {
    secret: process.env.SESSION_SECRET!,
    allowedRedirectHosts: [ALLOWED_REDIRECT_HOST],
    handlers,
    async onSuccess(tokens, handlerId) {
    // TODO: Do something with the tokens.
    console.log(`Received tokens for ${handlerId}`, tokens);

    // // Example of (1):
    // const jsonToken = JSON.stringify(tokens.tokens);
    //
    // // You'll want to use `crypto.createCipheriv` instead.
    // const cipher = crypto.createCipher(
    //   "aes256",
    //   "a-secret-shared-with-your-backend",
    // );
    // const encrypted =
    //   cipher.update(jsonToken, "utf8", "hex") + cipher.final("hex");
    //
    // return {
    //   forwardParams: {
    //     encryptedTokens: encrypted,
    //   },
    // };
      console.log(`Received tokens for ${handlerId}`, tokens);
      return { forwardParams: {} };
    },
  };
}


// import assert from "assert";
// import { HandshakeOptions } from "handshake";

// const ALLOWED_REDIRECT_HOST = process.env.ALLOWED_REDIRECT_HOST || "";
// assert(ALLOWED_REDIRECT_HOST, "Specify a value for ALLOWED_REDIRECT_HOST.");

// export const options: HandshakeOptions = {
//   secret: process.env.SESSION_SECRET!,
//   allowedRedirectHosts: [ALLOWED_REDIRECT_HOST],
//   handlers: [
//     // TODO add your handlers here...
//     //
//     // Shopify({
//     //   clientId: process.env.SHOPIFY_CLIENT_ID!,
//     //   clientSecret: process.env.SHOPIFY_CLIENT_SECRET!,
//     //   scopes: ["read_orders"],
//     // }),
//   ],
//   /**
//    * This is where you'll handle forwarding the acquired credentials back to
//    * your own app. There are three main strategies for doing this securely:
//    *
//    * - **1. Query string** Send the credentials back as a URL parameter by
//    *   setting `forwardParams`. You should probably symmetrically encrypt the
//    *   parameter by sharing a secret between this Handshake instance and your
//    *   backend.
//    *
//    * - **2. API call** Make an API call to your backend and send the
//    *   credentials.
//    *
//    * - **3. Cookie** If you're hosting Handshake on the same domain as your app,
//    *   you can set cookies using `cookies()` (from `next/server`) and read them
//    *   in the callback.
//    *
//    * @param tokens - Credentials received from the provider.
//    * @param handlerId - Identifies the provider that handled this handshake, eg:
//    * 'google', 'github', 'amazon-seller' etc.
//    */
//   async onSuccess(tokens, handlerId) {
//     // TODO: Do something with the tokens.
//     console.log(`Received tokens for ${handlerId}`, tokens);

//     // // Example of (1):
//     // const jsonToken = JSON.stringify(tokens.tokens);
//     //
//     // // You'll want to use `crypto.createCipheriv` instead.
//     // const cipher = crypto.createCipher(
//     //   "aes256",
//     //   "a-secret-shared-with-your-backend",
//     // );
//     // const encrypted =
//     //   cipher.update(jsonToken, "utf8", "hex") + cipher.final("hex");
//     //
//     // return {
//     //   forwardParams: {
//     //     encryptedTokens: encrypted,
//     //   },
//     // };

//     return {
//       forwardParams: {},
//     };
//   },
// };