import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const scope = searchParams.get('scope');
  const state = searchParams.get('state');

  if (!code) {
    return redirect('/login?error=no_code');
  }

  // Store code in session/query param and redirect to login page
  // The login page will exchange the code for a token
  const params = new URLSearchParams({
    code,
    scope: scope || '',
  });

  return redirect(`/login?${params.toString()}`);
}
