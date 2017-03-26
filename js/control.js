// function clickChangeBg() {
// 	renderer.setClearColor(0xffffff);
// 	renderer.render( scene, camera );
// }


var bgStates = 0;
// function clickChangeBg() {
// 	if (bgStates == 0) {
// 		console.log(bgStates);
// 		bgStates = 1;
// 		renderer.setClearColor(0xffffff);
// 		document.getElementById("btn_change_bg").innerHTM = "关灯";
// 	}
// 	else if (bgStates == 1) {
// 		console.log(bgStates);
// 		bgStates = 0;
// 		renderer.setClearColor(0x000000);
// 		document.getElementById("btn_change_bg").innerHTM = "开灯";

// 	}
// 	renderer.render( scene, camera );
// }

$('canvas').dblclick(function () {
    if (bgStates == 0) {
		console.log(bgStates);
		bgStates = 1;
		renderer.setClearColor(0xffffff);
		document.getElementById("btn_change_bg").innerHTM = "关灯";
	}
	else if (bgStates == 1) {
		console.log(bgStates);
		bgStates = 0;
		renderer.setClearColor(0x000000);
		document.getElementById("btn_change_bg").innerHTM = "开灯";

	}
	renderer.render( scene, camera );
    //双击事件的执行代码
})