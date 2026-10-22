export function createTheme(button) {
  const media = matchMedia('(prefers-color-scheme: dark)');
  const choices = ['system', 'light', 'dark'];
  let choice = 'system';
  function update() {
    document.documentElement.dataset.theme = choice === 'system' ? (media.matches ? 'dark' : 'light') : choice;
    button.dataset.themeChoice = choice;
    const next = choices[(choices.indexOf(choice) + 1) % choices.length];
    const description = `${choice[0].toUpperCase() + choice.slice(1)} appearance. Switch to ${next} appearance`;
    button.setAttribute('aria-label', description);
    button.title = description;
    for (const icon of button.querySelectorAll('[data-theme-icon]')) icon.toggleAttribute('hidden', icon.dataset.themeIcon !== choice);
  }
  media.addEventListener('change', update);
  button.addEventListener('click', () => { choice = choices[(choices.indexOf(choice) + 1) % choices.length]; update(); });
  update();
}
