if ('serviceWorker' in navigator)
{
  window.addEventListener('load', () => {
    navigator.serviceWorker
    .register('/sw.js')
    .then(reg => {
    // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', reg.scope);
    })
    .catch(err => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
