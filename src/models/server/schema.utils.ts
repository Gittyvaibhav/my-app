import { database } from "./config";

type AttributeWithStatus = {
  status?: string;
  error?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForAttributeAvailable(
  databaseId: string,
  collectionId: string,
  attributeKey: string,
  maxAttempts = 30,
  delayMs = 500
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const attribute = (await database.getAttribute(
      databaseId,
      collectionId,
      attributeKey
    )) as AttributeWithStatus;

    if (attribute.status === "available") {
      return;
    }

    if (attribute.status === "failed") {
      throw new Error(
        `Attribute ${attributeKey} failed to become available: ${
          attribute.error ?? "unknown error"
        }`
      );
    }

    await sleep(delayMs);
  }

  throw new Error(
    `Timed out waiting for attribute ${attributeKey} to become available`
  );
}
