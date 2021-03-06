export default function (
  {
    serverSideContent,
    vendorBundleUrl,
    appBundleUrl,
    initialState,
    vendorCss,
    clientCss,
  },
) {
  return `
  <!DOCTYPE html>
    <html>

    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge"/>
      <title>Timezone Manager</title>
      <meta name="description" content="Timezone Manager"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      ${vendorCss ? `<link rel="stylesheet" type="text/css" href="${vendorCss}">` : ''}
      ${clientCss ? `<link rel="stylesheet" type="text/css" href="${clientCss}">` : ''}
    </head>

    <body>

      <!--[if IE]>
      <p class="browserupgrade">
        You are using an <strong>outdated</strong> browser.
        Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve
        your experience.
      </p>
      <![endif]-->

      <main id="react-app">${serverSideContent}</main>
      <script>window.__PRELOADED_STATE__=${JSON.stringify(initialState)}</script>
      <script type="text/javascript" src="${vendorBundleUrl}"></script>
      <script type="text/javascript" src="${appBundleUrl}"></script>
    </body>

    </html>
  `;
}
