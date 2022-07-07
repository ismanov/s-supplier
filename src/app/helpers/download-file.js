export const downloadFile = (url, filename) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};