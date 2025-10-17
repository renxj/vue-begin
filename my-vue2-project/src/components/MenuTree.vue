<template>
  <el-submenu v-if="item && item.type === 'submenu' && hasVisibleChildren" :index="item.index">
    <template slot="title">
      <i v-if="item.icon" :class="item.icon"></i>
      <span>{{ item.title }}</span>
    </template>
    <menu-tree
      v-for="(child, cidx) in visibleChildren"
      :key="child.index || cidx"
      :item="child"
    />
  </el-submenu>
  <el-menu-item v-else-if="allowed" :index="item && item.index">
    <i v-if="item && item.icon" :class="item.icon"></i>
    <span>{{ item && item.title }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    userRoles() {
      const u = this.$store.getters.currentUser
      const roles = Array.isArray(u && u.roles) ? u.roles : (u && u.role ? [u.role] : [])
      return roles || []
    },
    allowed() {
      return this.isAllowed(this.item)
    },
    visibleChildren() {
      const children = Array.isArray(this.item && this.item.children) ? this.item.children : []
      return children.filter(child => this.isAllowed(child))
    },
    hasVisibleChildren() {
      return this.visibleChildren.length > 0
    }
  },
  methods: {
    isAllowed(it) {
      const required = Array.isArray(it && it.roles) ? it.roles : []
      if (!required.length) return true
      const ur = this.userRoles
      if (!ur || !ur.length) return false
      return required.some(r => ur.includes(r))
    }
  }
}
</script>