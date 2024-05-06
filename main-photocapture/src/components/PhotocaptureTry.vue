<template>
	<div class="d-flex justify-center flex-column" style="background-color: azure;">
		<div class="title" style="background-color: red;">
			<p class="d-flex justify-center">ID Detection Dasboard</p>
		</div>
		<div class="flip-horizontal" style="background-color: antiquewhite; position: relative;">
			<div>
				<video id="video" autoplay></video>
			</div>
			<div class="crop-area"
				:style="{ width: cropWidth + 'px', height: cropHeight + 'px', left: cropX + 'px', top: cropY + 'px' }">
			</div>
		</div>
		<div class="">
			<div style="background-color: azure;">
				<canvas class="marginarea" ref="canvas"></canvas>
			</div>
			<button id="startbutton" @click="takePicture">Take Picture</button>
			<button class="mr-2 ml-2" id="startbutton" @click="clearPicture">Clear Picture</button>
			<button id="startbutton" @click="sendPicture">Send Picture</button>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { converBase64ToImage } from 'convert-base64-to-image'

function baseToImage(stringBase, fileName) {
	// Split the base64 string
	const parts = stringBase.split(';base64,');
	const fileType = parts[0].split(':')[1];
	const byteCharacters = atob(parts[1]);

	// Convert to byte array
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);

	// Create Blob object
	const blob = new Blob([byteArray], { type: fileType });

	// Create File object
	const file = new File([blob], fileName, { type: fileType });
	return file;
}

export default {
	data() {
		return {
			width: 620,
			height: 340,
			streaming: false,
			photoUrl: "",
			dataUrl: "",

			cropWidth: 250,
			cropHeight: 160,
			cropX: 350,
			cropY: 160,

			finalName: "",
			finalData: "",
			globalDate: "",
			dataGet: []

		};
	},
	mounted() {
		this.startup();
		this.getdata();
		this.getGlobalComp();
	},

	methods: {
		startup() {
			const video = document.getElementById("video");
			const photo = document.getElementById("photo");
			const videoConstraintEditor = document.getElementById("videoConstraintEditor");
			console.log(videoConstraintEditor);
			const canvas = this.$refs.canvas;

			const constraints = {
				video: {
					width: { ideal: this.width },
					height: { ideal: this.height },
					facingMode: { exact: "user" },
				},
				audio: false
			};
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then((stream) => {
					video.srcObject = stream;
					video.play();
				})
				.catch((err) => {
					console.error(`An error occurred: ${err}`);
				});

			video.addEventListener("canplay", () => {
				if (!this.streaming) {
					video.setAttribute("width", this.width);
					video.setAttribute("height", this.height);
					canvas.width = this.cropWidth;
					canvas.height = this.cropHeight;
					this.streaming = true;
				}
			});
		},

		takePicture() {
			const video = document.getElementById("video");
			const canvas = this.$refs.canvas;
			const context = canvas.getContext("2d");
			if (canvas && context && video) {
				context.drawImage(
					video,
					this.cropX,
					this.cropY,
					this.cropWidth,
					this.cropHeight,
					0,
					0,
					this.cropWidth,
					this.cropHeight
				);
				const data = canvas.toDataURL();
				if (data) {
					this.photoUrl = data;
					// const globalId = Math.ceil(Math.random() * 1000000)
					// this.finalName = globalId + this.globalDate;
					this.finalData = baseToImage(this.photoUrl, this.globalDate);
					console.log(this.finalData);
				}
			}
			this.getGlobalComp();
		},
		clearPicture() {
			const canvas = this.$refs.canvas;
			if (canvas) {
				const context = canvas.getContext("2d");
				if (context) {
					context.fillStyle = "azure";
					context.fillRect(0, 0, this.width, this.height);
					const data = canvas.toDataURL("image/png");
					if (data) {
						this.photoUrl = data;
					}
				}
			}
		},
		getdata() {
			try {
				const response = axios.get('http://localhost:3000/files');
				const dataGet = response.data;
				console.log(dataGet);
			} catch (error) {
				console.error('Error fetching data', error);
			}
		},
		async sendPicture() {
			if (this.photoUrl) {
				const formData = new FormData();
				formData.append('file', this.finalData);
				try {
					await axios.post('http://localhost:3000/upload', formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					});
					console.log("upload succes!");
				} catch (error) {
					console.error('Error:', error);
				}

			} else {
				console.error('No picture data available');
			}
		},
		getGlobalComp() {
			const globalDate = new Date().toDateString();
			const dateSplit = globalDate.split(" ");
			let finalDate = "";
			for (let i = 0; i < dateSplit.length; i++) {
				finalDate += dateSplit[i];
			}
			this.globalDate = finalDate;
		}
	}
};
</script>

<style scoped>
.crop-area {
	border: 2px solid rgba(255, 0, 0, 0.5);
	position: absolute;
	pointer-events: none;
	margin: 0;
}

.marginarea {
	border: 2px solid rgba(0, 0, 0, 0.5);
}

.fullscreen {
	width: 100vw;
	height: 100vh;
}

.flip-horizontal {
	transform: scaleX(-1);
}
</style>