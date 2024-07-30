// 引入 mars3d 仅用于类型检查，实际在 Worker 中不直接使用 mars3d 对象或方法
// 注意：实际项目中可能需要根据项目配置调整引入方式
import * as mars3d from "mars3d";

self.onmessage = async (e) => {
  const fileIndex = e.data;
  const fileIndex1 = fileIndex.toString().padStart(3, '0');
  const url = `http://localhost:8081/api/flood-data/${fileIndex1}`;
  // 使用 fetch 替代 mars3d.Util.sendAjax 加载数据
  const response = await fetch(url);
  const features = await response.json();

  const instances = features.map((feature: any) => {
    const coordinates = feature.coordinates;
    return {
      positions: coordinates,
      style: {
        // 注意：在 Worker 中不能直接使用 colorRamp.getColor，需要在主线程中处理颜色
        color: feature.totalWate, // 临时存储水位数据，颜色处理留给主线程
      },
      attr: { depth: feature.totalWate },
    };
  });

  // 将处理好的数据发送回主线程
  self.postMessage({ instances });
};