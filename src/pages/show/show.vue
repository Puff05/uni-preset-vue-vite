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
			<!-- 章节信息 -->
			<div class="chapter-detail">
				<h3>章节信息</h3>
				<ul class="detail-list">
					<li>
						<span class="label">书籍ID：</span>
						<span class="value">{{ bookId }}</span>
					</li>
					<li>
						<span class="label">章节索引：</span>
						<span class="value">{{ parseInt(chapterIndex) + 1 }}</span>
					</li>
				</ul>
			</div>

			<!-- 元句型句式 -->
			<div class="content-block">
				<h3 class="block-title">一、元句型句式</h3>
				<div class="block-desc">
					<p>点击句型查看相关视频（每个句型包含3个视频）</p>
				</div>
				<div class="content-list" v-if="sentenceList.length">
					<div 
						class="list-item clickable" 
						v-for="(item, index) in sentenceList" 
						:key="index"
						@click="goToVideo('sentence', index, item)"
					>
						<span class="item-tag">{{ index + 1 }}</span>
						<span class="item-content">{{ item.pattern }}</span>
						<i class="icon-arrow-right"></i>
					</div>
				</div>
				<p class="empty-tip" v-else>暂无句型数据</p>
			</div>

			<!-- 表达语块 -->
			<div class="content-block">
				<h3 class="block-title">二、表达语块</h3>
				<div class="block-desc">
					<p>点击语块查看相关视频（每个语块包含3个视频）</p>
				</div>
				<div class="content-list" v-if="chunkList.length">
					<div 
						class="list-item clickable" 
						v-for="(item, index) in chunkList" 
						:key="index"
						@click="goToVideo('chunk', index, item)"
					>
						<span class="item-tag">{{ index + 1 }}</span>
						<span class="item-content">{{ item.name }}</span>
						<i class="icon-arrow-right"></i>
					</div>
				</div>
				<p class="empty-tip" v-else>暂无语块数据</p>
			</div>
		</main>

		<!-- 底部返回按钮 -->
		<footer class="show-footer">
			<button class="back-to-list" @click="goBackToList">返回章节列表</button>
		</footer>
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

// 章节内容映射表 - 根据章节标题提供不同内容
const chapterContents = {
	"第一课 最佳人选": {
		chunks: [
			{ 
				id:1,
				name: "不会做饭", 
				videos: [
					{ id: 1, url: "/static/videos/chunk1-1.mp4", title: "优秀候选人-场景应用" },
					{ id: 2, url: "/static/videos/chunk1-2.mp4", title: "优秀候选人-近义词辨析" },
					{ id: 3, url: "/static/videos/chunk1-3.mp4", title: "优秀候选人-实战练习" }
				]
			},
			{ 
				id:2,
				name: "来自……", 
				videos: [
					{ id: 4, url: "/static/videos/chunk2-1.mp4", title: "核心竞争力-概念解析" },
					{ id: 5, url: "/static/videos/chunk2-2.mp4", title: "核心竞争力-提升方法" },
					{ id: 6, url: "/static/videos/chunk2-3.mp4", title: "核心竞争力-案例分析" }
				]
			},
			{ 
				id:3,
				name: "可以用来做直播", 
				videos: [
					{ id: 7, url: "/static/videos/chunk3-1.mp4", title: "脱颖而出-关键要素" },
					{ id: 8, url: "/static/videos/chunk3-2.mp4", title: "脱颖而出-实践技巧" },
					{ id: 9, url: "/static/videos/chunk3-3.mp4", title: "脱颖而出-成功案例" }
				]
			},
			{ 
				id:4,
				name: "这么认真", 
				videos: [
					{ id: 10, url: "/static/videos/chunk4-1.mp4", title: "脱颖而出-关键要素" },
					{ id: 11, url: "/static/videos/chunk4-2.mp4", title: "脱颖而出-实践技巧" },
					{ id: 12, url: "/static/videos/chunk4-3.mp4", title: "脱颖而出-成功案例" }
				]
			},
			{ 
				id:5,
				name: "特别喜欢教……", 
				videos: [
					{ id: 13, url: "/static/videos/chunk5-1.mp4", title: "脱颖而出-关键要素" },
					{ id: 14, url: "/static/videos/chunk5-2.mp4", title: "脱颖而出-实践技巧" },
					{ id: 15, url: "/static/videos/chunk5-3.mp4", title: "脱颖而出-成功案例" }
				]
			},
			{ 
				id:6,
				name: "走得太快了", 
				videos: [
					{ id: 16, url: "/static/videos/chunk6-1.mp4", title: "脱颖而出-关键要素" },
					{ id: 17, url: "/static/videos/chunk6-2.mp4", title: "脱颖而出-实践技巧" },
					{ id: 18, url: "/static/videos/chunk6-3.mp4", title: "脱颖而出-成功案例" }
				]
			},
			{ 
				id:7,
				name: "当然可以", 
				videos: [
					{ id: 19, url: "/static/videos/chunk7-1.mp4", title: "脱颖而出-关键要素" },
					{ id: 20, url: "/static/videos/chunk7-2.mp4", title: "脱颖而出-实践技巧" },
					{ id: 21, url: "/static/videos/chunk7-3.mp4", title: "脱颖而出-成功案例" }
				]
			},
			{ 
				id:8,
				name: "举办一个迎新晚会", 
				videos: [
					{ id: 22, url: "/static/videos/chunk8-1.mp4", title: "迎新活动-关键要素" },
					{ id: 23, url: "/static/videos/chunk8-2.mp4", title: "迎新活动-实践技巧" },
					{ id: 24, url: "/static/videos/chunk8-3.mp4", title: "迎新活动-成功案例" }
				]
			},
			{ 
				id:9,
				name: "出一个节目", 
				videos: [
					{ id: 25, url: "/static/videos/chunk9-1.mp4", title: "节目表演-关键要素" },
					{ id: 26, url: "/static/videos/chunk9-2.mp4", title: "节目表演-实践技巧" },
					{ id: 27, url: "/static/videos/chunk9-3.mp4", title: "节目表演-成功案例" }
				]
			},
			{ 
				id:10,
				name: "精准控制", 
				videos: [
					{ id: 28, url: "/static/videos/chunk10-1.mp4", title: "精准控制-关键要素" },
					{ id: 29, url: "/static/videos/chunk10-2.mp4", title: "精准控制-实践技巧" },
					{ id: 30, url: "/static/videos/chunk10-3.mp4", title: "精准控制-成功案例" }
				]
			},
			{ 
				id:11,
				name: "正确的选择", 
				videos: [
					{ id: 31, url: "/static/videos/chunk11-1.mp4", title: "正确选择-策划要点" },
					{ id: 32, url: "/static/videos/chunk11-2.mp4", title: "正确选择-流程设计" },
					{ id: 33, url: "/static/videos/chunk11-3.mp4", title: "正确选择-执行技巧" }
				]
			},
			{ 
				id:12,
				name: "最合适的人", 
				videos: [
					{ id: 34, url: "/static/videos/chunk12-1.mp4", title: "团队合作-角色分工" },
					{ id: 35, url: "/static/videos/chunk12-2.mp4", title: "团队合作-沟通技巧" },
					{ id: 36, url: "/static/videos/chunk12-3.mp4", title: "团队合作-冲突化解" }
				]
			},
			{ 
				id:13,
				name: "最佳人选", 
				videos: [
					{ id: 37, url: "/static/videos/chunk13-1.mp4", title: "节目表演-节目选择" },
					{ id: 38, url: "/static/videos/chunk13-2.mp4", title: "节目表演-排练技巧" },
					{ id: 39, url: "/static/videos/chunk13-3.mp4", title: "节目表演-舞台表现" }
				]
			},
			{ 
				id:14,
				name: "代表中国风貌", 
				videos: [
					{ id: 40, url: "/static/videos/chunk14-1.mp4", title: "舞台控制-灯光配合" },
					{ id: 41, url: "/static/videos/chunk14-2.mp4", title: "舞台控制-音效选择" },
					{ id: 42, url: "/static/videos/chunk14-3.mp4", title: "舞台控制-节奏把握" }
				]
			},
			{ 
				id:15,
				name: "很有道理", 
				videos: [
					{ id: 43, url: "/static/videos/chunk15-1.mp4", title: "观众互动-开场破冰" },
					{ id: 44, url: "/static/videos/chunk15-2.mp4", title: "观众互动-提问技巧" },
					{ id: 45, url: "/static/videos/chunk15-3.mp4", title: "观众互动-气氛调动" }
				]
			},
			{ 
				id:16,
				name: "聊一聊（聊聊）", 
				videos: [
					{ id: 46, url: "/static/videos/chunk16-1.mp4", title: "现场应变-突发状况" },
					{ id: 47, url: "/static/videos/chunk16-2.mp4", title: "现场应变-快速调整" },
					{ id: 48, url: "/static/videos/chunk16-3.mp4", title: "现场应变-补救措施" }
				]
			}
		],
		sentences: [
			{ 
				id:1,
				pattern: "看看……", 
				videos: [
					{ id: 1, url: "/static/videos/sent1-1.mp4", title: "我认为...是最佳人选-基础用法" },
					{ id: 2, url: "/static/videos/sent1-2.mp4", title: "我认为...是最佳人选-语气变化" },
					{ id: 3, url: "/static/videos/sent1-3.mp4", title: "我认为...是最佳人选-场景拓展" }
				]
			},
			{ 
				id:2,
				pattern: "可惜……", 
				videos: [
					{ id: 4, url: "/static/videos/sent2-1.mp4", title: "...在...方面很有经验-基础用法" },
					{ id: 5, url: "/static/videos/sent2-2.mp4", title: "...在...方面很有经验-进阶表达" },
					{ id: 6, url: "/static/videos/sent2-3.mp4", title: "...在...方面很有经验-场景应用" }
				]
			},
			{ 
				id:3,
				pattern: "太……了！", 
				videos: [
					{ id: 7, url: "/static/videos/sent3-1.mp4", title: "...具有很强的...能力-基础用法" },
					{ id: 8, url: "/static/videos/sent3-2.mp4", title: "...具有很强的...能力-近义词辨析" },
					{ id: 9, url: "/static/videos/sent3-3.mp4", title: "...具有很强的...能力-实践练习" }
				]
			},
			{ 
				id:4,
				pattern: "很高兴……", 
				videos: [
					{ id: 10, url: "/static/videos/sent4-1.mp4", title: "……是……的-基础用法" },
					{ id: 11, url: "/static/videos/sent4-2.mp4", title: "……是……的-语气变化" },
					{ id: 12, url: "/static/videos/sent4-3.mp4", title: "……是……的-场景拓展" }
				]
			},
			{ 
				id:5,
				pattern: "欢迎加入……", 
				videos: [
					{ id: 13, url: "/static/videos/sent5-1.mp4", title: "……可以……-基础用法" },
					{ id: 14, url: "/static/videos/sent5-2.mp4", title: "……可以……-语气变化" },
					{ id: 15, url: "/static/videos/sent5-3.mp4", title: "……可以……-场景拓展" }
				]
			},
			{ 
				id:6,
				pattern: "不但……，……也一样", 
				videos: [
					{ id: 16, url: "/static/videos/sent6-1.mp4", title: "……应该……-基础用法" },
					{ id: 17, url: "/static/videos/sent6-2.mp4", title: "……应该……-语气变化" },
					{ id: 18, url: "/static/videos/sent6-3.mp4", title: "……应该……-场景拓展" }
				]
			},
			{ 
				id:7,
				pattern: "可以……吗？", 
				videos: [
					{ id: 19, url: "/static/videos/sent7-1.mp4", title: "……需要……-基础用法" },
					{ id: 20, url: "/static/videos/sent7-2.mp4", title: "……需要……-语气变化" },
					{ id: 21, url: "/static/videos/sent7-3.mp4", title: "……需要……-场景拓展" }
				]
			},
			{ 
				id:8,
				pattern: "巴不得……", 
				videos: [
					{ id: 22, url: "/static/videos/sent8-1.mp4", title: "……必须……-基础用法" },
					{ id: 23, url: "/static/videos/sent8-2.mp4", title: "……必须……-语气变化" },
					{ id: 24, url: "/static/videos/sent8-3.mp4", title: "……必须……-场景拓展" }
				]
			},
			{ 
				id:9,
				pattern: "尝尝……", 
				videos: [
					{ id: 25, url: "/static/videos/sent9-1.mp4", title: "……最好……-基础用法" },
					{ id: 26, url: "/static/videos/sent9-2.mp4", title: "……最好……-语气变化" },
					{ id: 27, url: "/static/videos/sent9-3.mp4", title: "……最好……-场景拓展" }
				]
			},
			{ 
				id:10,
				pattern: "我觉得……", 
				videos: [
					{ id: 28, url: "/static/videos/sent10-1.mp4", title: "……不如……-基础用法" },
					{ id: 29, url: "/static/videos/sent10-2.mp4", title: "……不如……-语气变化" },
					{ id: 30, url: "/static/videos/sent10-3.mp4", title: "……不如……-场景拓展" }
				]
			},
			{ 
				id:11,
				pattern: "让我……", 
				videos: [
					{ id: 31, url: "/static/videos/sent11-1.mp4", title: "……比……-基础用法" },
					{ id: 32, url: "/static/videos/sent11-2.mp4", title: "……比……-语气变化" },
					{ id: 33, url: "/static/videos/sent11-3.mp4", title: "……比……-场景拓展" }
				]
			},
			{ 
				id:12,
				pattern: "非得……", 
				videos: [
					{ id: 34, url: "/static/videos/sent12-1.mp4", title: "……和……一样-基础用法" },
					{ id: 35, url: "/static/videos/sent12-2.mp4", title: "……和……一样-语气变化" },
					{ id: 36, url: "/static/videos/sent12-3.mp4", title: "……和……一样-场景拓展" }
				]
			},
			{ 
				id:13,
				pattern: "要不……", 
				videos: [
					{ id: 37, url: "/static/videos/sent13-1.mp4", title: "……越……越……-基础用法" },
					{ id: 38, url: "/static/videos/sent13-2.mp4", title: "……越……越……-语气变化" },
					{ id: 39, url: "/static/videos/sent13-3.mp4", title: "……越……越……-场景拓展" }
				]
			},
			{ 
				id:14,
				pattern: "跟……关系不大", 
				videos: [
					{ id: 40, url: "/static/videos/sent14-1.mp4", title: "……一边……一边……-基础用法" },
					{ id: 41, url: "/static/videos/sent14-2.mp4", title: "……一边……一边……-语气变化" },
					{ id: 42, url: "/static/videos/sent14-3.mp4", title: "……一边……一边……-场景拓展" }
				]
			}
		]
	},
	"第二课 登台之前": {
		chunks: [
			{ 
				name: "充分准备", 
				description: "在重要活动前做好全面准备",
				videos: [
					{ id: 19, url: "/static/videos/chunk4-1.mp4", title: "充分准备-重要性" },
					{ id: 20, url: "/static/videos/chunk4-2.mp4", title: "充分准备-方法步骤" },
					{ id: 21, url: "/static/videos/chunk4-3.mp4", title: "充分准备-实战演练" }
				]
			},
			{ 
				name: "紧张情绪", 
				description: "面对重要场合时的心理状态",
				videos: [
					{ id: 22, url: "/static/videos/chunk5-1.mp4", title: "紧张情绪-产生原因" },
					{ id: 23, url: "/static/videos/chunk5-2.mp4", title: "紧张情绪-识别方法" },
					{ id: 24, url: "/static/videos/chunk5-3.mp4", title: "紧张情绪-应对策略" }
				]
			},
			{ 
				name: "自信心态", 
				description: "相信自己能够成功的积极心态",
				videos: [
					{ id: 25, url: "/static/videos/chunk6-1.mp4", title: "自信心态-培养方法" },
					{ id: 26, url: "/static/videos/chunk6-2.mp4", title: "自信心态-自我暗示" },
					{ id: 27, url: "/static/videos/chunk6-3.mp4", title: "自信心态-成功案例" }
				]
			}
		],
		sentences: [
			{ 
				pattern: "在...之前，我需要...", 
				example: "在演讲之前，我需要做充分的准备。",
				videos: [
					{ id: 28, url: "/static/videos/sent4-1.mp4", title: "在...之前，我需要...-基础用法" },
					{ id: 29, url: "/static/videos/sent4-2.mp4", title: "在...之前，我需要...-时间表达" },
					{ id: 30, url: "/static/videos/sent4-3.mp4", title: "在...之前，我需要...-场景应用" }
				]
			},
			{ 
				pattern: "虽然...，但我相信...", 
				example: "虽然有点紧张，但我相信自己能够做好。",
				videos: [
					{ id: 31, url: "/static/videos/sent5-1.mp4", title: "虽然...，但我相信...-转折用法" },
					{ id: 32, url: "/static/videos/sent5-2.mp4", title: "虽然...，但我相信...-情感表达" },
					{ id: 33, url: "/static/videos/sent5-3.mp4", title: "虽然...，但我相信...-场景拓展" }
				]
			},
			{ 
				pattern: "深呼吸可以帮助...", 
				example: "深呼吸可以帮助缓解紧张情绪。",
				videos: [
					{ id: 34, url: "/static/videos/sent6-1.mp4", title: "深呼吸可以帮助...-功能描述" },
					{ id: 35, url: "/static/videos/sent6-2.mp4", title: "深呼吸可以帮助...-方法示范" },
					{ id: 36, url: "/static/videos/sent6-3.mp4", title: "深呼吸可以帮助...-效果展示" }
				]
			}
		]
	},
	"默认内容": {
		chunks: [
			{ 
				name: "表达技巧", 
				videos: [
					{ id: 100, url: "/static/videos/chunk-default-1.mp4", title: "表达技巧-基础训练" },
					{ id: 101, url: "/static/videos/chunk-default-2.mp4", title: "表达技巧-进阶提升" },
					{ id: 102, url: "/static/videos/chunk-default-3.mp4", title: "表达技巧-实战应用" }
				]
			},
			{ 
				name: "有效沟通", 
				videos: [
					{ id: 103, url: "/static/videos/chunk-default-4.mp4", title: "有效沟通-倾听技巧" },
					{ id: 104, url: "/static/videos/chunk-default-5.mp4", title: "有效沟通-表达方法" },
					{ id: 105, url: "/static/videos/chunk-default-6.mp4", title: "有效沟通-反馈技巧" }
				]
			},
			{ 
				name: "语言运用", 
				videos: [
					{ id: 106, url: "/static/videos/chunk-default-7.mp4", title: "语言运用-准确表达" },
					{ id: 107, url: "/static/videos/chunk-default-8.mp4", title: "语言运用-简洁表达" },
					{ id: 108, url: "/static/videos/chunk-default-9.mp4", title: "语言运用-生动表达" }
				]
			}
		],
		sentences: [
			{ 
				pattern: "我们可以用...来表达", 
				videos: [
					{ id: 109, url: "/static/videos/sent-default-1.mp4", title: "我们可以用...来表达-基础用法" },
					{ id: 110, url: "/static/videos/sent-default-2.mp4", title: "我们可以用...来表达-多样表达" },
					{ id: 111, url: "/static/videos/sent-default-3.mp4", title: "我们可以用...来表达-场景应用" }
				]
			},
			{ 
				pattern: "在...场合，适合使用...", 
				videos: [
					{ id: 112, url: "/static/videos/sent-default-4.mp4", title: "在...场合，适合使用...-场合判断" },
					{ id: 113, url: "/static/videos/sent-default-5.mp4", title: "在...场合，适合使用...-语言选择" },
					{ id: 114, url: "/static/videos/sent-default-6.mp4", title: "在...场合，适合使用...-实例分析" }
				]
			},
			{ 
				pattern: "通过...可以更好地...", 
				videos: [
					{ id: 115, url: "/static/videos/sent-default-7.mp4", title: "通过...可以更好地...-方法描述" },
					{ id: 116, url: "/static/videos/sent-default-8.mp4", title: "通过...可以更好地...-效果表达" },
					{ id: 117, url: "/static/videos/sent-default-9.mp4", title: "通过...可以更好地...-应用技巧" }
				]
			}
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

// 跳转至视频播放页
const goToVideo = (type, index, item) => {
	uni.navigateTo({
		url: `/pages/video/video?` +
			`type=${type}` +
			`&id=${encodeURIComponent(item.id || index)}` + // 对于chunk和sentence都优先使用item.id
			`&name=${encodeURIComponent(type === 'chunk' ? item.name : item.pattern)}` +
			`&videos=${encodeURIComponent(JSON.stringify(item.videos))}` +
			`&initialIndex=0` // 默认从第一个视频开始播放
	});
};

// 返回逻辑
const goBack = () => uni.navigateBack({ delta: 1 });
const goBackToList = () => uni.navigateBack({ delta: 1 });
</script>

<style scoped>
	/* 全局容器 */
	.show-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		color: #333;
		position: relative;
		padding-bottom: 70px;
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

	/* 章节信息 */
	.chapter-detail {
		background-color: white;
		border-radius: 10px;
		padding: 16px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		margin-bottom: 16px;
	}

	.chapter-detail h3 {
		font-size: 16px;
		margin-bottom: 12px;
		color: #42b983;
	}

	.detail-list {
		list-style: none;
	}

	.detail-list li {
		display: flex;
		padding: 8px 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.detail-list li:last-child {
		border-bottom: none;
	}

	.label {
		width: 80px;
		font-size: 14px;
		color: #666;
	}

	.value {
		flex: 1;
		font-size: 14px;
		color: #333;
	}

	/* 内容区块（语块+句型） */
	.content-block {
		background-color: white;
		border-radius: 10px;
		padding: 16px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		margin-bottom: 16px;
	}

	.block-title {
		font-size: 16px;
		color: #2c3e50;
		margin-bottom: 8px;
		padding-bottom: 8px;
		border-bottom: 1px solid #f0f0f0;
	}

	.block-desc {
		font-size: 14px;
		color: #666;
		margin-bottom: 12px;
		line-height: 1.5;
	}

	/* 内容列表 */
	.content-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.list-item {
		background-color: #f8f9fa;
		border-radius: 6px;
		padding: 12px;
		position: relative;
		padding-left: 36px;
	}

	.item-tag {
		position: absolute;
		left: 12px;
		top: 12px;
		width: 20px;
		height: 20px;
		background-color: #42b983;
		color: white;
		border-radius: 50%;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item-content {
		font-size: 15px;
		color: #333;
		font-weight: 500;
	}


	/* 空数据提示 */
	.empty-tip {
		font-size: 14px;
		color: #999;
		text-align: center;
		padding: 20px 0;
	}

	/* 底部按钮 */
	.show-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: white;
		padding: 12px 16px;
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
	}

	.back-to-list {
		width: 100%;
		padding: 12px 0;
		background-color: #42b983;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.back-to-list:hover {
		background-color: #359e6d;
	}

	/* 图标样式 */
	.icon-arrow-left::before {
		content: "←";
	}
    .clickable {
	cursor: pointer;
	transition: background-color 0.2s;
}
.clickable:hover {
	background-color: #f0f5f0;
}
.icon-arrow-right {
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: #999;
	font-size: 16px;
}
.icon-arrow-right::before {
	content: "→";
}
</style>