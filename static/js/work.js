var call;
var ownpeerid;
var connection;

var peer = new Peer();

peer.on("open", function (id) {
  ManageOnlineOffline(id);

  $("ownpeerid").html(id);
  ownpeerid = id;
  $(".after").show();
});

function ManageOnlineOffline(peer_id) {
  var roomsRef = firebase
    .database()
    .ref("users/rooms/" + room_id + "/users/" + peer_id);

  var connectedRef = firebase.database().ref(".info/connected");
  connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
      var con = roomsRef.push();

      con.onDisconnect().remove();
      con.set(true);
    }
  });
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

$("#callBtn").click(function () {
  var input_peerid = $("#input_peerid").val();
  connectPeer(input_peerid);
});

function connectPeer(peer_id) {
  connection = peer.connect(peer_id, { reliable: true });
  connection.on("open", function () {
    connection.on("data", function (data) {
      console.log("Received", data);
    });
  });
}

peer.on("connection", function (connection) {
  connection.on("data", function (data) {
    if (data.type == "progress_info") {
      if (data.msg == 100) {
        $(".drop-area").show();
        $(".stats-area").hide();
      }
      $("#progress").html(data.msg + "%");
      $("#speed").html(data.speed + "");

      $(".progress-bar-fill").attr("style", "width:" + data.msg + "%");
    }
    if (data.file_name) {
      handleData(data);
      $("#filename-text").html(data.file_name);
    }
  });
});

function sendMsg(msg) {
  connection.send(msg);
}

var chunkLength = 1000 * 6000,
  file_size,
  file_name;
$("#sendFileBtn").click(function () {
  var file = document.getElementById("fileinput").files[0];
  file_name = file.name;
  file_size = file.size;
  sliceandsend(file);
});

function sliceandsend(file) {
  var fileSize = file.size;
  var name = file.name;
  var mime = file.type;
  var chunkSize = 64 * 1024;
  var offset = 0;

  function readchunk(first) {
    var data = {};

    data.file_name = file_name;
    data.file_size = file_size;
    var r = new FileReader();
    var blob = file.slice(offset, chunkSize + offset);
    r.onload = function (evt) {
      if (!evt.target.error) {
        offset += chunkSize;
        $("#filetransfer-text").html("Uploading");
        $(".drop-area").hide();
        $(".stats-area").show();
        $("#filename-text").html(file_name);

        if (offset >= fileSize) {
          data.message = evt.target.result;
          data.last = true;
          data.mime = mime;
          connection.send(data);

          return;
        } else {
          data.message = evt.target.result;
          data.last = false;
          data.mime = mime;
          connection.send(data);
          //con.send(evt.target.result);
        }
      } else {
        return;
      }
      readchunk();
    };
    r.readAsArrayBuffer(blob);
  }
  readchunk(Math.ceil(fileSize / chunkSize));
}

function onReadAsDataURL(event, text) {
  var data = {};

  data.file_name = file_name;
  data.file_size = file_size;
  if (event) text = event.target.result;

  if (text.length > chunkLength) {
    data.message = text.slice(0, chunkLength);
  } else {
    data.message = text;
    data.last = true;
  }

  connection.send(data);

  var remainingDataURL = text.slice(data.message.length);
  if (remainingDataURL.length)
    setTimeout(function () {
      onReadAsDataURL(null, remainingDataURL);
    }, 50);
}

var receivedSize = 0;
var recProgress = 0;
var arrayToStoreChunks = [];
var counterBytes = 0;
function handleData(data) {
  $("#filetransfer-text").html("Downloading");
  $(".drop-area").hide();
  $(".stats-area").show();

  receivedSize += data.message.byteLength;
  counterBytes = counterBytes + receivedSize;
  recProgress = (receivedSize / data.file_size) * 100;
  recProgress = parseFloat(recProgress + "").toFixed(2);

  if (!data.last) {
    $("#progress").html(recProgress + "%");

    $(".progress-bar-fill").attr("style", "width:" + recProgress + "%");
  }

  arrayToStoreChunks.push(data.message);

  if (recProgress > 0) {
    var speed = formatBytes(counterBytes / 1000, 2) + "/s";
    var sdata = {};
    sdata.type = "progress_info";
    sdata.msg = recProgress;
    sdata.speed = speed;
    sendMsg(sdata);
  }
  if (data.last) {
    setTimeout(function () {
      $("#progress").html(100 + "%");

      $(".progress-bar-fill").attr("style", "width:" + 100 + "%");
    }, 100);

    setTimeout(function () {
      $(".drop-area").show();
      $(".stats-area").hide();

      var sdata = {};
      sdata.type = "progress_info";
      sdata.msg = 100;
      sdata.speed = 0;

      sendMsg(sdata);
    }, 500);

    const received = new Blob(arrayToStoreChunks);
    downloadBuffer(
      URL.createObjectURL(received),
      data.file_name,
      data.file_size,
      data.mime
    );
    arrayToStoreChunks = [];
    recProgress = 0;
    receivedSize = 0;
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

var totalBytesSpeed = 0;
var i = 0;
setInterval(function () {
  if (i % 10 == 0) {
    $("#speed").html(formatBytes(counterBytes / 1000, 2) + "/s");
  }
  if (counterBytes / 1000 > 0) {
    totalBytesSpeed += counterBytes / 1000;
    $(".speedlogs").html(formatBytes(counterBytes / 1000, 2) + "/s<br>");
  }
  counterBytes = 0;
  i++;
}, 100);

function downloadBuffer(fileUrl, fileName, fileSize, mime) {
  $("msglist").append(
    '<a download="' +
      fileName +
      '" href="' +
      fileUrl +
      '">' +
      fileName +
      "(" +
      fileSize / 1000 +
      "KB)</a>"
  );
}

function saveToDisk(fileUrl, fileName, fileSize, mime) {
  $("msglist").append(
    '<a download="' +
      fileName +
      '" href="' +
      fileUrl +
      '">' +
      fileName +
      "(" +
      fileSize / 1000 +
      "KB)</a>"
  );

  var save = document.createElement("a");
  save.href = fileUrl;
  save.target = "_blank";
  save.download = fileName || fileUrl;

  var event = document.createEvent("Event");
  event.initEvent("click", true, true);

  save.dispatchEvent(event);
  (window.URL || window.webkitURL).revokeObjectURL(save.href);
}

function encode(input) {
  var keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN;
    chr3 = i < input.length ? input[i++] : Number.NaN;

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
