import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const serverReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export function getServerWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error("Missing environment variable: SANITY_API_WRITE_TOKEN");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}
