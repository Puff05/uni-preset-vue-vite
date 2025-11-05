<template>
	<div class="summary-container">
		<!-- 顶部导航 -->
		<header class="summary-header">
			<button class="back-btn" @click="goBack">
				<i class="icon-arrow-left"></i>
			</button>
			<h3 class="summary-title">学习总结</h3>
			<div class="header-right"></div>
		</header>

		<!-- 学习内容总结 -->
		<div class="summary-content">
			<!-- 学习进度卡片 -->
			<div class="progress-card">
				<h4>🎉 学习完成</h4>
				<div class="progress-info">
					<p>本次学习内容：{{ contentType }} - {{ contentName }}</p>
					<p>学习视频数：{{ videoCount }} 个</p>
					<p>完成时间：{{ currentTime }}</p>
				</div>
			</div>

			<!-- 学习内容详情 -->
			<div class="content-card">
				<h4>📚 学习内容详情</h4>
				<div v-if="type === 'chunk' || type === 'sentence'" class="dialogue-section">
					<h5>💬 相关对话</h5>
					<div class="dialogue-content">
						<p v-for="(line, idx) in dialogueContent.split('\n')" :key="idx" class="dialogue-line">
							<span v-if="line.startsWith('A:')" >{{ line }}</span>
							<span v-else-if="line.startsWith('B:')" >{{ line }}</span>
							<span v-else class="dialogue-line">{{ line }}</span>
						</p>
					</div>
				</div>
			</div>

			<!-- 学习建议 -->
			<div class="tips-card">
				<h4>💡 学习建议</h4>
				<ul class="tips-list">
					<li>复习已学习的表达语块和元句型句式</li>
					<li>尝试在日常对话中应用所学内容</li>
					<li>定期回顾以加深记忆</li>
					<li>结合实际情境进行练习</li>
				</ul>
			</div>

			<!-- 继续学习按钮 -->
			<div class="continue-section">
				<button class="continue-btn" @click="continueLearning">继续学习</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed} from 'vue';
import { onLoad } from '@dcloudio/uni-app';
// 数据状态
const type = ref('');
const id = ref('');
const name = ref('');
const videoList = ref([]);
const currentTime = ref('');
const dialogueContent = ref('');

// 表达语块对话内容映射表
const chunkDialogueMap = {
	'1': 'A：快进来！给你看个好东西。\nB：啥呀？这么神秘。\nA：看看我的宿舍，看看这厨房!\nB：哇，厨房好干净啊！\nA：以后咱能一起做饭啦。',
	'2': 'A: 你来自哪里？\nB: 我来自中国北方。\nA: 欢迎加入我们的团队！',
	'3': 'A: 你有什么技能可以展示一下吗？\nB: 我的手机可以用来做直播，展示产品。\nA: 太棒了，这正是我们需要的！',
	'4': 'A: 你工作态度怎么样？\nB: 我做事情这么认真，一定会把任务完成好。\nA: 我就喜欢你这种认真负责的态度。',
	'5': 'A: 你有教学经验吗？\nB: 我特别喜欢教小朋友学习，很有耐心。\nA: 这对我们的教育项目很有帮助。',
	'6': 'A: 你觉得这个项目进度如何？\nB: 我觉得走得太快了，我们应该多考虑一些细节。\nA: 你说得对，我们需要更加谨慎。',
	'7': 'A: 你能帮我完成这个任务吗？\nB: 当然可以，我很乐意帮忙。\nA: 谢谢你的支持！',
	'8': 'A: 我们需要为新生做些什么？\nB: 我建议举办一个迎新晚会，让大家互相认识。\nA: 这是个好主意！',
	'9': 'A: 晚会需要准备什么？\nB: 我可以出一个节目，展示我们的才艺。\nA: 期待你的精彩表演！',
	'10': 'A: 你对这个项目有什么要求？\nB: 我需要精准控制每个环节，确保质量。\nA: 你的专业态度令人印象深刻。',
	'11': 'A: 这个方案怎么样？\nB: 这是一个正确的选择，我们应该采纳。\nA: 很高兴我们意见一致。',
	'12': 'A: 谁最适合这个岗位？\nB: 他是最合适的人选，有丰富的经验。\nA: 我相信你的眼光。',
	'13': 'A: 我们需要选一个代表，你推荐谁？\nB: 他是最佳人选，能够胜任这个角色。\nA: 就按你说的办！',
	'14': 'A: 我们的活动要体现什么？\nB: 我们要代表中国风貌，展现传统文化。\nA: 这个定位非常好。',
	'15': 'A: 你觉得这个建议如何？\nB: 很有道理，我们应该认真考虑。\nA: 那就按照这个方向去做吧。',
	'16': 'A: 我们可以聊一聊这个话题吗？\nB: 当然可以，聊一聊可以增进了解。\nA: 谢谢你的分享！'
};

// 元句型句式对话内容映射表
const sentenceDialogueMap = {
	'1': 'A：快进来！给你看个好东西。\nB：啥呀？这么神秘。\nA：看看我的宿舍，看看这厨房!\nB：哇，厨房好干净啊！\nA：以后咱能一起做饭啦。',
	'2': 'A: 听说你没通过考试？\nB: 是的，太可惜了。\nA: 别灰心，下次一定能行。',
	'3': 'A: 这个表演太精彩了！\nB: 是啊，演员们太棒了！\nA: 这个节目太有趣了！',
	'4': 'A: 很高兴认识你！\nB: 我也很高兴认识你。\nA: 很高兴今天能一起工作。',
	'5': 'A: 欢迎加入我们的团队！\nB: 谢谢，我很期待与大家合作。\nA: 欢迎来到我们的城市！',
	'6': 'A: 我们可以用什么方法解决这个问题？\nB: 我们可以用数据分析来找出原因。\nA: 我们可以用团队合作的方式完成这个任务。',
	'7': 'A: 你能给我一个建议吗？\nB: 我认为你应该先做市场调研。\nA: 我认为这个方案需要修改。',
	'8': 'A: 他有什么特长？\nB: 他在软件开发方面很有经验。\nA: 她在演讲方面很有经验。',
	'9': 'A: 为什么选他？\nB: 因为他具有很强的领导能力。\nA: 这个项目需要具有很强的创新能力的人。',
	'10': 'A: 这个房间怎么样？\nB: 这个房间是新装修的。\nA: 这个决定是经过深思熟虑的。',
	'11': 'A: 这个方案比之前的好吗？\nB: 是的，这个方案比之前的更全面。\nA: 新设备比旧设备更高效。',
	'12': 'A: 为什么一定要这样做？\nB: 我们非得按规定执行不可。\nA: 你非得现在走吗？',
	'13': 'A: 我们周末做什么？\nB: 要不我们去爬山吧。\nA: 要不我们先休息一下？',
	'14': 'A: 这件事跟你有关系吗？\nB: 跟我关系不大，是他们决定的。\nA: 这个问题跟我们今天讨论的主题关系不大。'
};

// 接收参数
onLoad((options) => {
	type.value = options.type || '';
	id.value = options.id || '';
	name.value = decodeURIComponent(options.name) || '';
	videoList.value = JSON.parse(decodeURIComponent(options.videos)) || [];
	
	// 根据类型和ID获取对应的对话内容
if (type.value === 'chunk') {
	dialogueContent.value = chunkDialogueMap[id.value] || '暂无相关对话内容。建议您复习学习过的内容，尝试自己创建对话场景进行练习。';
} else if (type.value === 'sentence') {
	dialogueContent.value = sentenceDialogueMap[id.value] || '暂无相关对话内容。建议您复习学习过的内容，尝试自己创建对话场景进行练习。';
} else {
	dialogueContent.value = '暂无相关对话内容。建议您复习学习过的内容，尝试自己创建对话场景进行练习。';
}
	
	// 设置当前时间
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hour = String(now.getHours()).padStart(2, '0');
	const minute = String(now.getMinutes()).padStart(2, '0');
	currentTime.value = `${year}-${month}-${day} ${hour}:${minute}`;
});

// 计算属性
const contentType = computed(() => {
	return type.value === 'chunk' ? '表达语块' : type.value === 'sentence' ? '元句型句式' : '学习内容';
});

const contentName = computed(() => {
	return name.value || '未命名内容';
});

const videoCount = computed(() => {
	return videoList.value.length;
});

// 返回上一页
const goBack = () => {
	uni.navigateBack({ delta: 2 });
};

// 继续学习（返回首页）
const continueLearning = () => {
	uni.navigateBack({ delta: 2 });
};
</script>

<style scoped>
.summary-container {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 顶部导航 */
.summary-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px;
	background-color: #ffffff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-btn {
	background: transparent;
	border: none;
	color: #333;
	font-size: 20px;
	padding: 5px;
}

.summary-title {
	flex: 1;
	font-size: 18px;
	text-align: center;
	margin: 0;
	color: #333;
}

.header-right {
	width: 30px;
}

/* 内容区域 */
.summary-content {
	padding: 20px;
}

/* 卡片样式 */
.progress-card,
.content-card,
.tips-card {
	background-color: #ffffff;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.progress-card h4,
.content-card h4,
.tips-card h4 {
	margin: 0 0 15px 0;
	font-size: 18px;
	color: #333;
}

/* 进度信息 */
.progress-info p {
	margin: 8px 0;
	font-size: 15px;
	color: #666;
}

/* 对话部分 */
.dialogue-section {
	margin-bottom: 15px;
	border-radius: 12px;
	overflow: hidden;
	background-color: #fafafa;
	border: 1px solid #e0e0e0;
}

.dialogue-section h5 {
	margin: 0;
	padding: 12px 15px;
	font-size: 16px;
	font-weight: 600;
	color: #333;
	background-color: #fff;
	border-bottom: 1px solid #e0e0e0;
}

.dialogue-content {
	padding: 15px;
	line-height: 1.8;
}

.dialogue-line {
	margin: 10px 0;
	font-size: 15px;
	color: #666;
}

.dialogue-role {
	max-width: 85%;
	word-wrap: break-word;
	padding: 12px 16px;
	margin: 10px 0;
	position: relative;
}


/* 建议列表 */
.tips-list {
	padding-left: 20px;
	margin: 0;
}

.tips-list li {
	margin: 8px 0;
	color: #666;
	font-size: 15px;
}

/* 继续学习按钮 */
.continue-section {
	margin-top: 30px;
	display: flex;
	justify-content: center;
}

.continue-btn {
	padding: 14px 60px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 25px;
	font-size: 17px;
	font-weight: bold;
	cursor: pointer;
}

.continue-btn:active {
	background-color: #3aa876;
	transform: scale(0.98);
}

/* 图标 */
.icon-arrow-left::before {
	content: "←";
}
</style>