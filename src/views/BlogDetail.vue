<template>
  <div>
    <Header></Header>
    <div class="mblog">
      <h2 class="mtitle">{{ blog.title }}</h2>
      <div class="micon">
        <el-link icon="el-icon-edit" v-if="ownBlog">
          <router-link :to="{name: 'BlogEdit',params:{blogId: blog.id}}">
            编辑博客
          </router-link>
        </el-link>
        <el-link icon="el-icon-delete" v-if="ownblog">
          <el-button type="danger" round @click="delblog">删除</el-button>
        </el-link>
      </div>
      <el-divider></el-divider>
      <div class="markdown-body" v-html="blog.content"></div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import 'github-markdown-css/github-markdown.css'
export default {
  name: "BlogDetail.vue",
  components: {Header},
  data() {
    return {
      blog: {
        id: '',
        title: '',
        content: ''
      },
      ownBlog: false
    }
  },
  methods: {
    delblog () {
      const blogId = this.$route.params.blogid
      const _this = this
      if (blogId) {
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.post(`/blog/delete/${blogId}`, null, {
            headers: {
              "Authorization": localStorage.getItem("token")
            }
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.data.data
            });
            _this.$router.push("/blogs")
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  },
  created() {
    //获取动态路由的 blogid
    const blogId = this.$route.params.blogId
    const _this = this
    if (blogId) {
      this.$axios.get('/blog/'+blogId).then(res => {
        const blog = res.data.data
        _this.blog.id = blog.id
        _this.blog.title = blog.title
        _this.blog.description = blog.description

        //用markdown渲染博客内容
        const MarkdownIt = require("markdown-it");
        const md = new MarkdownIt();
        const result = md.render(blog.content);
        _this.blog.content = result
        //编辑和刪除按钮展示条件
        _this.ownBlog = (blog.userId === _this.$store.getters.getUser.id)
      })
    }
  }
}
</script>

<style scoped>
  .mblog {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: auto;
    min-height: 700px;
    padding: 20px 15px;
  }
  .mtitle {
    text-align: center;
  }
  .micon {
    text-align: right;
  }
</style>