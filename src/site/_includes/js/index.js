import '../css/manifest.css';
import(/* webpackChunkName: "instant-page" */'instant.page');

(() => {
  const searchButton = document.querySelector('#search');
  const canFetch = 'fetch' in window;

  if (searchButton && canFetch) {
    searchButton.classList.remove('hidden');

    searchButton.addEventListener('click', async () => {
      const { default: lunr } = await import(/* webpackChunkName: "lunr-search" */'lunr');

      const documents = [{ name: 'Svelte', title: 'Svelte Doc', text: 'Something here'}, { name: 'Vue', text: 'more stuff'}];
      const idx = lunr(function () {
        this.ref('name')
        this.field('title')
        this.field('text')

        documents.forEach((doc) => {
          this.add(doc)
        })
      })
      console.log(idx.search('svelte'))
      console.log(idx.search('som'))
    });
  }
})();
