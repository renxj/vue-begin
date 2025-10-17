<template>
  <div class="forbidden">
    <div class="code">403</div>
    <div class="message">抱歉，您没有权限访问该页面</div>
    <div class="sub">请联系管理员为您的账号分配相应权限</div>
    <div class="actions">
      <router-link to="/dashboard">
        <el-button type="primary" round>返回仪表盘</el-button>
      </router-link>
      <router-link to="/login">
        <el-button type="text">重新登录</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForbiddenView'
}
</script>

<style scoped>
.forbidden {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  color: #e2e8f0;
  text-align: center;
}
.code {
  font-size: 96px;
  font-weight: 800;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 24px rgba(59, 130, 246, 0.25);
}
.message {
  font-size: 20px;
  margin-top: 12px;
}
.sub {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 6px;
}
.actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}
</style>