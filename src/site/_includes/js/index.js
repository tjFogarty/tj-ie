import '../css/manifest.css';
import(/* webpackChunkName: "instant-page" */'instant.page');

const homeImagePlaceholder = document.querySelector('.js-home-img-placeholder');

if (homeImagePlaceholder) {
  import(/* webpackChunkName: "hero-image" */'./hero-image').then(({ addHomeImage }) => {
    addHomeImage();
  });
}
