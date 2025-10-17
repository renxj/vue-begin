<template>
  <el-container class="dashboard-container">
    <!-- 左侧导航菜单 -->
    <el-aside width="260px" class="app-aside">
      <Sidebar />
    </el-aside>

    <!-- 主内容区域 -->
    <el-container>
      <!-- 顶部用户信息栏 -->
      <el-header class="top-header" height="70px">
        <div class="header-left">
          <!-- <h1 class="page-title">管理系统</h1> -->
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">
              <img :src="avatarSrc"
                   :alt="currentUser && currentUser.name || '默认头像'"
                   @error="onAvatarError" />
               
            </div>
            <div class="user-details">
              <span class="user-name">{{ currentUser && currentUser.name || '用户' }}</span>
              <span class="user-role">管理员</span>
            </div>
          </div>
          <button @click="handleLogout" :disabled="isLoggingOut" class="logout-btn">
            {{ isLoggingOut ? '退出中...' : '退出登录' }}
          </button>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="content-area">
        <div class="welcome-section" v-if="$route.path === '/dashboard'">
          <h2>欢迎回来，{{ currentUser && currentUser.name || '用户' }}！</h2>
          <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
        </div>

        <router-view/>

      </el-main>
    </el-container>
  </el-container>
</template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex'
  import Sidebar from '@/components/Sidebar.vue'
  import defaultAvatar from '@/assets/logo.png'
  
  export default {
    name: 'DashboardView',
    components: {
      Sidebar
    },
    data() {
      return {
        isLoggingOut: false,
        logoutMessage: '',
        messageClass: ''
      }
    },
    computed: {
      ...mapGetters(['currentUser']),
      currentDate() {
        const now = new Date()
        return now.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        })
      },
      avatarSrc() {
        const url = this.currentUser && this.currentUser.avatar
        return url ? url : defaultAvatar
      }
    },
    methods: {
      ...mapActions(['logout']),
      onAvatarError(e) {
        e.target.src = defaultAvatar
      },
      async handleLogout() {
        this.isLoggingOut = true
        this.logoutMessage = ''
        
        try {
          await this.logout()
          this.logoutMessage = '退出登录成功'
          this.messageClass = 'success-message'
          
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            this.$router.push('/login')
          }, 1000)
        } catch (error) {
          this.logoutMessage = '退出登录失败，但已清除本地登录信息'
          this.messageClass = 'error-message'
          console.error('登出错误:', error)
          
          // 即使失败也跳转到登录页
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } finally {
          this.isLoggingOut = false
        }
      }
    },
    created() {
      console.log(this.currentUser,'---currentUser')
      // 组件创建时检查用户信息
      if (!this.currentUser) {
        this.$store.dispatch('fetchUserInfo')
      }
    }
  }
  </script>
  
  <style scoped>
  /* 全局重置 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* 主容器 */
  .dashboard-container {
    display: flex;
    height: 100vh;
    background-color: #f5f7fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .main-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /* 顶部头部 */
  .top-header {
    background: white;
    padding: 0 30px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
  
  .header-left .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #e9ecef;
  }
  
  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  .user-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 14px;
  }
  
  .user-role {
    font-size: 12px;
    color: #7f8c8d;
  }
  
  .logout-btn {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
  }
  
  .logout-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #c0392b, #a93226);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
  }
  
  .logout-btn:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  /* 内容区域 */
  .content-area {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
  }
  
  .welcome-section {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
  }
  
  .welcome-section h2 {
    color: #2c3e50;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .welcome-section p {
    color: #7f8c8d;
    font-size: 16px;
  }
  
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .main-content {
      padding: 20px;
    }

    .content-area {
      padding: 20px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .stat-card {
      padding: 20px;
    }

    .welcome-section {
      padding: 20px;
    }

    .welcome-section h2 {
      font-size: 24px;
    }
  }

  @media (max-width: 480px) {
    .dashboard-container {
      flex-direction: column;
    }
    
    .main-content {
      padding: 15px;
      width: 100%;
      min-width: 100%;
    }

    .content-area {
      padding: 15px;
    }

    .welcome-section {
      padding: 15px;
    }

    .welcome-section h2 {
      font-size: 20px;
    }

    .stat-card {
      padding: 15px;
      gap: 15px;
    }

    .stat-icon {
      font-size: 30px;
      width: 50px;
      height: 50px;
    }

    .stat-number {
      font-size: 20px;
    }
    
    .top-header {
      padding: 0 20px;
      height: 60px;
    }
    
    .page-title {
      font-size: 20px;
    }
  }
  </style>