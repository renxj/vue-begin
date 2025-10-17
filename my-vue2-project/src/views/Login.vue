<template>
    <div class="login-container">
      <div class="login-wrapper">
        <h1 class="login-title">用户登录</h1>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <input 
              v-model="username" 
              type="text" 
              placeholder="请输入11位手机号" 
              :class="{ 'error': usernameError, 'valid': usernameValid }"
              @blur="validateUsername"
              @input="onUsernameInput"
              required>
            <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
            <div v-if="usernameValid && !usernameError" class="success-message">✓ 手机号格式正确</div>
          </div>
          <div class="input-group">
            <input 
              v-model="password" 
              type="password" 
              placeholder="请输入密码（至少8位，包含大小写字母和数字）" 
              :class="{ 'error': passwordError, 'valid': passwordValid }"
              @blur="validatePassword"
              @input="onPasswordInput"
              required>
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            <div v-if="passwordValid && !passwordError" class="success-message">✓ 密码强度符合要求</div>
          </div>
          <button 
            type="submit" 
            class="login-btn" 
            :disabled="!isFormValid || isLoading"
            :class="{ 'disabled': !isFormValid || isLoading }">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
      usernameValid: false,
      passwordValid: false,
      isLoading: false
    }
  },
  computed: {
    isFormValid() {
      return this.usernameValid && this.passwordValid && !this.usernameError && !this.passwordError
    }
  },
  methods: {
    // 手机号验证
    validateUsername() {
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!this.username) {
        this.usernameError = '请输入手机号'
        this.usernameValid = false
      } else if (!phoneRegex.test(this.username)) {
        this.usernameError = '请输入正确的11位手机号'
        this.usernameValid = false
      } else {
        this.usernameError = ''
        this.usernameValid = true
      }
    },
    
    // 密码验证
    validatePassword() {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
      if (!this.password) {
        this.passwordError = '请输入密码'
        this.passwordValid = false
      } else if (this.password.length < 8) {
        this.passwordError = '密码长度不能少于8位'
        this.passwordValid = false
      } else if (!passwordRegex.test(this.password)) {
        this.passwordError = '密码必须包含大写字母、小写字母和数字'
        this.passwordValid = false
      } else {
        this.passwordError = ''
        this.passwordValid = true
      }
    },
    
    // 用户名输入时的实时验证
    onUsernameInput() {
      if (this.usernameError || this.usernameValid) {
        this.validateUsername()
      }
    },
    
    // 密码输入时的实时验证
    onPasswordInput() {
      if (this.passwordError || this.passwordValid) {
        this.validatePassword()
      }
    },
    
    // 表单提交
    async handleLogin() {
      // 先进行完整验证
      this.validateUsername()
      this.validatePassword()
      
      if (!this.isFormValid) {
        return
      }
      
      this.isLoading = true
      
      try {
        // 调用 Vuex store 的登录 action
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
        
        // 登录成功后处理重定向
        const redirectPath = this.$route.query.redirect || '/dashboard'
        this.$router.push(redirectPath)
        
      } catch (error) {
        console.error('登录失败:', error)
        // 可以在这里显示错误信息给用户
        alert('登录失败，请检查用户名和密码')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
  
  <style scoped>
  .login-container {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    margin: 0;
    overflow-x: hidden;
  }
  
  .login-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="50" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="30" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }
  
  .login-wrapper {
    position: relative;
    z-index: 1;
    text-align: center;
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
  }
  
  .login-title {
    color: white;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 30px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    letter-spacing: 2px;
  }
  
  form {
    background: rgba(255, 255, 255, 0.95);
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 400px;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    box-sizing: border-box;
  }
  
  form::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
  }
  
  form:hover::before {
    left: 100%;
  }
  
  .input-group {
    margin-bottom: 15px;
    position: relative;
    min-height: 70px; /* 为输入框和提示信息预留固定高度 */
  }
  
  input {
    width: 100%;
    padding: 16px 20px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.9);
    position: relative;
    z-index: 1;
  }
  
  input.error {
    border-color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
  }
  
  input.valid {
    border-color: #51cf66;
    background: rgba(81, 207, 102, 0.1);
  }
  
  .error-message {
    color: #ff6b6b;
    font-size: 14px;
    position: absolute;
    top: 54px; /* 输入框高度 + 边距 */
    left: 5px;
    right: 5px;
    animation: shake 0.3s ease-in-out;
    line-height: 1.4;
  }
  
  .success-message {
    color: #51cf66;
    font-size: 14px;
    position: absolute;
    top: 54px; /* 输入框高度 + 边距 */
    left: 5px;
    right: 5px;
    animation: fadeIn 0.3s ease-in-out;
    line-height: 1.4;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
  }
  
  input::placeholder {
    color: #a0a0a0;
    font-weight: 400;
  }
  
  .login-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    margin-top: 10px;
  }
  
  .login-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  .login-btn:hover:not(.disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
  }
  
  .login-btn:hover:not(.disabled)::before {
    left: 100%;
  }
  
  .login-btn:active:not(.disabled) {
    transform: translateY(-1px);
  }
  
  .login-btn.disabled {
    background: linear-gradient(135deg, #a0a0a0 0%, #808080 100%);
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
  
  .login-btn:disabled {
    background: linear-gradient(135deg, #a0a0a0 0%, #808080 100%);
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
  
  /* 响应式设计 */
  @media (max-width: 480px) {
    .login-container {
      padding: 15px;
    }
    
    .login-title {
      font-size: 28px;
      margin-bottom: 25px;
    }
    
    form {
      padding: 30px 25px;
    }
    
    .input-group {
      min-height: 65px; /* 小屏幕上稍微减少高度 */
      margin-bottom: 12px;
    }
    
    input, .login-btn {
      padding: 14px 18px;
      font-size: 15px;
    }
    
    .error-message, .success-message {
      top: 48px; /* 调整小屏幕上的提示位置 */
      font-size: 13px;
    }
  }
  
  @media (max-width: 320px) {
    .login-title {
      font-size: 24px;
    }
    
    form {
      padding: 25px 20px;
    }
    
    .input-group {
      min-height: 60px; /* 超小屏幕上进一步减少高度 */
      margin-bottom: 10px;
    }
    
    .error-message, .success-message {
      top: 44px; /* 调整超小屏幕上的提示位置 */
      font-size: 12px;
    }
  }
  </style>