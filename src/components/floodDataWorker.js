self.onmessage = async function(event) {
    const { url } = event.data;
    // 假设 mars3d.Util.sendAjax 已经在这个上下文中可用或者使用其他方式加载数据
    const features = await mars3d.Util.sendAjax({ url });
    const instances = []; // 数据处理逻辑...
    // 处理完成，发送回主线程
    self.postMessage({ instances });
  };
  