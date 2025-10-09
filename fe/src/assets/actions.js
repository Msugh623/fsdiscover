export default {
  open: (data, openApp) => {
    openApp("/fsexplorer", data.pathname);
    navigator.vibrate(50);
  },
  close: (data) => {
    document.killWindow(data.location, data.href);
    navigator.vibrate(50);
  },
};
