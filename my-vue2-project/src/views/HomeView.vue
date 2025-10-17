<template>
  <div class="home">
    <!-- 数据卡片区域 -->
    <div class="stats-grid" v-if="$route.path === '/dashboard'">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>用户总数</h3>
          <p class="stat-number">1,234</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>今日访问</h3>
          <p class="stat-number">567</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>总收入</h3>
          <p class="stat-number">¥89,012</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>增长率</h3>
          <p class="stat-number">+12.5%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  }
}
</script>

<style scoped>
/* 统计卡片网格 */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    font-size: 40px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #3498db, #2980b9);
    border-radius: 12px;
    color: white;
  }
  
  .stat-content h3 {
    color: #7f8c8d;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .stat-number {
    color: #2c3e50;
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }
</style>
