<template>
	<div class="app-container">
		<!-- 顶部导航栏 -->
		<header class="app-header">
			<h1>我的书籍</h1>
			<div class="search-bar">
				<input type="text" placeholder="搜索书籍..." v-model="searchQuery" />
				<i class="icon-search"></i>
			</div>
		</header>

		<!-- 主内容区 -->
		<main class="main-content">
			<!-- 书籍列表视图 -->
			<div v-if="!selectedBook" class="books-list">
				<h2>图书列表</h2>
				<div class="books-grid">
					<!-- 书籍卡片 -->
					<div v-for="book in filteredBooks" :key="book.id" class="book-card" @click="selectBook(book)">
						<div class="book-number">#{{ book.id }}</div>
						<div class="book-info">
							<h3 class="book-title">{{ book.title }}</h3>
							<div class="book-chapters">
								<span>{{ book.chapters.length }} 个章节</span>
							</div>
						</div>
						<i class="icon-arrow-right"></i>
					</div>
				</div>
			</div>

			<!-- 章节列表视图 -->
			<div v-else class="chapters-list">
				<div class="back-button" @click="deselectBook">
					<i class="icon-arrow-left"></i>
					<span>返回图书列表</span>
				</div>

				<h3 class="chapters-title">章节列表</h3>
				<ul class="chapters-items">
					<!-- 章节项添加点击事件 goToChapter -->
					<li v-for="(chapter, index) in selectedBook.chapters" :key="index" class="chapter-item"
						@click="goToChapter(selectedBook, chapter, index)">
						<div class="chapter-number">{{ index + 1 }}</div>
						<div class="chapter-content">
							<h4>{{ chapter.title }}</h4>
						</div>
						<button class="play-button">
							<i class="icon-play"></i>
						</button>
					</li>
				</ul>
			</div>
		</main>

		<!-- 底部导航 -->
		<footer class="app-footer">
			<div class="nav-item active">
				<i class="icon-book"></i>
				<span>图书</span>
			</div>
			<div class="nav-item">
				<i class="icon-progress"></i>
				<span>进度</span>
			</div>
			<div class="nav-item">
				<i class="icon-favorite"></i>
				<span>收藏</span>
			</div>
			<div class="nav-item">
				<i class="icon-user"></i>
				<span>我的</span>
			</div>
		</footer>
	</div>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
 
	const books = ref([{
			id: 1,
			title: "理解互信篇",
			chapters: [{
					title: "第一课 最佳人选",
				},
				{
					title: "第二课 登台之前",
				},
				{
					title: "第三课 火花碰撞",
				},
				{
					title: "第四课 贴心朋友",
				},
				{
					title: "第五课 勇闯难关",
				},
				{
					title: "第六课 寻找亮点",
				},
				{
					title: "第七课 脱颖而出",
				},
				{
					title: "第八课 畅谈包容",
				},
				{
					title: "第九课 一场拍摄",
				},
				{
					title: "第十课 重归于好",
				},
				{
					title: "第十一课 理解宽容",
				},
				{
					title: "第十二课 知己知彼",
				}
			]
		},
		{
			id: 2,
			title: "善做善成篇",
			chapters: [{
					title: "第一课 最佳人选",
				},
				{
					title: "第二课 登台之前",
				},
				{
					title: "第三课 火花碰撞",
				},
				{
					title: "第四课 贴心朋友",
				},
				{
					title: "第五课 勇闯难关",
				},
				{
					title: "第六课 寻找亮点",
				},
				{
					title: "第七课 脱颖而出",
				},
				{
					title: "第八课 畅谈包容",
				},
				{
					title: "第九课 一场拍摄",
				},
				{
					title: "第十课 重归于好",
				},
				{
					title: "第十一课 理解宽容",
				},
				{
					title: "第十二课 知己知彼",
				}
			]
		},
		{
			id: 3,
			title: "文明互鉴篇",
			chapters: [{
					title: "第一课 最佳人选",
				},
				{
					title: "第二课 登台之前",
				},
				{
					title: "第三课 火花碰撞",
				},
				{
					title: "第四课 贴心朋友",
				},
				{
					title: "第五课 勇闯难关",
				},
				{
					title: "第六课 寻找亮点",
				},
				{
					title: "第七课 脱颖而出",
				},
				{
					title: "第八课 畅谈包容",
				},
				{
					title: "第九课 一场拍摄",
				},
				{
					title: "第十课 重归于好",
				},
				{
					title: "第十一课 理解宽容",
				},
				{
					title: "第十二课 知己知彼",
				}
			]
		}
	]);

	// 状态管理
	const selectedBook = ref(null);
	const searchQuery = ref('');

	// 选择书籍
	const selectBook = (book) => {
		selectedBook.value = book;
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300
		}); // uni-app 滚动API
	};

	// 取消选择（返回图书列表）
	const deselectBook = () => {
		selectedBook.value = null;
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300
		});
	};

	// 过滤书籍列表
	const filteredBooks = computed(() => {
		if (!searchQuery.value) return books.value;
		const query = searchQuery.value.toLowerCase();
		return books.value.filter(book =>
			book.title.toLowerCase().includes(query) 
		);
	});

	// 章节点击跳转（携带书籍+章节参数）
	const goToChapter = (book, chapter, index) => {
		// 传递参数：书籍ID、书名、章节索引、章节标题、视频地址
		uni.navigateTo({
			url: `/pages/show/show?bookId=${book.id}&bookTitle=${encodeURIComponent(book.title)}&chapterIndex=${index}&chapterTitle=${encodeURIComponent(chapter.title)}`
		})
	};
</script>

<style scoped>
	/* 保持原有样式不变 */
	/* 基础样式 */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.app-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		color: #333;
		position: relative;
		padding-bottom: 60px;
		/* 为底部导航留出空间 */
	}

	/* 顶部导航 */
	.app-header {
		background-color: #42b983;
		color: white;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.app-header h1 {
		font-size: 20px;
		margin-bottom: 12px;
	}

	.search-bar {
		position: relative;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 8px 16px;
		display: flex;
		align-items: center;
	}

	.search-bar input {
		flex: 1;
		background: transparent;
		border: none;
		color: white;
		outline: none;
		font-size: 14px;
	}

	.search-bar input::placeholder {
		color: rgba(255, 255, 255, 0.7);
	}

	/* 主内容区 */
	.main-content {
		padding: 16px;
	}

	/* 图书列表样式 */
	.books-list h2 {
		font-size: 18px;
		margin-bottom: 16px;
		color: #333;
	}

	.books-grid {
		display: grid;
		gap: 12px;
	}

	.book-card {
		background-color: white;
		border-radius: 10px;
		padding: 16px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.book-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.book-number {
		width: 30px;
		height: 30px;
		background-color: #42b983;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: bold;
		margin-right: 12px;
	}

	.book-info {
		flex: 1;
	}

	.book-title {
		font-size: 16px;
		margin-bottom: 4px;
		color: #333;
	}



	.book-chapters {
		font-size: 12px;
		color: #999;
	}

	.icon-arrow-right {
		color: #ccc;
		font-size: 18px;
	}

	/* 章节列表样式 */
	.back-button {
		display: flex;
		align-items: center;
		color: #42b983;
		margin-bottom: 16px;
		cursor: pointer;
		font-size: 14px;
	}

	.back-button .icon-arrow-left {
		margin-right: 6px;
	}


	.book-detail-header h2 {
		font-size: 18px;
		margin-bottom: 8px;
		color: #333;
	}

	.book-detail-header p {
		font-size: 14px;
		color: #666;
		line-height: 1.5;
	}

	.chapters-title {
		font-size: 16px;
		margin-bottom: 12px;
		color: #333;
	}

	.chapters-items {
		list-style: none;
	}

	.chapter-item {
		background-color: white;
		border-radius: 10px;
		padding: 12px 16px;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.chapter-item:hover {
		background-color: #f9f9f9;
	}

	.chapter-number {
		width: 26px;
		height: 26px;
		background-color: #f0f5f0;
		color: #42b983;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: bold;
		margin-right: 12px;
	}

	.chapter-content {
		flex: 1;
	}

	.chapter-content h4 {
		font-size: 15px;
		margin-bottom: 4px;
		color: #333;
	}

	.play-button {
		background-color: #42b983;
		color: white;
		border: none;
		border-radius: 20px;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.play-button:hover {
		background-color: #359e6d;
	}

	/* 底部导航 */
	.app-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: white;
		display: flex;
		justify-content: space-around;
		padding: 8px 0;
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #999;
		font-size: 12px;
		width: 25%;
	}

	.nav-item.active {
		color: #42b983;
	}

	.nav-item i {
		font-size: 20px;
		margin-bottom: 4px;
	}

	/* 图标样式（使用伪元素模拟） */
	.icon-search::before {
		content: "🔍";
	}

	.icon-arrow-right::before {
		content: "→";
	}

	.icon-arrow-left::before {
		content: "←";
	}

	.icon-play::before {
		content: "▶";
	}

	.icon-book::before {
		content: "📚";
	}

	.icon-progress::before {
		content: "📊";
	}

	.icon-favorite::before {
		content: "❤️";
	}

	.icon-user::before {
		content: "👤";
	}
</style>