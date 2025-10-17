<template>
  <div class="user-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-users"></i>
        用户管理
      </h1>
      <button class="btn btn-primary" @click="openAddDialog">
        <i class="fas fa-plus"></i>
        添加用户
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-group">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索用户名、邮箱或手机号..."
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 用户列表表格 -->
    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>头像</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>手机号</th>
            <th>角色</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
            <td>{{ user.id }}</td>
            <td>
              <div class="avatar">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.username" />
                <div v-else class="avatar-placeholder">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
              </div>
            </td>
            <td class="username">{{ user.username }}</td>
            <td class="email">{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <span class="role-badge" :class="user.role">
                {{ getRoleText(user.role) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="user.status">
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td class="create-time">{{ formatDate(user.createTime) }}</td>
            <td class="actions">
              <button 
                class="btn btn-sm btn-edit" 
                @click="openEditDialog(user)"
                title="编辑"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn btn-sm btn-delete" 
                @click="confirmDelete(user)"
                title="删除"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 空状态 -->
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <i class="fas fa-users"></i>
        <p>暂无用户数据</p>
      </div>
    </div>

    <!-- 用户表单对话框 -->
    <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>{{ isEdit ? '编辑用户' : '添加用户' }}</h3>
          <button class="close-btn" @click="closeDialog">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="user-form">
          <div class="form-group">
            <label>用户名 *</label>
            <input 
              type="text" 
              v-model="formData.username" 
              required 
              placeholder="请输入用户名"
            />
          </div>
          
          <div class="form-group">
            <label>邮箱 *</label>
            <input 
              type="email" 
              v-model="formData.email" 
              required 
              placeholder="请输入邮箱地址"
            />
          </div>
          
          <div class="form-group">
            <label>手机号</label>
            <input 
              type="tel" 
              v-model="formData.phone" 
              placeholder="请输入手机号"
            />
          </div>
          
          <div class="form-group">
            <label>角色 *</label>
            <select v-model="formData.role" required>
              <option value="">请选择角色</option>
              <option value="admin">管理员</option>
              <option value="user">普通用户</option>
              <option value="guest">访客</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>状态</label>
            <select v-model="formData.status">
              <option value="active">激活</option>
              <option value="inactive">未激活</option>
              <option value="banned">已禁用</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeDialog">
              取消
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEdit ? '更新' : '添加' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="dialog-overlay" @click="closeDeleteDialog">
      <div class="dialog dialog-sm" @click.stop>
        <div class="dialog-header">
          <h3>确认删除</h3>
        </div>
        <div class="dialog-body">
          <p>确定要删除用户 <strong>{{ deleteUser.username }}</strong> 吗？</p>
          <p class="warning">此操作不可恢复！</p>
        </div>
        <div class="dialog-actions">
          <button class="btn btn-secondary" @click="closeDeleteDialog">
            取消
          </button>
          <button class="btn btn-danger" @click="deleteUserConfirm">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      users: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          phone: '13800138000',
          role: 'admin',
          status: 'active',
          avatar: '',
          createTime: new Date('2024-01-01')
        },
        {
          id: 2,
          username: 'john_doe',
          email: 'john@example.com',
          phone: '13800138001',
          role: 'user',
          status: 'active',
          avatar: '',
          createTime: new Date('2024-01-15')
        },
        {
          id: 3,
          username: 'jane_smith',
          email: 'jane@example.com',
          phone: '13800138002',
          role: 'user',
          status: 'inactive',
          avatar: '',
          createTime: new Date('2024-02-01')
        }
      ],
      searchKeyword: '',
      showDialog: false,
      showDeleteDialog: false,
      isEdit: false,
      currentUser: null,
      deleteUser: null,
      formData: {
        username: '',
        email: '',
        phone: '',
        role: '',
        status: 'active'
      }
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchKeyword) {
        return this.users
      }
      const keyword = this.searchKeyword.toLowerCase()
      return this.users.filter(user => 
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.includes(keyword)
      )
    }
  },
  methods: {
    // 搜索处理
    handleSearch() {
      // 实时搜索，由computed属性处理
    },
    
    // 打开添加对话框
    openAddDialog() {
      this.isEdit = false
      this.currentUser = null
      this.formData = {
        username: '',
        email: '',
        phone: '',
        role: '',
        status: 'active'
      }
      this.showDialog = true
    },
    
    // 打开编辑对话框
    openEditDialog(user) {
      this.isEdit = true
      this.currentUser = user
      this.formData = {
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
      this.showDialog = true
    },
    
    // 关闭对话框
    closeDialog() {
      this.showDialog = false
      this.currentUser = null
    },
    
    // 提交表单
    submitForm() {
      if (this.isEdit) {
        this.updateUser()
      } else {
        this.addUser()
      }
    },
    
    // 添加用户
    addUser() {
      const newUser = {
        id: Math.max(...this.users.map(u => u.id)) + 1,
        ...this.formData,
        avatar: '',
        createTime: new Date()
      }
      this.users.push(newUser)
      this.closeDialog()
      this.$message?.success('用户添加成功！')
    },
    
    // 更新用户
    updateUser() {
      const index = this.users.findIndex(u => u.id === this.currentUser.id)
      if (index !== -1) {
        this.users.splice(index, 1, {
          ...this.currentUser,
          ...this.formData
        })
      }
      this.closeDialog()
      this.$message?.success('用户更新成功！')
    },
    
    // 确认删除
    confirmDelete(user) {
      this.deleteUser = user
      this.showDeleteDialog = true
    },
    
    // 关闭删除对话框
    closeDeleteDialog() {
      this.showDeleteDialog = false
      this.deleteUser = null
    },
    
    // 删除用户确认
    deleteUserConfirm() {
      const index = this.users.findIndex(u => u.id === this.deleteUser.id)
      if (index !== -1) {
        this.users.splice(index, 1)
      }
      this.closeDeleteDialog()
      this.$message?.success('用户删除成功！')
    },
    
    // 获取角色文本
    getRoleText(role) {
      const roleMap = {
        admin: '管理员',
        user: '普通用户',
        guest: '访客'
      }
      return roleMap[role] || role
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        active: '激活',
        inactive: '未激活',
        banned: '已禁用'
      }
      return statusMap[status] || status
    },
    
    // 格式化日期
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN')
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title i {
  color: #3b82f6;
}

/* 搜索栏 */
.search-bar {
  margin-bottom: 24px;
}

.search-input-group {
  position: relative;
  max-width: 400px;
}

.search-input-group i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input-group input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 用户表格 */
.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.user-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.user-row:hover {
  background: #f8fafc;
}

/* 头像 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

/* 用户名 */
.username {
  font-weight: 500;
  color: #1e293b;
}

/* 邮箱 */
.email {
  color: #64748b;
}

/* 角色徽章 */
.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background: #fef3c7;
  color: #d97706;
}

.role-badge.user {
  background: #dbeafe;
  color: #2563eb;
}

.role-badge.guest {
  background: #f3f4f6;
  color: #6b7280;
}

/* 状态徽章 */
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.inactive {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.banned {
  background: #fee2e2;
  color: #dc2626;
}

/* 创建时间 */
.create-time {
  color: #64748b;
  font-size: 14px;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 8px;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
}

.btn-edit {
  background: #f0f9ff;
  color: #0284c7;
}

.btn-edit:hover {
  background: #0284c7;
  color: white;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #dc2626;
  color: white;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.dialog {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-sm {
  max-width: 400px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #374151;
}

.dialog-body {
  padding: 20px 24px;
}

.warning {
  color: #dc2626;
  font-size: 14px;
  margin-top: 8px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

/* 表单样式 */
.user-form {
  padding: 20px 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .user-table {
    font-size: 14px;
  }
  
  .user-table th,
  .user-table td {
    padding: 12px 8px;
  }
  
  .dialog {
    margin: 16px;
    width: calc(100% - 32px);
  }
}
</style>