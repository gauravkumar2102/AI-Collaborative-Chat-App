import { WebContainer } from '@webcontainer/api';

let webContainerInstance = null;

export const getWebContainer = async () => {
  if (!webContainerInstance) {
    webContainerInstance = await WebContainer.boot({
      experimental: {
        permittedPorts: [3000], // allow exposing port 3000
      },
    });
    console.log("WebContainer booted!");
  }
  return webContainerInstance;
};
