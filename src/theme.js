export function createTheme(group) {
  const media = matchMedia('(prefers-color-scheme: dark)');
  const buttons = [...group.querySelectorAll('[data-theme-choice]')];
  let choice = 'system';
  function update() {
    document.documentElement.dataset.theme = choice === 'system' ? (media.matches ? 'dark' : 'light') : choice;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.themeChoice === choice));
  }
  media.addEventListener('change', update);
  for (const button of buttons) button.addEventListener('click', () => { choice = button.dataset.themeChoice; update(); });
  update();
}
