<template> 
  <div style="width:400px">  
      <el-tabs v-model="activeName" @tab-click="handleTabClick" type="border-card">
        <el-tab-pane label="Translate" name="translate">
        </el-tab-pane>
        <el-tab-pane label="Config" name="config" >
          <el-form ref="authForm" :model="authFormData" v-on:submit="handleSubmit">
              <el-form-item label="Access point">
              <el-input v-model="authFormData.accessPoint" placeholder="Enter your access point">
                  <template slot="prepend">https://</template>
              </el-input>
              </el-form-item>
              <el-form-item label="API key" >
                <el-input v-model="authFormData.apiKey" placeholder="Enter your API key" type="password"></el-input>
              </el-form-item>
            <el-button type="primary" @click="handleSubmit">Sign in</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
  </div>  
</template>
<script>
  import User from './user'
  export default {
    data () {
      return {
        activeName: 'config',
        authFormData: {
          accessPoint: 'https://mt-hub.eu/api',
          apiKey: 'PvWK3Im7srIYaudGh'
        }
      }
    },
    computed: { },
    created () {
      console.log('New tab')
    },
    mounted () { },
    methods: {
      tab () {
        chrome.tabs.create({ url: 'pages/app.html' })
      },
      handleTabClick (key, keyPath) {
        console.log(key, keyPath)
      },
      handleSubmit (e) {
        const accessPoint = this.authFormData.accessPoint
        const apiKey = this.authFormData.apiKey
        this.authenticate(accessPoint, apiKey)
        console.log(accessPoint)
        // const accessPoint = submitEvent.target.elements.accessPoint.value
        // console.log(accessPoint)
        // this.authenticate()
      },
      authenticate (accessPoint, apiKey) {
        const component = this
        const user = new User(apiKey, accessPoint)
        user.auth().then(u => {               
            if (user.isAuthenticated()) {
                component.activeName = 'translate'
                console.log("auth ok")
            } else {
                console.log("auth error")
            }
        }).catch(err => {
            console.log(err)   
        })
      },
      openFullScreen2 () {
        console.log('pppppp')
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
        }, 2000)
      }
    }
  }
</script>
<style lang="scss">
  div {
    color: blue
  }
</style>
