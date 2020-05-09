import { baseUrl, randomImage } from './constants';

export function addHomeImage() {
  const homeImagePlaceholder = document.querySelector('.js-home-img-placeholder');
  const imgEl = new Image();

  imgEl.src = `${baseUrl}${randomImage.name}`;
  imgEl.alt = randomImage.alt;
  imgEl.width = 250;
  imgEl.height = 250;
  imgEl.classList.add('profile-image');

  imgEl.onload = () => {
    imgEl.classList.add('is-loaded');
  }

  homeImagePlaceholder.replaceWith(imgEl);
}
