const videoDiv = document.querySelector('#videoContainer');
const videoElem = document.querySelector('#camera');
const takePictureButton = document.querySelector('#fotoavtryckare-knapp');

const pictureDiv = document.querySelector('#pictureSection');
const canvas = document.querySelector('#picture');
const newPic = document.querySelector('#fotoavtryckareknappNyBild');

const galleryElem = document.querySelector('#gallery');

// kamera och galleri
const ctx = canvas.getContext('2d');
let stream;
let images = [];

let imagesFromStorage = JSON.parse(localStorage.getItem('weddingApp'));
if (imagesFromStorage) {
  images = imagesFromStorage; // letar efter existerande bilder och lägger ihop nya + gamla
} else {
  images = []; // om inga bilder finns lägger vi till våra nya
}

async function cameraStart() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElem.srcObject = stream;
    videoElem.play();
  } catch (error) {
    console.error('Error starting camera:', error);
  }
}
cameraStart();

takePictureButton.addEventListener('click', () => {
  if (!stream) {
    console.error('No camera stream');
    return;
  }
  ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');
  videoDiv.style.display = 'none';
  newPic.style.display = 'flex';
  pictureDiv.style.display = 'flex';
  console.log('image data:', imageData);

  images.push({
    id: images.length,
    image: imageData,
  });
  sendNotif();
  localStorage.setItem('weddingApp', JSON.stringify(images));
});

canvas.addEventListener('click', () => {
  videoElem.style.display = 'flex';
  newPic.style.display = 'flex';
  pictureDiv.style.display = 'none';
});

newPic.addEventListener('click', () => {
  pictureDiv.style.display = 'none'; // göm pictureDiv när vi tar bilden
  newPic.style.display = 'none';
  videoDiv.style.display = 'flex'; // visa videoDiv när vi tar bilden
});

document.getElementById('picture').addEventListener('click', function () {
  // Clear the picture canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Show the video stream again
  videoElem.style.display = 'flex';
  // Hide the picture section
  pictureDiv.style.display = 'none';
});

/*  Notifikation för bild tagen */

var notificationPermission = ''; //spara svaret av notifikationsfrågan.

function notifs() {
  if (!('Notification' in window)) {
    // nekar notifikationer för iphone
    alert('This browser does not support desktop notifications');
    return;
  }
  Notification.requestPermission().then(function (result) {
    // ber om notifikationer
    if (result === 'denied') {
      notificationPermission = 'denied';
      console.log("Permission wasn't granted. Allow a retry.");
      return;
    }
    if (result === 'default') {
      notificationPermission = 'default';
      console.log('The permission request was dismissed.');
      return;
    }
    notificationPermission = 'granted';
    console.log('Permission was granted for notifications');
  });
}

notifs();

function sendNotif() {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Bröllopsfotografen', {
      body: 'Klick! Din bild är nu sparad, klicka här för att se den i galleriet!',
    });

    notification.onclick = function () {
      window.open('https://localhost/gallery.html');
    };
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('../service-worker.js')
      .then(() => {
        console.log('Registered service worker');
      })
      .catch(() => {
        console.log;
      });
  }
}

registerServiceWorker();
