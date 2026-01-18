const SERVICE_WORKER_FILE_PATH = "./sw.js";

export function notificationUnsupported() {
  let unsupported = false;
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('showNotification' in ServiceWorkerRegistration.prototype)
  ) {
    unsupported = true;
  }
  return unsupported;
}

export async function registerAndSubscribe(
  onSubscribe
) {
  try {
    console.log("register")
    await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
    await subscribe(onSubscribe);
  } catch (e) {
    console.error('Failed to register service-worker: ', e);
  }
}

async function subscribe(onSubscribe) {
  navigator.serviceWorker.ready
    .then((registration) => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
    })
    .then((subscription) => {
      console.info('Created subscription Object: ', subscription.toJSON());

      submitSubscription(subscription).then(_ => {
        onSubscribe(subscription);
      });
    })
    .catch(e => {
      console.error('Failed to subscribe cause of: ', e);
    });
}

async function submitSubscription(subscription) {
  const endpointUrl = '/api/web-push/subscription';

  const phone = localStorage.getItem("phone") || "+919876543210"
  const res = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription, phone }),
  });
  const result = await res.json();
}

export function checkPermissionStateAndAct(
  onSubscribe
) {
  const state = Notification.permission;
  switch (state) {
    case 'denied':
      break;
    case 'granted':
      registerAndSubscribe(onSubscribe);
      break;
    case 'default':
      break;
  }
}

export async function sendWebPush({ title, body, image, icon, url }) {
  const endPointUrl = '/api/web-push/send';
  const phone = localStorage.getItem("phone") || "+919876543210"

  const pushBody = {
    phone,
    notification: {
      title,
      body,
      image,
      icon,
      url,
    }
  };
  const res = await fetch(endPointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pushBody),
  });
  const result = await res.json();
  return result
}