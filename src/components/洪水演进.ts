import * as mars3d from "mars3d"; // 从mars3d库导入所有内容

let colorRamp: mars3d.ColorRamp; // 定义颜色渐变变量
let graphicLayer: mars3d.layer.GraphicLayer; // 定义矢量图层对象变量
let floods: mars3d.graphic.PolygonCombine[] = []; // 定义存储洪水演进数据的数组
// 定义洪水演进函数，接受一个mars3d地图对象作为参数
export function floodEvolution(map: mars3d.Map, year: number) {
  graphicLayer = new mars3d.layer.GraphicLayer(); // 实例化矢量图层
  map.addLayer(graphicLayer); // 将矢量图层添加到地图上
  graphicLayer.on(mars3d.EventType.click, function (event) {
    // 监听图层点击事件
    const pickedItem = event.pickedObject?.data; // 获取点击的对象数据
    console.log("单击了合并对象中的单个值为", pickedItem); // 打印点击的对象数据
  });
  
  switch (year) {
    case 2000:
      colorRamp = new mars3d.ColorRamp({
        steps: [0, 0.5, 1, 2],
        colors: ["#BDD5F6", "#A2C4F4", "#6E9FF1", "#668FD2"],
      });
      
      const intervalId = setInterval(async () => {
        // 设置定时器，每50毫秒执行一次
        progressValue++; // 进度加1
        if (progressValue < 578) {
          // 如果进度小于578
          await loadAndRenderGeoJSON(progressValue, year); // 加载并渲染GeoJSON数据
        } else {
          // 如果进度达到或超过578
          clearInterval(intervalId); // 清除定时器
          alert("洪水演进结束"); // 弹出洪水演进结束提示
        }
      }, 50); // 定时器间隔设置为50毫秒
      break;
    case 1000:
      colorRamp = new mars3d.ColorRamp({
        steps: [0, 0.5, 1, 2],
        colors: ["#F6BDDD", "#F4A2C4", "#F16E9F", "#D2668F"],
      });
      break;
    case 500:
      colorRamp = new mars3d.ColorRamp({
        steps: [0, 0.5, 1, 2],
        colors: ["#BDF6BD", "#A2F4A2", "#6EF16E", "#66D266"],
      });
      break;
    case 200:
      colorRamp = new mars3d.ColorRamp({
        steps: [0, 0.5, 1, 2],
        colors: ["#F6F6BD", "#F4F4A2", "#F1F16E", "#D2D266"],
      });
      break;
  }
  let progressValue = 0; // 初始化当前进度为0
  const intervalId = setInterval(async () => {
    // 设置定时器，每50毫秒执行一次
    progressValue++; // 进度加1
    if (progressValue < 578) {
      // 如果进度小于578
      await loadAndRenderGeoJSON(progressValue, year); // 加载并渲染GeoJSON数据
    } else {
      // 如果进度达到或超过578
      clearInterval(intervalId); // 清除定时器
      alert("洪水演进结束"); // 弹出洪水演进结束提示
    }
  }, 50); // 定时器间隔设置为50毫秒
}

// 定义加载并渲染GeoJSON数据的异步函数，接受文件索引作为参数
async function loadAndRenderGeoJSON(fileIndex: number, year: number) {
  console.log("加载洪水数据fileIndex", fileIndex); // 打印当前加载的文件索引
  let fileIndex1 = fileIndex.toString().padStart(3, "0"); // 将文件索引格式化为至少三位数，不足部分用0填充
  const url = `http://localhost:8081/api/flood-data/${fileIndex1}/${year}`; // 构造请求URL
  const features = await mars3d.Util.sendAjax({ url }); // 使用mars3d工具发送请求获取数据
  const instances = features.map((feature: any) => ({
    // 将获取的数据映射为图形实例
    positions: feature.coordinates, // 设置图形的坐标
    style: {
      color: colorRamp.getColor(feature.totalWate), // 根据洪水量设置图形的颜色
    },
  }));
  const graphic = new mars3d.graphic.PolygonCombine({
    // 实例化多边形组合图形
    vertexCacheOptimize: true, // 启用顶点缓存优化
    instances: instances, // 设置图形实例
  });
  graphicLayer.addGraphic(graphic); // 将图形添加到图层
  await graphic.readyPromise; // 等待图形准备就绪
  manageFloods(graphic); // 管理洪水图形
}

// 定义管理洪水图形的函数，接受一个多边形组合图形作为参数
function manageFloods(graphic: mars3d.graphic.PolygonCombine) {
  if (floods.length > 1) {
    // 如果洪水数据数组长度大于1
    const removedGraphic = floods.shift(); // 移除并获取数组中的第一个图形
    removedGraphic?.remove(); // 移除该图形
  }
  floods.push(graphic); // 将当前图形添加到数组中
}
