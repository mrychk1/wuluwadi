import * as mars3d from "mars3d";
import * as Stomp from "stompjs";
// import $ from "jquery";
let colorRamp: mars3d.ColorRamp;
let graphicLayer: mars3d.layer.GraphicLayer; // 矢量图层对象
// let features: any[] = []; // 洪水演进数据
let stompClient: any;
function connect() {
  const socket = new WebSocket("http://localhost:5174/ws"); // 注意：这里应该使用ws://或wss://协议
  stompClient = Stomp.over(socket); // 创建stomp客户端

  // 添加错误处理器
  socket.onerror = function (event) {
    console.error("WebSocket error:", event);
  };
  stompClient.connect({}, onConnected, onError);
}

function onConnected() {
  // stompClient.subscribe("/topic/flood-data", onMessage,function (message:any) {
  //   // 处理接收到的消息
  //   console.log("Received:", message.body);

  // });
  console.log("Connected");
  subscribeToTopic(2000);
  console.log("Connected and subscribed to /subscribe-flood-data");
}

function setConnected(connected: any) {
  const status = connected ? "Connected" : "Not Connected";
}

function onMessage(message: any) {
  console.log("Received data:", message.body);
  // 这里你可以处理接收到的数据，例如显示在页面上
  // 假设message.body是一个JSON字符串，首先将其解析为对象
  let data = JSON.parse(message.body);

  // 删除不需要的头信息
  delete data.destination;
  delete data["content-type"];
  delete data.subscription;
  delete data["message-id"];
  delete data["content-length"];

  // 将更新后的对象转换回JSON字符串（如果loadAndRenderGeoJSON函数需要字符串作为输入）
  let updatedMessageBody = JSON.stringify(data);

  // 使用更新后的消息体
  loadAndRenderGeoJSON(updatedMessageBody);
}

function onError(error: any) {
  console.error("Error connecting to server:", error);
  setConnected(false);
}

function subscribeToTopic(sId: number) {
  // 直接使用传入的 sId 参数
  stompClient.send(
    "/app/subscribe-flood-data",
    {},
    JSON.stringify({ sId: sId })
  );
  stompClient.subscribe("/topic/flood-data", onMessage);
}

// function disconnect() {
//   if (stompClient !== null) {
//     stompClient.disconnect();
//     stompClient.send("/app/unsubscribe-flood-data", {}, "");
//   }
//   setConnected(false);
//   console.log("Disconnected");
// }

// $(function () {
//   connect();

//   // 当页面关闭时自动断开连接
//   window.onbeforeunload = function () {
//     disconnect();
//   };
// });
export function floodEvolution(map: mars3d.Map) {
  connect();
  graphicLayer = new mars3d.layer.GraphicLayer();
  map.addLayer(graphicLayer); // 在layer上绑定监听事件
  // console.log("graphicLayer", graphicLayer);
  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data;
    console.log("单击了合并对象中的单个值为", pickedItem);
  });
  colorRamp = new mars3d.ColorRamp({
    steps: [0, 0.5, 1, 2],
    colors: ["#BDD5F6", "#A2C4F4", "#6E9FF1", "#668FD2"],
  });
}
const floods: mars3d.graphic.PolygonCombine[] = []; // 洪水演进数据
// // 加载洪水数据
async function loadAndRenderGeoJSON(features: any) {
  const instances: any[] = [];
  features.forEach((feature: any) => {
    const coordinates = feature.coordinates;
    // const coordinates = parseGeomYcl(feature.geomYcl);
    // console.log("coordinates",coordinates)
    instances.push({
      positions: coordinates,
      style: {
        color: colorRamp.getColor(feature.totalWate),
      },
      attr: { depth: feature.totalWate },
    });
  });
  // console.log("features", features);
  const graphic = new mars3d.graphic.PolygonCombine({
    instances: instances, // 高亮时的样式
    popup: `深度:{depth}米`,
  });
  graphicLayer.addGraphic(graphic);

  await graphic.readyPromise;

  // 避免闪烁 + 占用内存 综合考虑，保留过渡的graphic
  if (floods.length > 1) {
    const a = floods.shift();
    if (a) {
      a.remove();
    }
  }
  floods.push(graphic);
}


