import { RemixServer } from '@remix-run/react';
import { renderToReadableStream } from 'react-dom/server';
import { Head } from '../../app/root';
import { renderHeadToString } from 'remix-island';

export default async function handler(request: Request, context: any) {
  let responseStatusCode = 200;
  const remixContext = await context.remix.getLoadContext();
  
  const stream = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  const head = renderHeadToString({ request, remixContext, Head });

  return new Response(stream, {
    status: responseStatusCode,
    headers: {
      'Content-Type': 'text/html',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  });
} 