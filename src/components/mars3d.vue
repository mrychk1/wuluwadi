<template>
    <div id="mars3dContainer" class="mars3d-container">
        <Nav />
    </div>

</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as mars3d from "mars3d";
import Nav from "./nav.vue";
import { setMap } from "./mapStore"; // 引入setMap函数

onMounted(() => {
    const mapOptions = {
        scene: {
            center: {"lat":37.320731,"lng":79.67273,"alt":150000.2,"heading":342.8,"pitch":-90},
            // center: { lat: 31.548343, lng: 104.372096, alt: 8226.5, heading: 342.8, pitch: -43.1 }
            
            fxaa:true, // 开启fxaa抗锯齿
            webgl:{
                // alpha: true, // 是否支持webgl透明
                antialias: true, // 是否开启抗锯齿
                // preserveDrawingBuffer: true, // 是否保存绘图缓冲区
                // failIfMajorPerformanceCaveat: false, // 如果性能不好是否显示警告
            },
            boolean:true, // 是否开启地球光照
        },
        terrain: {
            url: "//data.mars3d.cn/terrain",
            show: true
        },
        basemaps: [{ name: "天地图", type: "tdt", layer: "img_d", show: true }],
    };
    const map = new mars3d.Map("mars3dContainer", mapOptions);
    setMap(map); // 存储地图实例
});
</script>

<style>
.mars3d-container {
    width: 100%;
    height: 100%;
    position: relative;
}
.mars3d-divlayer {
    position: absolute;
    top:65px;
    left:25px;
    color: aliceblue;
    /* background-color: rgba(0, 0, 0, 0.5); */
}
</style>
