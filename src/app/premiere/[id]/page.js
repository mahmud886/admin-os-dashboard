import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import PremiereClient from './premiere-client';

export const metadata = {
  title: 'Premiere Access',
  robots: 'noindex, nofollow',
};

export default async function PremierePage({ params }) {
  const { id } = await params;

  // Use Service Role to fetch episode details including password field availability
  // We use service role to ensure we can check if a password exists even if RLS hides it from public
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: episode, error } = await supabase.from('episodes').select('*').eq('id', id).single();

  if (error || !episode) {
    notFound();
  }

  // Sanitize data for client
  const hasPassword = !!episode.password;
  const safeEpisode = {
    ...episode,
    has_password: hasPassword,
  };

  // CRITICAL: Remove the actual password before sending to client
  delete safeEpisode.password;

  return <PremiereClient episode={safeEpisode} />;
}
