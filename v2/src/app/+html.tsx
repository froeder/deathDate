import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Root HTML for static rendering in Expo Router.
 * Configures global head elements: favicon, PWA icons, and the Ionicons font-face.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Death Date — Estimativa de Longevidade</title>
        <meta name="description" content="Calculadora de expectativa de vida baseada em ciência atuarial e hábitos de saúde." />

        {/* Favicon and PWA icons */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Inlined Ionicons font-face definition to guarantee web icon display */}
        <style dangerouslySetInnerHTML={{ __html: iconFontStyles }} />

        {/* Reset the user-agent styles for ScrollView */}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}

const iconFontStyles = `
@font-face {
  font-family: 'ionicons';
  src: url('/fonts/Ionicons.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Ionicons';
  src: url('/fonts/Ionicons.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;
