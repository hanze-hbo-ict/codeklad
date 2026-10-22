export function createTheme(select) {
  const media = matchMedia('(prefers-color-scheme: dark)');
  const update = () => {
    document.documentElement.dataset.theme = select.value === 'system' ? (media.matches ? 'dark' : 'light') : select.value;
  };
  media.addEventListener('change', update);
  select.addEventListener('change', update);
  update();
}
