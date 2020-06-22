// const socket = io('http://localhost:3000');


$("msger-inputarea").submit(function(e){
  e.preventDefault();
});

socket.on('sendCurrentUser', addNewUser);

// var currentUser = 'Me';
// socket.on('message', addMessages)
// // socket.on('new_usr', addNewUser)
// socket.on('sendCurrentUser', addNewUser);

// socket.on('sendCurrentUser', function(data) {
//     currentUser = data.text;
//     console.log(data.text);
// });
//
// function addNewUser(new_usr) {
// 	console.log("da be")
// 	currentUser = new_usr;
// 	console.log(currentUser)
// }

// function addMessages(message) {
// 	console.log("da be 2")
// 	console.log(currentUser);
// 	console.log(message);
// 	var side = 'right';
// 	if (message.sender_id == currentUser.id) side = 'left';
// 	// $("#messages").append(
// 	const messageHTML =
// 		`
// 		<div class="msg ${side}-msg">
// 			<div class="msg-img" style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"></div>
// 				<div class="msg-bubble">
// 					<div class="msg-info">
// 						<div class="msg-info-time"> ${formatDate(message.date)} </div>
// 					</div>
// 					<div class="msg-text"> ${message.content} </div>
// 				</div>
// 			</div>
// 		</div>
// 		`
//
// 		msgerChat.insertAdjacentHTML("beforeend", msgHTML);
// 		msgerChat.scrollTop += 500;
// }


// const Message = get('./static/models/message.js');
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [
"Hi, how are you?",
"Ohh... I can't understand what you trying to say. Sorry!",
"I like to play games... But I don't know how to play!",
"Sorry if my answers are not relevant. :))",
"I feel sleepy! :("
];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "Name";
// const PERSON_NAME = currentUser.username;

msgerForm.addEventListener("submit", event => {
event.preventDefault();

const msgText = msgerInput.value;
if (!msgText) return;

// addMessageToBD(msgText);

// socket.on('ismessage', data => {
//   console.log(data)
// });

//
// appendMessage(PERSON_IMG, "right", msgText);
// msgerInput.value = "";

botResponse();
});
//
// function appendMessage(img, side, text) {
// //   Simple solution for small apps
// const msgHTML =
// `<div class="msg ${side}-msg">
//     <div class="msg-img" style="background-image: url(${img})"></div>
//
//     <div class="msg-bubble">
//       <div class="msg-info">
//         <div class="msg-info-time">${formatDate(new Date())}</div>
//       </div>
//
//       <div class="msg-text">${text}</div>
//     </div>
//   </div>
// `;
//
//
// msgerChat.insertAdjacentHTML("beforeend", msgHTML);
// msgerChat.scrollTop += 500;
// }

function botResponse() {
const r = random(0, BOT_MSGS.length - 1);
const msgText = BOT_MSGS[r];
const delay = msgText.split(" ").length * 100;

// setTimeout(() => {
//   appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
// }, delay);
}

function addMessageToBD(msgText) {

}

// Utils
function get(selector, root = document) {
return root.querySelector(selector);
}

function formatDate(date) {
const h = "0" + date.getHours();
const m = "0" + date.getMinutes();

return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
return Math.floor(Math.random() * (max - min) + min);
}
