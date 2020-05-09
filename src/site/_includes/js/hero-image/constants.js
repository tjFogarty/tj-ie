export const baseUrl = 'https://res.cloudinary.com/dab4jaczr/image/upload/c_thumb,w_300,h_300,f_auto/v1588932756/homepage/';

export const images = [{
  name: 'plane.jpg',
  alt: 'Ryanair plane'
}, {
  name: 'loki-1.jpg',
  alt: 'Cat sitting beside a monitor'
}, {
  name: 'ares.jpg',
  alt: 'Cat sitting and looking at the camera'
}, {
  name: 'birds.jpg',
  alt: 'Birds taking off from some trees'
}, {
  name: 'minnie.jpg',
  alt: 'Kitten looking into the camera'
}, {
  name: 'loki-2.jpg',
  alt: 'Cat sitting on a mantle piece'
}];

export const randomImage = images[Math.floor(Math.random() * images.length)];
