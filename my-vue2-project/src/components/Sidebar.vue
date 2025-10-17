<template>
  <el-scrollbar class="sidebar">
    <div class="sidebar-header">
      <h2 class="logo">管理系统</h2>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      router
      unique-opened
      background-color="#0f172a"
      text-color="#f8fafc"
      active-text-color="#409EFF"
    >
      <menu-tree
        v-for="(item, idx) in menuList"
        :key="item.index || idx"
        :item="item"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import api from '@/api'
import menuData from '@/mock/menu.json'
import MenuTree from '@/components/MenuTree.vue'
export default {
  name: 'SidebarView',
  components: { MenuTree },
  data() {
    return {
      menuList: [],
      loadingMenu: false,
      menuError: ''
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  created() {
    this.fetchMenu()
  },
  methods: {
    async fetchMenu() {
      this.loadingMenu = true
      this.menuError = ''
      try {
        const role = this.$store.getters.currentUser && this.$store.getters.currentUser.role
        const list = await api.menu.getMenu({ role })
        const normalized = Array.isArray(list) ? list : (list && list.menu)
        this.menuList = Array.isArray(normalized) ? normalized : []
        if (!this.menuList.length) {
          // 后端返回空时，回退到本地数据
          const local = Array.isArray(menuData) ? menuData : (menuData && menuData.menu)
          this.menuList = Array.isArray(local) ? local : []
        }
      } catch (err) {
        // 接口失败回退到本地 mock 数据
        this.menuError = '菜单接口不可用，已使用本地数据'
        const local = Array.isArray(menuData) ? menuData : (menuData && menuData.menu)
        this.menuList = Array.isArray(local) ? local : []
      } finally {
        this.loadingMenu = false
      }
    }
  }
}
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%);
  color: #f8fafc;
  position: relative;
  overflow-y: auto;
  box-shadow: 
    4px 0 25px rgba(0, 0, 0, 0.2), 
    inset -1px 0 0 rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  z-index: 1000;
  backdrop-filter: blur(12px);
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

/* 自定义滚动条 */
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  margin: 8px 0;
}

.sidebar::-webkit-scrollbar-thumb {
  background: linear-gradient(145deg, #64748b, #475569);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(145deg, #94a3b8, #64748b);
  transform: scale(1.1);
}

.sidebar-header {
  height: 70px; /* 与右侧 header 高度一致 */
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(236, 72, 153, 0.04) 100%);
  position: relative;
  backdrop-filter: blur(8px);
}

.sidebar-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b);
  background-size: 400% 100%;
  animation: gradientShift 4s ease-in-out infinite;
  border-radius: 0 0 2px 2px;
}

/* Element UI 菜单缩进与外观优化 */
.el-menu-vertical {
  border-right: none;
  background-color: transparent;
  padding: 8px 10px 16px;
}

.el-menu-vertical .el-menu-item,
.el-menu-vertical .el-submenu__title {
  height: 48px;
  line-height: 48px;
  margin: 4px 8px;
  border-radius: 12px;
  color: #e2e8f0;
  transition: all 0.2s ease;
}

/* 一级缩进 */
.el-menu-vertical > .el-menu-item,
.el-menu-vertical > .el-submenu > .el-submenu__title {
  padding-left: 16px !important;
}

/* 二级缩进 */
.el-menu-vertical .el-submenu .el-menu-item,
.el-menu-vertical .el-submenu .el-submenu__title {
  padding-left: 32px !important;
}

/* 三级缩进（进一步加大与二级的差异）*/
.el-menu-vertical .el-submenu .el-submenu .el-menu-item,
.el-menu-vertical .el-submenu .el-submenu .el-submenu__title {
  padding-left: 64px !important;
}

/* 活跃项与交互反馈 */
.el-menu-vertical .el-menu-item.is-active {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.20) 0%, rgba(139, 92, 246, 0.20) 100%);
  color: #ffffff;
  border-left: 4px solid #409EFF;
}

.el-menu-vertical .el-submenu.is-opened > .el-submenu__title {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.el-menu-vertical .el-submenu__title:hover,
.el-menu-vertical .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 调整子菜单箭头颜色 */
.el-submenu__icon-arrow {
  color: #94a3b8;
}

/* 菜单图标统一样式 */
.el-menu-vertical i {
  font-size: 16px;
  margin-right: 10px;
  color: #93c5fd;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 200% 50%; }
  75% { background-position: 300% 50%; }
}

.logo {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  animation: logoGradient 3s ease-in-out infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  letter-spacing: 0.5px;
}

@keyframes logoGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.sidebar-nav {
  flex: 1;
  padding: 25px 0;
}

.nav-menu {
  list-style: none;
  padding: 0 12px;
}

.nav-item {
  margin-bottom: 6px;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  position: relative;
  font-weight: 600;
  letter-spacing: 0.3px;
  border: 1px solid transparent;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(4px);
  font-size: 14px;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(236, 72, 153, 0.04) 100%);
  opacity: 0;
  transition: all 0.4s ease;
  border-radius: 16px;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 60%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 0 8px 8px 0;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #ffffff;
  transform: translateX(6px) scale(1.02);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(236, 72, 153, 0.06) 100%);
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.15), 
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link:hover::after {
  width: 4px;
}

.nav-link.active,
.nav-link.router-link-active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  color: #ffffff;
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 
    0 12px 40px rgba(59, 130, 246, 0.25), 
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: translateX(8px) scale(1.02);
  backdrop-filter: blur(8px);
}

.nav-link.active::after {
  width: 4px;
  background: linear-gradient(135deg, #ffffff, #f1f5f9);
}

.nav-link .icon {
  margin-right: 16px;
  font-size: 18px;
  width: 20px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.nav-link:hover .icon {
  transform: scale(1.2) rotate(8deg);
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4));
}

.nav-link.active .icon {
  transform: scale(1.15) rotate(3deg);
  filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.4));
}

/* 多层级菜单样式 */
.nav-item.has-submenu .nav-link {
  position: relative;
}

.nav-item.has-submenu .arrow {
  margin-left: auto;
  font-size: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.08);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
}

.nav-item.has-submenu .arrow.rotated {
  transform: rotate(90deg);
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

 .nav-item.has-submenu.expanded > .nav-link {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(236, 72, 153, 0.08) 100%);
  color: #ffffff;
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
}

.nav-item.has-submenu .arrow:hover {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-item.has-submenu .arrow.rotated {
  transform: rotate(90deg) scale(1.1);
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* 二级菜单样式 */
.submenu {
  list-style: none;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
  border-radius: 0 0 16px 16px;
  margin: 0 12px 8px 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-top: none;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.submenu-item {
  position: relative;
  margin-bottom: 3px;
}

.submenu-link {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  padding-left: 24px;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  margin: 0 10px;
  position: relative;
  letter-spacing: 0.2px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
}

.submenu-link::before {
  content: '';
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #64748b, #475569);
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.submenu-link::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 0 6px 6px 0;
  transition: width 0.3s ease;
}

.submenu-link:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(236, 72, 153, 0.06) 100%);
  color: #ffffff;
  transform: translateX(4px) scale(1.01);
  box-shadow: 
    0 6px 24px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.submenu-link:hover::before {
  transform: translateY(-50%) scale(1.8);
  opacity: 1;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

.submenu-link:hover::after {
  width: 3px;
}

.submenu-link.router-link-active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(236, 72, 153, 0.1) 100%);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transform: translateX(4px) scale(1.01);
}

.submenu-link.router-link-active::after {
  width: 3px;
}

.submenu-link .sub-icon {
  margin-right: 14px;
  font-size: 14px;
  width: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.submenu-link:hover .sub-icon {
  transform: scale(1.15) rotate(5deg);
  filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4));
}

/* 三级菜单样式 */
.submenu-item.has-submenu .submenu-link {
  position: relative;
}

.submenu-item.has-submenu .arrow.small {
  margin-left: auto;
  font-size: 10px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  background: rgba(255, 255, 255, 0.06);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
}

.submenu-item.has-submenu .arrow.small:hover {
  background: linear-gradient(135deg, #ec4899, #be185d);
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.submenu-item.has-submenu .arrow.small.rotated {
  transform: rotate(90deg) scale(1.1);
  background: linear-gradient(135deg, #ec4899, #be185d);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
}

.submenu-item.has-submenu.expanded > .submenu-link {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(190, 24, 93, 0.1) 100%);
  color: #ffffff;
  border-color: rgba(236, 72, 153, 0.3);
  box-shadow: 0 6px 24px rgba(236, 72, 153, 0.2);
}

.sub-submenu {
  list-style: none;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
  border-radius: 12px;
  margin: 4px 0 8px 0;
  width: 100%;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(236, 72, 153, 0.15);
  backdrop-filter: blur(6px);
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.sub-submenu-item {
  position: relative;
  margin-bottom: 2px;
}

.sub-submenu-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 12px;
  padding-left: 40px;
  border-radius: 10px;
  margin: 0 8px;
  font-weight: 600;
  letter-spacing: 0.1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.005) 100%);
  position: relative;
}

.sub-submenu-link::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 40%;
  background: linear-gradient(135deg, #ec4899, #be185d);
  border-radius: 0 4px 4px 0;
  transition: width 0.3s ease;
}

.sub-submenu-link:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(190, 24, 93, 0.08) 100%);
  color: #ffffff;
  transform: translateX(3px) scale(1.01);
  box-shadow: 
    0 4px 16px rgba(236, 72, 153, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.sub-submenu-link:hover::after {
  width: 2px;
}

.sub-submenu-link.router-link-active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(190, 24, 93, 0.15) 100%);
  color: #ec4899;
  border: 1px solid rgba(236, 72, 153, 0.3);
  box-shadow: 
    0 4px 16px rgba(236, 72, 153, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(3px) scale(1.01);
}

.sub-submenu-link.router-link-active::after {
  width: 2px;
}

.sub-submenu-link span {
  position: relative;
}

.sub-submenu-link span:before {
  content: "◦";
  margin-right: 12px;
  color: #64748b;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 14px;
}

.sub-submenu-link:hover span:before {
  color: #ec4899;
  transform: scale(1.2);
}

.sub-submenu-link.router-link-active span:before {
  color: #ec4899;
  transform: scale(1.1);
}

.sub-submenu-link:hover span:before {
  color: #ffffff;
  transform: scale(1.2);
}

/* 菜单动画效果 */
.submenu {
  animation: slideDownFade 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.sub-submenu {
  animation: slideDownFade 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

@keyframes slideDownFade {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0) scale(1);
  }
}

/* 菜单项光泽效果 */
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.nav-link:hover::before {
  left: 100%;
}

/* 活跃状态增强 */
.nav-link.router-link-active {
  position: relative;
  animation: activeGlow 2s ease-in-out infinite;
}

@keyframes activeGlow {
  from {
    box-shadow: 
      0 12px 40px rgba(59, 130, 246, 0.25), 
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  to {
    box-shadow: 
      0 16px 50px rgba(59, 130, 246, 0.35), 
      inset 0 1px 0 rgba(255, 255, 255, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.15),
      0 0 20px rgba(59, 130, 246, 0.2);
  }
}

/* 层级指示器增强 */
.nav-item.has-submenu.expanded {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(139, 92, 246, 0.04) 50%, rgba(236, 72, 153, 0.02) 100%);
  border-radius: 16px;
  box-shadow: inset 0 0 25px rgba(59, 130, 246, 0.08);
  animation: expandedPulse 3s ease-in-out infinite;
}

@keyframes expandedPulse {
  0%, 100% {
    box-shadow: inset 0 0 25px rgba(59, 130, 246, 0.08);
  }
  50% {
    box-shadow: inset 0 0 35px rgba(59, 130, 246, 0.12);
  }
}

.submenu-item.has-submenu.expanded {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.06) 0%, rgba(190, 24, 93, 0.04) 100%);
  border-radius: 12px;
  box-shadow: inset 0 0 20px rgba(236, 72, 153, 0.08);
  animation: subExpandedPulse 3s ease-in-out infinite;
}

@keyframes subExpandedPulse {
  0%, 100% {
    box-shadow: inset 0 0 20px rgba(236, 72, 153, 0.08);
  }
  50% {
    box-shadow: inset 0 0 30px rgba(236, 72, 153, 0.12);
  }
}

/* 悬浮微交互效果 */
.nav-item:hover {
  animation: hoverBounce 0.6s ease-out;
}

@keyframes hoverBounce {
  0% { transform: translateY(0); }
  30% { transform: translateY(-2px); }
  50% { transform: translateY(-1px); }
  100% { transform: translateY(0); }
}

.submenu-item:hover {
  animation: subHoverBounce 0.5s ease-out;
}

@keyframes subHoverBounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-1px); }
  100% { transform: translateY(0); }
}

/* 图标旋转动画 */
.nav-link .icon {
  animation: iconFloat 4s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-1px) rotate(1deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(1px) rotate(-1deg); }
}

.nav-link:hover .icon {
  animation: iconSpin 0.6s ease-out;
}

@keyframes iconSpin {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(8deg); }
  100% { transform: scale(1.2) rotate(8deg); }
}

/* 箭头旋转动画增强 */
.arrow {
  animation: arrowFloat 3s ease-in-out infinite;
}

@keyframes arrowFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1px); }
}

.arrow.rotated {
  animation: arrowRotate 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes arrowRotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(45deg) scale(1.2); }
  100% { transform: rotate(90deg) scale(1.1); }
}

/* 加载动画效果 */
.sidebar {
  animation: sidebarSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes sidebarSlideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 菜单项渐入动画 */
.nav-item {
  animation: menuItemFadeIn 0.6s ease-out;
  animation-fill-mode: both;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.2s; }
.nav-item:nth-child(3) { animation-delay: 0.3s; }
.nav-item:nth-child(4) { animation-delay: 0.4s; }
.nav-item:nth-child(5) { animation-delay: 0.5s; }
.nav-item:nth-child(6) { animation-delay: 0.6s; }

@keyframes menuItemFadeIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
    font-size: 14px;
  }
  
  .nav-link {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .nav-link .icon {
    font-size: 18px;
    margin-right: 12px;
  }
  
  .submenu-link {
    padding: 10px 16px;
    padding-left: 45px;
    font-size: 13px;
  }
  
  .sub-submenu-link {
    padding: 8px 16px;
    padding-left: 50px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  
  .nav-link {
    padding: 10px 14px;
  }
  
  .submenu-link {
    padding: 8px 14px;
    padding-left: 40px;
  }
  
  .sub-submenu-link {
    padding: 6px 14px;
    padding-left: 45px;
  }
}

/* 工具提示样式 */
.nav-link[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  margin-left: 10px;
  opacity: 0;
  animation: fadeInTooltip 0.3s ease-in-out forwards;
}

@keyframes fadeInTooltip {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* 焦点状态 */
.nav-link:focus,
.submenu-link:focus,
.sub-submenu-link:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .sidebar {
    background: #000000;
    border-right: 2px solid #ffffff;
  }
  
  .nav-link {
    color: #ffffff;
    border: 1px solid #ffffff;
  }
  
  .nav-link:hover,
  .nav-link.active {
    background: #ffffff;
    color: #000000;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>