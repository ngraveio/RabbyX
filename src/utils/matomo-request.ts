import { customAlphabet, nanoid } from 'nanoid';
import { browser } from 'webextension-polyfill-ts';

const ANALYTICS_PATH = 'https://matomo.debank.com/matomo.php';
const genExtensionId = customAlphabet('1234567890abcdef', 16);

async function postData(url = '', params: URLSearchParams) {
  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'POST',
  });

  return response;
}

async function getExtensionId() {
  let { extensionId } = await browser.storage.local.get('extensionId');
  if (!extensionId) {
    extensionId = genExtensionId();
    browser.storage.local.set({ extensionId });
  }

  return extensionId;
}

let desktopVersion: string = '';
async function getDesktopVersion() {
  if (!desktopVersion) {
    const { version } = await window.rabbyDesktop.ipcRenderer.invoke('rabbyx:get-app-version')
    desktopVersion = version;
  }

  return desktopVersion;
}

const getParams = async () => {
  const gaParams = new URLSearchParams();

  const pathname = location.hash.substring(2) || 'background';
  const url = `https://${location.host}.com/${pathname}`;

  gaParams.append('action_name', pathname);
  gaParams.append('idsite', '4');
  gaParams.append('rec', '1');
  gaParams.append('url', encodeURI(url));
  gaParams.append('_id', await getExtensionId());
  gaParams.append('rand', nanoid());
  gaParams.append('ca', '1');
  gaParams.append('h', new Date().getUTCHours().toString());
  gaParams.append('m', new Date().getUTCMinutes().toString());
  gaParams.append('s', new Date().getUTCSeconds().toString());
  gaParams.append('cookie', '0');
  gaParams.append('send_image', '0');
  gaParams.append('dimension1', await getDesktopVersion());

  return gaParams;
};

export const matomoRequestEvent = async (data: {
  category: string;
  action: string;
  label?: string;
  value?: number;
  transport?: any;
}) => {
  const params = await getParams();

  if (data.category) {
    params.append('e_c', data.category);
  }

  if (data.action) {
    params.append('e_a', data.action);
  }

  if (data.label) {
    params.append('e_n', data.label);
  }

  if (data.value) {
    params.append('e_v', data.value.toString());
  }

  if (data.transport) {
    params.append('e_i', data.transport);
  }

  try {
    return postData(ANALYTICS_PATH, params);
  } catch (e) {
    // ignore
  }
};
