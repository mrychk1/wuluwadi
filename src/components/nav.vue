<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">Processing Center</el-menu-item>
        <el-sub-menu index="2">
            <template #title>Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
                <template #title>item four</template>
                <el-menu-item index="2-4-1">item one</el-menu-item>
                <el-menu-item index="2-4-2">item two</el-menu-item>
                <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3" disabled>Info</el-menu-item>
        <el-menu-item @click="handlefloodEvolution2000">2000年洪水演进</el-menu-item>
        <el-menu-item @click="handlefloodEvolution1000">1000年洪水演进</el-menu-item>
        <el-menu-item @click="handlefloodEvolution500">500年洪水演进</el-menu-item>
        <el-menu-item @click="handlefloodEvolution200">200年洪水演进</el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { floodEvolution } from "./洪水演进";
import { getMap } from "./mapStore"; // 引入getMap函数
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
// 定义洪水演进的处理函数
const handlefloodEvolution2000 = () => {
    const map = getMap(); // 获取地图实例
    if (map) {
        floodEvolution(map,2000);
    }
}
const handlefloodEvolution1000 = () => {
    const map = getMap(); // 获取地图实例
    if (map) {
        floodEvolution(map,1000);
    }
}
const handlefloodEvolution500 = () => {
    const map = getMap(); // 获取地图实例
    if (map) {
        floodEvolution(map,500);
    }
}
const handlefloodEvolution200 = () => {
    const map = getMap(); // 获取地图实例
    if (map) {
        floodEvolution(map,200);
    }
}
onMounted(() => {
    // 如果需要在组件挂载时执行特定逻辑，可以在这里添加
})
</script>
<style scoped>
/* 样式保持不变 */
</style>