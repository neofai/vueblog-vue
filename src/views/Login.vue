<template>
  <div>
    <el-container>
      <el-header>
        <img class="mlogo" src="https://wyz-ccl.oss-cn-shanghai.aliyuncs.com/logo-ccl.png">
      </el-header>

      <el-main>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="info" @click="toHome()">主页</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Login.vue",
  data() {
    return {
      ruleForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios.post('/login',this.ruleForm).then(res => {

            const jwt = res.headers['authorization']
            const userInfo = res.data.data
            //把数据共享出去
            _this.$store.commit("SET_TOKEN",jwt)
            _this.$store.commit("SET_USERINFO",userInfo)

            //跳转
            _this.$router.push("/blogs")
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toHome() {
      this.$router.push("/blogs")
    }
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  padding: 60px;
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
  margin-top: 100px;
}
.mlogo {
  height: 110px;
  margin-top: -55px;
}

.demo-ruleForm {
  max-width: 40%;
  margin: 0 auto;
}
</style>