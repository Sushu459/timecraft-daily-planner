import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Auth() {
  return (
    <main className="min-h-screen container mx-auto flex items-center justify-center p-6">
      <Card className="w-full max-w-xl animate-enter">
        <CardHeader>
          <CardTitle>Enable Authentication</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-muted-foreground">
            Supabase is not connected yet. Connect your project to Supabase to enable email/password, Google, and phone authentication.
          </p>
          <a
            href="https://docs.lovable.dev/integrations/supabase/"
            target="_blank"
            rel="noreferrer"
            className="inline-block"
          >
            <Button variant="hero">Read how to connect Supabase</Button>
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
