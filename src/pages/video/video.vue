<template>
	<div class="video-container">
		<!-- 顶部返回导航栏 -->
		<header class="video-header">
			<button class="back-btn" @click="goBack">
				<i class="icon-arrow-left"></i>
			</button>
			<div class="video-title">
				<p>{{ name }}</p>
				<p class="subtitle">第{{ currentIndex + 1 }}/3段视频</p>
			</div>
			<!-- 新增：仅元句型显示句子选择器 -->
			<div v-if="type === 'sentence'" class="sentence-selector">
				<button class="select-btn" @click="toggleSentenceSelect">
					例句 {{ selectedSentenceId }} ▼
				</button>
				<!-- 句子选择下拉菜单 -->
				<div v-if="isSentenceSelectOpen" class="sentence-select-dropdown">
					<div 
						class="select-item" 
						v-for="sid in [1,2,3,4]" 
						:key="sid"
						@click="selectSentence(sid)"
					>
						例句 {{ sid }}
					</div>
				</div>
			</div>
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
				webkit-playsinline="true" 
				x5-playsinline="true" 
				x5-video-player-type="h5" 
				preload="auto"
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
import { ref, computed, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 接收参数
const type = ref(''); // chunk 或 sentence
const id = ref(''); // 语块ID或句型ID（如句型1、句型2）
const name = ref(''); // 语块/句型名称
const videoList = ref([]); // 视频列表
const currentIndex = ref(0); // 当前播放索引
const videoError = ref(false);

// 新增：句型专用状态
const selectedSentenceId = ref(1); // 默认选中句子1
const isSentenceSelectOpen = ref(false); // 句子选择下拉菜单是否展开

// 扩展视频数据映射表：句型类型新增句子1-4的视频
const videoDataMap = {
	chunk: {
		1: [
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "不会做饭 - 视频1" },
			{ url: "http://www.w3school.com.cn/example/html5/mov_bbb.mp4", title: "不会做饭 - 视频2" },
			{ url: "https://www.w3schools.com/html/movie.mp4", title: "不会做饭 - 视频3" }
		],
		2: [
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "来自…… - 视频1" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "来自…… - 视频2" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "来自…… - 视频3" }
		],
		3: [
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可以用来做直播 - 视频1" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可以用来做直播 - 视频2" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可以用来做直播 - 视频3" }
		],
		4: [
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "这么认真 - 视频1" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "这么认真 - 视频2" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "这么认真 - 视频3" }
		],
		5: [
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "特别喜欢教…… - 视频1" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "特别喜欢教…… - 视频2" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "特别喜欢教…… - 视频3" }
		],
		6: [
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "走得太快了 - 视频1" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "走得太快了 - 视频2" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "走得太快了 - 视频3" }
		]
	},
	sentence: {
		// 句型1（对应show.vue中sentenceList的id=1："看看……"）
		1: {
			sentence1: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "看看……-句子1-视频1" },
				{ url: "http://www.w3school.com.cn/example/html5/mov_bbb.mp4", title: "看看……-句子1-视频2" },
				{ url: "https://www.w3schools.com/html/movie.mp4", title: "看看……-句子1-视频3" }
			],
			sentence2: [
				{ url: "https://media.w3.org/2010/05/sintel/trailer.mp4", title: "看看……-句子2-视频1" },
				{ url: "https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209105011F0zPoYzHry.mp4", title: "看看……-句子2-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "看看……-句子2-视频3" }
			],
			sentence3: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "看看……-句子3-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "看看……-句子3-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "看看……-句子3-视频3" }
			],
			sentence4: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "看看……-句子4-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "看看……-句子4-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "看看……-句子4-视频3" }
			]
		},
		// 句型2（对应show.vue中sentenceList的id=2："可惜……"）
		2: {
			sentence1: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子1-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子1-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子1-视频3" }
			],
			sentence2: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子2-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子2-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子2-视频3" }
			],
			sentence3: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子3-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子3-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子3-视频3" }
			],
			sentence4: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子4-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子4-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "可惜……-句子4-视频3" }
			]
		},
		// 其他句型（id=3、4...）按相同格式扩展
		3: {
			sentence1: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子1-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子1-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子1-视频3" }
			],
			sentence2: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子2-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子2-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子2-视频3" }
			],
			sentence3: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子3-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子3-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子3-视频3" }
			],
			sentence4: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子4-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子4-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "太……了！-句子4-视频3" }
			]
		},
		4: {
			sentence1: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子1-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子1-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子1-视频3" }
			],
			sentence2: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子2-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子2-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子2-视频3" }
			],
			sentence3: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子3-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子3-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子3-视频3" }
			],
			sentence4: [
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子4-视频1" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子4-视频2" },
				{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "很高兴……-句子4-视频3" }
			]
		}
	}
};

onLoad((options) => {
	type.value = options.type;
	id.value = options.id;
	name.value = decodeURIComponent(options.itemName);
	currentIndex.value = parseInt(options.initialIndex) || 0;

	// 初始化视频列表
	initVideoList();
});

// 初始化视频列表（根据类型动态加载）
const initVideoList = () => {
	const videoId = parseInt(id.value);
	if (type.value === 'chunk') {
		// 语块：直接加载对应ID的3个视频
		videoList.value = videoDataMap.chunk[videoId] || [
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "默认视频 - 视频1" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "默认视频 - 视频2" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "默认视频 - 视频3" }
		];
	} else if (type.value === 'sentence') {
		// 句型：加载「句型ID + 选中句子ID」对应的3个视频
		const sentenceKey = `sentence${selectedSentenceId.value}`;
		videoList.value = videoDataMap.sentence[videoId]?.[sentenceKey] || [
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "默认视频 - 视频1" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "默认视频 - 视频2" },
			{ url: "https://vjs.zencdn.net/v/oceans.mp4", title: "默认视频 - 视频3" }
		];
	}
};

// 监听选中句子ID变化，重新加载视频列表
watch(selectedSentenceId, () => {
	currentIndex.value = 0; // 切换句子时重置为第一个视频
	videoError.value = false;
	initVideoList();
});

// 当前播放的视频
const currentVideo = computed(() => videoList.value[currentIndex.value] || {});

// 新增：切换句子选择下拉菜单
const toggleSentenceSelect = () => {
	isSentenceSelectOpen.value = !isSentenceSelectOpen.value;
};

// 新增：选择具体句子
const selectSentence = (sid) => {
	selectedSentenceId.value = sid;
	isSentenceSelectOpen.value = false; // 选择后关闭下拉菜单
};

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
const handleVideoError = (e) => {
	videoError.value = true;
	console.error("视频加载失败：", {
		src: currentVideo.url,
		error: e.detail
	});
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
		url: `/pages/summary/summary?type=${type.value}&id=${id.value}&name=${encodeURIComponent(name.value)}&sentenceId=${selectedSentenceId.value}`
	});
};
</script>

<style scoped>
/* 容器整体样式 */
.video-container {
	min-height: 100vh;
	background-color: #000;
	color: #fff;
	display: flex;
	flex-direction: column;
}

/* 顶部返回导航栏样式（新增句子选择器相关样式） */
.video-header {
	background-color: black;
	color: white;
	padding: 16px;
	display: flex;
	align-items: center;
	justify-content: space-between; /* 让标题居中，选择器靠右 */
}

.back-btn {
	background: transparent;
	border: none;
	color: white;
	font-size: 20px;
	margin-right: 12px;
	cursor: pointer;
}

.video-title {
	flex: 1;
	overflow: hidden;
}

.video-title p:first-child {
	font-size: 18px;
	margin: 0 0 4px 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.subtitle {
	font-size: 14px;
	color: #ccc;
	margin: 0;
}

/* 新增：句子选择器样式 */
.sentence-selector {
	position: relative;
	margin-left: 12px;
}

.select-btn {
	background-color: rgba(255, 255, 255, 0.2);
	color: white;
	border: 1px solid white;
	border-radius: 8px;
	padding: 6px 12px;
	font-size: 14px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 4px;
}

.select-btn:active {
	background-color: rgba(66, 185, 131, 0.3);
}

/* 句子选择下拉菜单 */
.sentence-select-dropdown {
	position: absolute;
	top: 100%;
	right: 0;
	margin-top: 8px;
	background-color: #1a1a1a;
	border-radius: 8px;
	width: 120px;
	box-shadow: 0 4px 12px rgba(0,0,0,0.3);
	z-index: 100;
}

.select-item {
	padding: 10px 16px;
	font-size: 14px;
	cursor: pointer;
	transition: background-color 0.2s;
}

.select-item:hover {
	background-color: #2c2c2c;
	color: #42b983;
}

.select-item:first-child {
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
}

.select-item:last-child {
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
}

/* 视频容器 */
.video-container-wrapper {
	flex: 1;
	width: 100%;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #000;
	padding: 10px;
	box-sizing: border-box;
}

/* 竖屏视频核心样式 */
.video-player {
	width: auto;
	height: 80vh;
	max-width: 90%;
	aspect-ratio: 9/16;
	background-color: #000;
	border-radius: 12px;
	object-fit: cover;
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
	z-index: 20;
}

.video-error p {
	font-size: 16px;
	margin: 0 0 12px 0;
}

.video-error button {
	padding: 10px 24px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	cursor: pointer;
}

/* 图标样式 */
.icon-arrow-left::before {
	content: "←";
}

.icon-arrow-right::before {
	content: "→";
}

/* 左右导航按钮 */
.nav-btn {
	position: absolute;
	background-color: rgba(0, 0, 0, 0.7);
	color: white;
	border: none;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	z-index: 10;
	cursor: pointer;
	backdrop-filter: blur(2px);
}

.nav-btn:active {
	background-color: rgba(66, 185, 131, 0.9);
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
	background-color: #1a1a1a;
	border-top: 1px solid #333;
}

.nav-tip p {
	font-size: 13px;
	color: #ccc;
	margin: 0;
}

/* 完成学习按钮样式 */
.finish-section {
	padding: 20px 0 30px 0;
	display: flex;
	justify-content: center;
	background-color: #1a1a1a;
}

.finish-btn {
	padding: 14px 48px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 30px;
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
	box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.finish-btn:active {
	background-color: #3aa876;
	transform: scale(0.98);
}

/* 响应式适配 */
@media (max-height: 600px) {
	.video-player {
		height: 75vh;
	}
	.finish-btn {
		padding: 12px 36px;
		font-size: 15px;
	}
}

/* 小屏设备下拉菜单适配 */
@media (max-width: 375px) {
	.select-btn {
		font-size: 13px;
		padding: 4px 10px;
	}
	.sentence-select-dropdown {
		width: 100px;
	}
	.select-item {
		padding: 8px 12px;
		font-size: 13px;
	}
}
</style>