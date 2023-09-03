const mediaSelector = document.getElementById("media");

const webCamContainer =
	document.getElementById("web-cam-container");

let selectedMedia = null;

let elements = [];


mediaSelector.addEventListener("change", (e) => {


	selectedMedia = e.target.value;

	document.getElementById(
		`${selectedMedia}-recorder`)
			.style.display = "block";

	document.getElementById(
			`${otherRecorderContainer(
			selectedMedia)}-recorder`)
		.style.display = "none";
});

function otherRecorderContainer(
	selectedMedia) {

	return selectedMedia === "vid" ?
		"aud" : "vid";
}


const audioMediaConstraints = {
	audio: true,
	video: false,
};


const videoMediaConstraints = {

	audio: true,
	video: true,
};


function startRecording(
	thisButton, otherButton) {

	navigator.mediaDevices.getUserMedia(
		selectedMedia === "vid" ?
		videoMediaConstraints :
		audioMediaConstraints)
		.then((mediaStream) => {

	
		const mediaRecorder =
			new MediaRecorder(mediaStream);
	
		window.mediaStream = mediaStream;
	
		window.mediaRecorder = mediaRecorder;

		mediaRecorder.start();

		mediaRecorder.ondataavailable = (e) => {

			elements.push(e.data);
		};

	
		mediaRecorder.onstop = () => {

			
			const blob = new Blob(
				elements, {
					type: selectedMedia === "vid" ?
						"video/mp4" : "audio/mpeg"
				});
			elements = [];

			
			const recordedMedia = document.createElement(
				selectedMedia === "vid" ? "video" : "audio");
			recordedMedia.controls = true;

			const recordedMediaURL = URL.createObjectURL(blob);

		
			recordedMedia.src = recordedMediaURL;


			const downloadButton = document.createElement("a");


			downloadButton.download = "Recorded-Media";

			downloadButton.href = recordedMediaURL;
			downloadButton.innerText = "Download it!";

			downloadButton.onclick = () => {

			
				URL.revokeObjectURL(recordedMedia);
			};

			document.getElementById(
				`${selectedMedia}-recorder`).append(
				recordedMedia, downloadButton);
		};

		if (selectedMedia === "vid") {

			webCamContainer.srcObject = mediaStream;
		}

		document.getElementById(
				`${selectedMedia}-record-status`)
				.innerText = "Recording";

		thisButton.disabled = true;
		otherButton.disabled = false;
	});
}

function stopRecording(thisButton, otherButton) {

	window.mediaRecorder.stop();
	window.mediaStream.getTracks()
	.forEach((track) => {
		track.stop();
	});

	document.getElementById(
			`${selectedMedia}-record-status`)
			.innerText = "Recording done!";
	thisButton.disabled = true;
	otherButton.disabled = false;
}
