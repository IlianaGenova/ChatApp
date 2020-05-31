// var socket = io.connect('http://localhost:3000')


function formatDate(date) {
const h = "0" + date.getHours();
const m = "0" + date.getMinutes();

return `${h.slice(-2)}:${m.slice(-2)}`;
}

// function addNewUser(new_usr) {
// 	var currentUser = new_usr;
// }
//
// function addMessages(message) {
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
//  	}
