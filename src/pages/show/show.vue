<template>
	<div class="show-container">
		<!-- 顶部导航 -->
		<header class="show-header">
			<button class="back-btn" @click="goBack">
				<i class="icon-arrow-left"></i>
			</button>
			<div class="header-title">
				<h2>{{ chapterTitle }}</h2>
				<p>《{{ bookTitle }}》第{{ parseInt(chapterIndex) + 1 }}章</p>
			</div>
		</header>

		<!-- 核心内容区 -->
		<main class="show-content">

			<!-- 元句型句式 -->
		<div class="content-block">
			<h3 class="block-title clickable" @click="toggleSentenceVisibility">
				<span class="title-icon sentence-icon">📝</span>
				元句型句式
				<span class="toggle-icon" :class="{ 'expanded': isSentenceVisible }">
					{{ isSentenceVisible ? '▼' : '▶' }}
				</span>
			</h3>
			<div v-if="isSentenceVisible" class="block-content">
				<div class="block-desc">
					<p>点击句型查看相关视频，掌握实用表达技巧</p>
				</div>
				<div class="content-list" v-if="sentenceList.length">
					<div 
						class="list-item clickable sentence-item" 
						v-for="(item, index) in sentenceList" 
						:key="index"
						@click="goToVideo('sentence', item.id, item.pattern, chapterTitle, bookTitle)"
					>
						<span class="chapter-number">{{ (index + 1).toString().padStart(2, '0') }}</span>
						<div class="item-content-wrapper">
							<span class="item-content">{{ item.pattern }}</span>
						</div>
					</div>
				</div>
				<p class="empty-tip" v-else>暂无句型数据</p>
			</div>
		</div>

		<!-- 表达语块 -->
		<div class="content-block">
			<h3 class="block-title clickable" @click="toggleChunkVisibility">
				<span class="title-icon chunk-icon">🔤</span>
				表达语块
				<span class="toggle-icon" :class="{ 'expanded': isChunkVisible }">
					{{ isChunkVisible ? '▼' : '▶' }}
				</span>
			</h3>
			<div v-if="isChunkVisible" class="block-content">
				<div class="block-desc">
					<p>点击语块查看相关视频，积累实用表达素材</p>
				</div>
				<div class="content-list" v-if="chunkList.length">
					<div 
						class="list-item clickable chunk-item" 
						v-for="(item, index) in chunkList" 
						:key="index"
						@click="goToVideo('chunk', item.id, item.name, chapterTitle, bookTitle)"
					>
						<span class="chapter-number">{{ (index + 1).toString().padStart(2, '0') }}</span>
						<div class="item-content-wrapper">
							<span class="item-content">{{ item.name }}</span>
						</div>
					</div>
				</div>
				<p class="empty-tip" v-else>暂无语块数据</p>
			</div>
		</div>
		</main>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'

// 接收参数
const bookId = ref('');
const bookTitle = ref('');
const chapterIndex = ref('');
const chapterTitle = ref('');
const chunkList = ref([]); // 表达语块列表
const sentenceList = ref([]); // 元句型列表

// 控制显示/隐藏状态
const isChunkVisible = ref(false);
const isSentenceVisible = ref(false);

// 切换显示状态
const toggleChunkVisibility = () => {
  isChunkVisible.value = !isChunkVisible.value;
};

const toggleSentenceVisibility = () => {
  isSentenceVisible.value = !isSentenceVisible.value;
};

// 章节内容映射表 - 只保留基础信息，不包含视频数据
const chapterContents = {
	"第一课 最佳人选": {
		chunks: [
			{ id: 1, name: "不会做饭" },
			{ id: 2, name: "来自……" },
			{ id: 3, name: "可以用来做直播" },
			{ id: 4, name: "这么认真" },
			{ id: 5, name: "特别喜欢教……" },
			{ id: 6, name: "走得太快了" },
			{ id: 7, name: "当然可以" },
			{ id: 8, name: "举办一个迎新晚会" },
			{ id: 9, name: "出一个节目" },
			{ id: 10, name: "精准控制" },
			{ id: 11, name: "正确的选择" },
			{ id: 12, name: "最合适的人" },
			{ id: 13, name: "最佳人选" },
			{ id: 14, name: "代表中国风貌" },
			{ id: 15, name: "很有道理" },
			{ id: 16, name: "聊一聊（聊聊）" }
		],
		sentences: [
			{ id: 1, pattern: "看看……" },
			{ id: 2, pattern: "可惜……" },
			{ id: 3, pattern: "太……了！" },
			{ id: 4, pattern: "很高兴……" },
			{ id: 5, pattern: "欢迎加入……" },
			{ id: 6, pattern: "不但……，……也一样" },
			{ id: 7, pattern: "可以……吗？" },
			{ id: 8, pattern: "巴不得……" },
			{ id: 9, pattern: "尝尝……" },
			{ id: 10, pattern: "我觉得……" },
			{ id: 11, pattern: "让我……" },
			{ id: 12, pattern: "非得……" },
			{ id: 13, pattern: "要不……" },
			{ id: 14, pattern: "跟……关系不大" }
		]
	},
	"第二课 登台之前": {
		chunks: [
			{ id: 1, name: "充分准备" },
			{ id: 2, name: "紧张情绪" },
			{ id: 3, name: "自信心态" }
		],
		sentences: [
			{ id: 1, pattern: "在...之前，我需要..." },
			{ id: 2, pattern: "虽然...，但我相信..." },
			{ id: 3, pattern: "深呼吸可以帮助..." }
		]
	},
	"默认内容": {
		chunks: [
			{ id: 1, name: "表达技巧" },
			{ id: 2, name: "有效沟通" },
			{ id: 3, name: "语言运用" }
		],
		sentences: [
			{ id: 1, pattern: "我们可以用...来表达" },
			{ id: 2, pattern: "在...场合，适合使用..." },
			{ id: 3, pattern: "通过...可以更好地..." }
		]
	}
};

onLoad((options) => {
	// 解析参数
	bookId.value = options.bookId;
	bookTitle.value = decodeURIComponent(options.bookTitle);
	chapterIndex.value = options.chapterIndex;
	chapterTitle.value = decodeURIComponent(options.chapterTitle);

	// 根据章节标题获取对应的内容
	const chapterContent = chapterContents[chapterTitle.value] || chapterContents["默认内容"];
	chunkList.value = chapterContent.chunks;
	sentenceList.value = chapterContent.sentences;
});

// 跳转至视频播放页 - 只传递必要参数（不需要传递视频数据）
const goToVideo = (type, itemId, itemName, chapterTitle, bookTitle) => {
	uni.navigateTo({
		url: `/pages/video/video?` +
			`type=${type}` +
			`&id=${itemId}` + // 这里从 itemId 改为 id，与 video.vue 接收的参数名匹配
			`&itemName=${encodeURIComponent(itemName)}` +
			`&chapterTitle=${encodeURIComponent(chapterTitle)}` +
			`&bookTitle=${encodeURIComponent(bookTitle)}` +
			`&initialIndex=0`
	});
};

// 返回逻辑
const goBack = () => uni.navigateBack({ delta: 1 });
</script>

<style scoped>
	/* 样式保持不变 */
	.show-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		color: #333;
		position: relative;
	}

	/* 顶部导航 */
	.show-header {
		background-color: #42b983;
		color: white;
		padding: 16px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.back-btn {
		background: transparent;
		border: none;
		color: white;
		font-size: 20px;
		margin-right: 12px;
		cursor: pointer;
	}

	.header-title {
		flex: 1;
		overflow: hidden;
	}

	.header-title h2 {
		font-size: 18px;
		margin-bottom: 4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.header-title p {
		font-size: 12px;
		opacity: 0.9;
	}

	/* 主内容区 */
	.show-content {
		padding: 16px;
	}

	/* 内容区块（语块+句型） */
	.content-block {
		background-color: white;
		border-radius: 12px;
		padding: 0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
		margin-bottom: 20px;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.block-title {
		font-size: 18px;
		color: #2c3e50;
		padding: 16px 20px;
		margin: 0;
		border-bottom: 1px solid #f5f5f5;
		position: relative;
		cursor: pointer;
		user-select: none;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.title-icon {
		font-size: 20px;
		width: 24px;
		text-align: center;
	}

	.sentence-icon {
		color: #4299e1;
	}

	.chunk-icon {
		color: #9f7aea;
	}

	.toggle-icon {
		position: absolute;
		right: 20px;
		top: 50%;
		transform: translateY(-50%);
		color: #718096;
		transition: all 0.2s ease;
		font-size: 16px;
	}

	.toggle-icon.expanded {
		transform: translateY(-50%) rotate(180deg);
		color: #42b983;
	}

	.block-content {
		padding: 20px;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.block-desc {
		font-size: 14px;
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
		padding-left: 4px;
		border-left: 3px solid #e8f4f8;
	}

	.block-desc p {
		margin: 0;
	}

	/* 内容列表 */
	.content-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.list-item {
		border-radius: 8px;
		padding: 16px;
		position: relative;
		display: flex;
		align-items: center;
		transition: all 0.2s ease;
		overflow: hidden;
	}

	.list-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.sentence-item {
		border: 1px solid #e8f4f8;
	}

	.sentence-item::before {
		background-color: #4299e1;
	}

	.chunk-item {
		border: 1px solid #fdf2f8;
	}

	.chunk-item::before {
		background-color: #9f7aea;
	}

	.item-content-wrapper {
		flex: 1;
		min-width: 0;
	}

	.item-content {
		font-size: 16px;
		color: #2d3748;
		font-weight: 600;
		display: block;
	}

	/* 空数据提示 */
	.empty-tip {
		font-size: 14px;
		color: #999;
		text-align: center;
		padding: 30px 0;
		margin: 0;
		background-color: #fafafa;
		border-radius: 8px;
	}

	/* 图标样式 */
	.icon-arrow-left::before {
		content: "←";
	}

	.clickable {
		cursor: pointer;
	}

	.chapter-number {
		padding-top: 4px;
		font-size: 18px;
		font-weight: 700;
		color: #42b983;
		flex-shrink: 0;
		font-family: 'Arial', sans-serif;
		margin-right: 12px;
	}

	/* 响应式调整 */
	@media (max-width: 375px) {
		.block-title {
			font-size: 17px;
			padding: 14px 16px;
		}

		.block-content {
			padding: 16px;
		}

		.item-content {
			font-size: 15px;
		}
	}
</style>