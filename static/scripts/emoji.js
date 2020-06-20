// var EmojiButton = require('@joeattardi/emoji-button');
// import EmojiButton from '@joeattardi/emoji-button'

// window.addEventListener('DOMContentLoaded', () => {
//   // button.addEventListener('click', () => {
//   //   console.log("hacker");
// 	// event.stopPropagation();
//   //   picker.togglePicker(button);
//   // });
// });

const button = document.getElementById("emoji");
const picker = new EmojiButton({
  theme: 'auto',
  position: 'bottom-end'
});

picker.on('emoji', emoji => {
  document.getElementById("input").value += emoji;
});

function Emoji() {
	picker.togglePicker(event.target)
}
