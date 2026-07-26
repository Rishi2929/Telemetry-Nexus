"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import Link from "next/link";

type ApiKeyCardProps = {
  projectId: string;
};


export default function ApiKeyCard({projectId}:ApiKeyCardProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  async function copyApiKey(){
    if(!apiKey) return ;
    
    await navigator.clipboard.writeText(apiKey);

    setCopied(true);

    setTimeout(()=>{
        setCopied(false)
    },2000)
  }

  useEffect(() => {
    async function fetchApiKey() {
      try {
        const response = await fetch("/api/flash-api-key");

        const data = await response.json();

        setApiKey(data.apiKey);
      } finally {
        setLoading(false);
      }
    }

    fetchApiKey();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!apiKey) {
    return (
  <div className="flex min-h-[70vh] items-center justify-center px-4">
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>API Key Not Available</CardTitle>

        <CardDescription>
          This API key can no longer be viewed. If you didn't save it, generate
          a new API key from your project settings.
        </CardDescription>
      </CardHeader>
    </Card>
  </div>
);
  }

  return (
  <div className="flex min-h-[70vh] items-center justify-center px-4">
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>API Key Created</CardTitle>

        <CardDescription>
          This API key will only be shown once. Store it in a safe place before
          leaving this page.
        </CardDescription>
      </CardHeader>

      <CardContent>
<div className="flex gap-2">
  <Input
    value={apiKey}
    readOnly
    className="font-mono"
  />

  <Button
    size="icon"
    variant="outline"
    onClick={copyApiKey}
  >
    {copied ? (
      <Check className="size-4" />
    ) : (
      <Copy className="size-4" />
    )}
  </Button>
</div>
      </CardContent>
      <div className="mt-6 flex justify-end">
  <Button >
    <Link href={`/projects/${projectId}`}>
      Continue to Project
    </Link>
  </Button>
</div>
    </Card>
  </div>
);
}