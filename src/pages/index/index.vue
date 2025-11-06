<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header ">
      <h1 class="app-header-title">课程学习</h1>
    </header>

    <!-- 主内容区 -->
      <main class="main-content">
        <h2 class="book-list-title">图书列表</h2>
        <div class="book-list">
        <!-- 图书卡片网格 -->
        <div class="books-grid">
          <div class="book-card" v-for="(book, index) in filteredBooks" :key="book.id" @click="goToBookDetail(book)">
            <div class="book-image">
              <img :src="book.image" :alt="book.title" class="book-cover" />
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-chapters">共 12 章</p>
            </div>
            <span class="icon-arrow-right">›</span>
          </div>
        </div>
      </div>
    </main>

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
  image: '/static/pics/index/book1.jpg',
},
{
  id: 2,
  title: "善做善成篇",
  image: '/static/pics/index/book1.jpg',
},
{
  id: 3,
  title: "文明互鉴篇",
  image: '/static/pics/index/book1.jpg',
}
]);

// 状态管理
const searchQuery = ref('');

// 跳转到书籍详情页面
const goToBookDetail = (book) => {
  uni.navigateTo({
    url: `/pages/book/book?bookId=${book.id}&bookTitle=${encodeURIComponent(book.title)}`
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

// 所有页面跳转逻辑已移至book.vue组件中
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app-container {
  min-height: 100vh;
  background-image: url('/static/pics/index/background.png');
  position: relative;
}

/* 顶部导航 */
.app-header {
  padding: 100rpx;
}

.app-header-title {
  text-align: center;
  color: #243C60;
}

/* 主内容区 */
.main-content {
  position: absolute;
  background-color: white;
  border-top-left-radius: 60rpx;
  border-top-right-radius: 60rpx;
  box-shadow: -2px -2px 6px rgba(0, 0, 0, 0.08), 2px -2px 6px rgba(0, 0, 0, 0.08);
  bottom: 0;
  left: 0;
  right: 0;
}

.book-list-title {
  margin-top: 40rpx;
  font-size: 40rpx;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
}

.book-list {
  padding: 40rpx;
}

.books-grid {
  display: grid;
  gap: 12px;
}

.book-card {
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.book-card:nth-child(1){
  background-color: #98DDF4;
}
.book-card:nth-child(2){
  background-color: #97F3EC;
}
.book-card:nth-child(3){
  background-color: #D496F4;
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.book-image {
  width: 80px;
  height: 100px;
  margin-right: 16px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  color: gray;
}

.icon-arrow-right {
  color: #ccc;
  font-size: 18px;
}


</style>
