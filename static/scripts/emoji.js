EmojiButton = require('@joeattardi/emoji-button');

window.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById(emoji);
  const picker = new EmojiButton({
    theme: 'auto',
    position: 'bottom-end'
  });

  picker.on('emoji', emoji => {
    document.getElementById(input).value += emoji;
  });

  button.addEventListener('click', () => {
    console.log("hacker");
    picker.togglePicker(button);
  });
});  