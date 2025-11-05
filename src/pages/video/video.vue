<template>
	<div class="video-container">
		<!-- 顶部导航 -->
		<header class="video-header">
			<button class="back-btn" @click="goBack">
				<i class="icon-arrow-left"></i>
			</button>
			<h3 class="video-title">{{ name }}</h3>
			<span class="video-count">{{ currentIndex + 1 }}/{{ videoList.length }}</span>
		</header>

		<!-- 视频容器 -->
		<div class="video-container-wrapper">
			<button v-if="currentIndex > 0" class="nav-btn prev-btn" @click="prevVideo">
				<i class="icon-arrow-left"></i>
			</button>
			
			<video 
				class="video-player"
				:src="currentVideo.url"
				:title="currentVideo.title"
				controls
				autoplay
				playsinline
				@error="handleVideoError"
			></video>
			
			<button v-if="currentIndex < videoList.length - 1" class="nav-btn next-btn" @click="nextVideo">
				<i class="icon-arrow-right"></i>
			</button>
		</div>

		<!-- 视频错误提示 -->
		<div v-if="videoError" class="video-error">
			<p>⚠️ 视频加载失败</p>
			<button @click="reloadVideo">重新加载</button>
		</div>


		<!-- 切换按钮提示 -->
		<div class="nav-tip">
			<p>点击左右按钮切换视频</p>
		</div>
		
		<!-- 完成学习按钮（第三个视频显示） -->
		<div v-if="currentIndex === 2" class="finish-section">
			<button class="finish-btn" @click="finishLearning">完成学习</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 接收参数
const type = ref(''); // chunk 或 sentence
const id = ref(''); // 语块ID或索引
const name = ref(''); // 语块/句型名称
const videoList = ref([]); // 视频列表
const currentIndex = ref(0); // 当前播放索引
const videoError = ref(false);


onLoad((options) => {
	type.value = options.type;
	id.value = options.id;
	name.value = decodeURIComponent(options.name);
	videoList.value = JSON.parse(decodeURIComponent(options.videos));
	currentIndex.value = parseInt(options.initialIndex) || 0;
});

// 当前播放的视频
const currentVideo = computed(() => videoList.value[currentIndex.value] || {});

// 切换到上一个视频
const prevVideo = () => {
	if (currentIndex.value > 0) {
		currentIndex.value--;
		videoError.value = false;
	}
};

// 切换到下一个视频
const nextVideo = () => {
	if (currentIndex.value < videoList.value.length - 1) {
		currentIndex.value++;
		videoError.value = false;
	}
};

// 视频错误处理
const handleVideoError = () => {
	videoError.value = true;
};

// 重新加载视频
const reloadVideo = () => {
	videoError.value = false;
	const videoElem = uni.createSelectorQuery().select('.video-player');
	videoElem.node(elem => {
		elem.context.load();
		elem.context.play();
	}).exec();
};

// 返回上一页
const goBack = () => {
	uni.navigateBack({ delta: 1 });
};

// 完成学习，跳转到summary页面
const finishLearning = () => {
	uni.navigateTo({
		url: `/pages/summary/summary?type=${type.value}&id=${id.value}&name=${encodeURIComponent(name.value)}&videos=${encodeURIComponent(JSON.stringify(videoList.value))}`
	});
};
</script>

<style scoped>
.video-container {
	min-height: 100vh;
	background-color: #000;
	color: #fff;
}

/* 顶部导航 */
.video-header {
	display: flex;
	align-items: center;
	padding: 16px;
	background-color: #1a1a1a;
}

.back-btn {
	background: transparent;
	border: none;
	color: white;
	font-size: 20px;
	margin-right: 12px;
}

.video-title {
	flex: 1;
	font-size: 17px;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.video-count {
	font-size: 14px;
	color: #ccc;
	margin-left: 12px;
	min-width: 50px;
	text-align: right;
}

/* 视频容器 */
.video-container-wrapper {
	width: 100%;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #000;
	padding: 20px 0;
}

/* 改为竖屏视频比例 */
.video-player {
	width: auto;           /* 不固定宽度 */
	height: 90vh;          /* 竖屏时几乎占满屏幕高度 */
	max-width: 100%;       /* 不超过屏幕宽 */
	aspect-ratio: 9/16;    /* 视频比例改为竖屏 */
	background-color: #000;
	border-radius: 12px;
	object-fit: contain;   /* 保持比例不裁剪 */
}


/* 错误提示 */
.video-error {
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	transform: translateY(-50%);
	text-align: center;
	padding: 20px;
}

.video-error button {
	margin-top: 10px;
	padding: 8px 16px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 4px;
}




/* 图标 */
.icon-arrow-left::before {
	content: "←";
}

.icon-arrow-right::before {
	content: "→";
}

/* 导航按钮 */
.nav-btn {
	position: absolute;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	z-index: 10;
	cursor: pointer;
}

.nav-btn:active {
	background-color: rgba(0, 0, 0, 0.8);
}

.prev-btn {
	left: 20px;
}

.next-btn {
	right: 20px;
}

/* 切换提示 */
.nav-tip {
	padding: 12px;
	text-align: center;
	background-color: #2c2c2c;
}

.nav-tip p {
	font-size: 13px;
	color: #ccc;
	margin: 0;
}

/* 完成学习按钮样式 */
.finish-section {
	padding: 20px;
	display: flex;
	justify-content: center;
}

.finish-btn {
	padding: 12px 40px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 25px;
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
}

.finish-btn:active {
	background-color: #3aa876;
	transform: scale(0.98);
}
</style>