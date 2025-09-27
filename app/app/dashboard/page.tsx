'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { createClient } from '~/lib/supabase/client';
import { addProvider, getAllProviders, supabase } from '~/lib/supabse';

interface FormData {
  providerName: string;
  clientId: string;
  clientSecret: string;
  scopes: string;
}

export default function ProviderDashboard() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);

  const data = getAllProviders()

  console.log(data, "This is the data")


  const getData = async () => {

  const data = await supabase.from("providers").select("*")

  return data
  }

   console.log(getData())

  const onSubmit = async (data: FormData) => {
    try {

      const supabase = createClient()

      const { data: {session} } = await supabase.auth.getSession()

      if (!session) throw new Error('Please log in');

      await addProvider(session?.user.id, {
        name: data.providerName,
        clientId: data.clientId,
        clientSecret: data.clientSecret,
        scopes: data.scopes.split(',').map((s) => s.trim()),
      });
      reset();
      alert('Provider added successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">Add OAuth Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="providerName">Provider</Label>
              <Input
                id="providerName"
                placeholder="e.g., google"
                {...register('providerName', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                placeholder="Client ID"
                {...register('clientId', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                placeholder="Client Secret"
                type="password"
                {...register('clientSecret', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scopes">Scopes</Label>
              <Input
                id="scopes"
                placeholder="Comma-separated, e.g., profile,email"
                {...register('scopes', { required: true })}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Add Provider</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}