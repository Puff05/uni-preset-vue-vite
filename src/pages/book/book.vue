<template>
    <div class="book-container">
        <!-- 上部分 - 图片区域（占40%高度） -->
        <div class="image-section" v-if="selectedBook">
            <img :src="selectedBook.image" :alt="selectedBook.title" class="book-background-image" />
            <!-- 背景遮罩 -->
            <div class="image-overlay"></div>
        </div>
        <div v-else class="image-section-loading">
            <p>加载中...</p>
        </div>

        <!-- 下部分 - 主内容区域（占60%高度） -->
        <main class="book-content">
            <div v-if="selectedBook" class="book-detail">
                <!-- 标题部分 - 放在主内容区顶部，包含返回按钮 -->
                <div class="content-header">
                    <h2 class="content-title">{{ selectedBook.title }}</h2>
                    <button class="back-button" @click="goBack">
                        返回
                    </button>
                </div>

                <!-- 章节列表部分 - 紧跟在标题下方，支持滚动 -->
                <div class="chapters-section">
                    
                    <div class="chapters-list-container">
                        <h2 class="chapters-section-title">章节列表</h2>
                        <div v-for="(chapter, index) in selectedBook.chapters" :key="index" class="chapter-item"
                            @click="goToChapter(chapter, index)">
                            <div class="chapter-number">{{ (index + 1).toString().padStart(2, '0') }}</div>
                            <div class="chapter-info">
                                <h4 class="chapter-title">{{ chapter.title }}</h4>
                            </div>
                            <div class="chapter-action">
                                <button class="play-button">
                                    <span class="icon-play">▶</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 状态管理
const selectedBook = ref(null);
const chapters = ref([{
    id: 1,
    chapter: [{
        courseNo:1,
        title: "第一课 最佳人选",
    },
    {
        courseNo:2,
        title: "第二课 登台之前",
    },
    {
        courseNo:3,
        title: "第三课 火花碰撞",
    },
    {
        courseNo:4,
        title: "第四课 贴心朋友",
    },
    {
        courseNo:5,
        title: "第五课 勇闯难关",
    },
    {
        courseNo:6,
        title: "第六课 寻找亮点",
    },
    {
        courseNo:7,
        title: "第七课 脱颖而出",
    },
    {
        courseNo:8,
        title: "第八课 畅谈包容",
    },
    {
        courseNo:9,
        title: "第九课 一场拍摄",
    },
    {
        courseNo:10,
        title: "第十课 重归于好",
    },
    {
        courseNo:11,
        title: "第十一课 理解宽容",
    },
    {
        courseNo:12,
        title: "第十二课 知己知彼",
    }
    ]
},
{
    id: 2,
    chapter: [{
        courseNo:1,
        title: "第一课 最佳人选",
    },
    {
        courseNo:2,
        title: "第二课 登台之前",
    },
    {
        courseNo:3,
        title: "第三课 火花碰撞",
    },
    {
        courseNo:4,
        title: "第四课 贴心朋友",
    },
    {
        courseNo:5,
        title: "第五课 勇闯难关",
    },
    {
        courseNo:6,
        title: "第六课 寻找亮点",
    },
    {
        courseNo:7,
        title: "第七课 脱颖而出",
    },
    {
        courseNo:8,
        title: "第八课 畅谈包容",
    },
    {
        courseNo:9,
        title: "第九课 一场拍摄",
    },
    {
        courseNo:10,
        title: "第十课 重归于好",
    },
    {
        courseNo:11,
        title: "第十一课 理解宽容",
    },
    {
        courseNo:12,
        title: "第十二课 知己知彼",
    }
    ]
},
{
    id: 3,
    chapter: [{
        courseNo:1,
        title: "第一课 最佳人选",
    },
    {
        courseNo:2,
        title: "第二课 登台之前",
    },
    {
        courseNo:3,
        title: "第三课 火花碰撞",
    },
    {
        courseNo:4,
        title: "第四课 贴心朋友",
    },
    {
        courseNo:5,
        title: "第五课 勇闯难关",
    },
    {
        courseNo:6,
        title: "第六课 寻找亮点",
    },
    {
        courseNo:7,
        title: "第七课 脱颖而出",
    },
    {
        courseNo:8,
        title: "第八课 畅谈包容",
    },
    {
        courseNo:9,
        title: "第九课 一场拍摄",
    },
    {
        courseNo:10,
        title: "第十课 重归于好",
    },
    {
        courseNo:11,
        title: "第十一课 理解宽容",
    },
    {
        courseNo:12,
        title: "第十二课 知己知彼",
    }
    ]
},
])

// 生命周期钩子
onMounted(() => {
  // 获取路由参数
  const currentPage = getCurrentPages().slice(-1)[0];
  const bookId = parseInt(currentPage.options.bookId);
  const bookTitle = currentPage.options.bookTitle;
  
  if (bookId) {
    // 从chapters数组中根据bookId查找对应的章节数据
    const bookChapters = chapters.value.find(ch => ch.id === bookId);
    
    if (bookChapters && bookChapters.chapter) {
      // 准备要显示的章节数据
      const chaptersToShow = bookChapters.chapter.map(ch => ({
        title: ch.title,
        duration: "视频时长", // 为了兼容模板中的显示
        content: "章节内容" // 保留content字段以保持数据结构一致性
      }));
      
      // 构建最终的selectedBook对象
      const finalBook = {
        id: bookId,
        title: bookTitle ? decodeURIComponent(bookTitle) : `书籍 ${bookId}`,
        image: "https://img95.699pic.com/xsj/0s/gy/qm.jpg!/fh/300", // 默认封面图片
        chapters: chaptersToShow
      };
      
      selectedBook.value = finalBook;
    } else {
      console.error('未找到对应的章节数据');
    }
  }
});

// 返回上一页
const goBack = () => {
    uni.navigateBack();
};

// 跳转到具体章节
const goToChapter = (chapter, index) => {
    if (selectedBook.value) {
        // 传递参数：书籍ID、书名、章节索引、章节标题
        uni.navigateTo({
            url: `/pages/show/show?bookId=${selectedBook.value.id}&bookTitle=${encodeURIComponent(selectedBook.value.title)}&chapterIndex=${index}&chapterTitle=${encodeURIComponent(chapter.title)}`
        });
    }
};
</script>

<style scoped>
/* 基础样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 容器样式 - 垂直布局 */
.book-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 上部分 - 图片区域（40%高度） */
.image-section {
    height: 40vh;
    position: relative;
    overflow: hidden;
}

.book-background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 图片遮罩 */
.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
}

/* 图片区域加载状态 */
.image-section-loading {
    height: 40vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    color: #666;
}

/* 下部分 - 主内容区域（60%高度） */
.book-content {
    height: 60vh;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    margin-top: -20px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
}

/* 详情容器 */
.book-detail {
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* 内容头部 - 包含返回按钮和标题 */
.content-header {
    display: flex;
    align-items: center;
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
}

.back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #42b983;
    font-size: 12px;
    cursor: pointer;
    margin-right: 16px;
    padding: 2px 10px;
    border-radius: 8px;
    background-color: rgba(66, 185, 131, 0.1);
}

.back-button .icon-arrow-left {
    font-size: 20px;
    margin-right: 4px;
}

.content-title {
    flex: 1;
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

/* 章节列表部分 */
.chapters-section {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.chapters-section-title{
    font-size: 16px;
}
.chapters-list-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    /* 添加滚动条样式 */
    scrollbar-width: thin;
    scrollbar-color: #ccc #f8f8f8;
}

/* Webkit浏览器滚动条样式 */
.chapters-list-container::-webkit-scrollbar {
    width: 6px;
}

.chapters-list-container::-webkit-scrollbar-track {
    background: #f8f8f8;
}

.chapters-list-container::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
}

.chapter-item {
    display: flex;
    align-items: center;
    padding: 18px 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.chapter-number {
    font-size: 32px;
    font-weight: 700;
    color: #42b983;
    margin-right: 16px;
    flex-shrink: 0;
    font-family: 'Arial', sans-serif;
}

.chapter-info {
    flex: 1;
}

.chapter-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    line-height: 1.5;
}

.chapter-action {
    margin-left: 12px;
    flex-shrink: 0;
}

.play-button {
    width: 40px;
    height: 40px;
    background-color: #42b983;
    color: #fff;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(66, 185, 131, 0.3);
}

.play-button:hover {
    background-color: #359e6d;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(66, 185, 131, 0.4);
}

.play-button .icon-play {
    font-size: 16px;
    margin-left: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    /* 调整上下部分比例，在小屏幕上内容区域可适当增大 */
    .image-section,
    .image-section-loading {
        height: 35vh;
    }
    
    .book-content {
        height: 65vh;
    }
    
    .content-header {
        padding: 16px 20px 12px;
    }
    
    .content-title {
        font-size: 18px;
    }
    
    .chapters-list-container {
        padding: 16px 20px 24px;
    }
    
    .chapter-item {
        padding: 16px;
    }
    
    .chapter-title {
        font-size: 15px;
    }
    
    .play-button {
        width: 36px;
        height: 36px;
    }
}
</style>