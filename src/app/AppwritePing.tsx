"use client";

import { useEffect } from "react";
import { client } from "@/lib/appwrite";

export default function AppwritePing() {
  useEffect(() => {
    client.ping().catch(() => {
      // Ignore ping failures to avoid impacting app load.
    });
  }, []);

  return null;
}
