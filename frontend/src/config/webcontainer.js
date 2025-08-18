import { WebContainer } from '@webcontainer/api';

let webContainerInstance = null;

export const getWebContainer = async () => {
<<<<<<< HEAD
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
=======
    if (webContainerInstance === null) {
        webContainerInstance = await WebContainer.boot(
            {
                experimental: {
                 permittedPorts: [8080], 
                 },
            });
    }
    return webContainerInstance;
}
>>>>>>> d3ee68670c11cf509c037cd71b60dd208716b25e
