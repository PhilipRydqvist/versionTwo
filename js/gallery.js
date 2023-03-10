const galleryElem = document.querySelector('#gallery');

const images = JSON.parse(localStorage.getItem('weddingApp')); // läggs utanför alla funktioner för att allt skall kunna nå denna

//Hämtar från localstorage
function createImage(image) {
  const div = document.createElement('div'); // detta gör vi för att samla bild med sin tillhörande knapp, se nedan.
  div.setAttribute('divImageGallery', div.id);
  const imageElem = document.createElement('img');
  imageElem.setAttribute('src', image.image);

  //skapar knapp för att ta bort bilder
  const deleteButton = document.createElement('button'); // skapar knappen = behövs ej göras ngt i HTML filen.
  deleteButton.innerHTML = 'X'; // detta gör att knappen inte är tom utan får ett stort 'X' i den.
  deleteButton.classList.add('deleteButton');
  deleteButton.addEventListener('click', () => {
    console.log('picture deleted');

    div.remove(); // tar bort knappen efter att bilden raderas
    console.log(image);
    console.log(images);
    let newArr = images.filter(
      (
        imageInFilter //inageInFilter = går igenom alla bilders ID när dom raderas. Alla bilder vi vill behålla ligger i newArr
      ) => image.image != imageInFilter.image //Jag vill inte behålla den bilden jag just tog bort
    );
    console.log(newArr);
    localStorage.setItem('weddingApp', JSON.stringify(newArr));
  });

  div.append(imageElem); //Lägger in i galleriet
  div.append(deleteButton); // Lägger till deleteButton/knappen
  galleryElem.append(div);
}

function getImages() {
  for (const image of images) {
    createImage(image);
  }
}

getImages();
