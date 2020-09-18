const video = document.getElementById("video");
const status = document.getElementById("status");
const status1 = document.getElementById("status1");
const status2 = document.getElementById("status2");
const start = document.getElementById("start");
var checkUser = false;
var mic;

const status3 = document.getElementById("status3");
const status4 = document.getElementById("status4");
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

start.addEventListener("click", () => {
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  ])
    .then(startVideo)
    .then(predict);
});

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    // var partialface = detections[0].alignedRect._score; 
    //console.log(detections[0].alignedRect._score);
    checkUser = true;
    if (detections.length > 1) {
      status.innerHTML =
        "Annomaly 1 Detected " + detections.length + " user detected";
    }
    if (detections.length == 0) {
      status1.innerHTML = "Annomaly 2 Detected no user detected";
    }
    if (detections.length == 0 && checkUser == true) {
      status2.innerHTML = "Annomaly 3 Detected User has coverd his face";
    }
    // if(partialface > 0.7){
    //   console.log("Annomaly 4 Detected Partial face detected");
    // }
  }, 100);
});
async function predict() {
  const model = await mobilenet.load();
  context.drawImage(video, 0, 0, 500, 500);
  const predictions = await model.classify(canvas);
  console.log(predictions[0].className);
  requestAnimationFrame(predict);
  if (
    predictions[0].className ==
      "cellular telephone, cellular phone, cellphone, cell, mobile phone" ||
    predictions[0].className == "dial telephone, dial phone" ||
    predictions[0].className == "microphone, mike" ||
    predictions[0].className == "laptop, laptop computer" ||
    predictions[0].className == "notebook, notebook computer" ||
    predictions[0].className == "hand-held computer, hand-held microcomputer"
  ) {
    status3.innerHTML = "Annomaly 6 Detected Mobile Phone detected";
  }
}
function setup() {
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  var vol = mic.getLevel();
  if (vol > 0.3) status4.innerHTML = "Annomaly 7 Detected user sound detected";
}
