<template> 
  <div style="width:400px">  
      <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="border-card">
        <el-tab-pane label="Translate" name="translate" :disabled="translateTabDisabled == 1? true:false">
            <el-row>
              <el-col :span="12">
                <el-select v-model="firstOption"  placeholder="">
                  <el-option
                    v-for="(item, index) in list"
                    :key="index"
                    :label="index"
                    :value="index">
                  </el-option>             
                </el-select>
              </el-col>
              <el-col :span="12">
                  <el-select v-model="secondOption" placeholder="">
                  <el-option                    
                    v-for="option in list[firstOption]"
                    :key="option.index"
                    :label="option.tgtLangName"
                    :value="option.index">
                  </el-option>              
                </el-select></el-col>
            </el-row>
       
            <el-row> 
              <el-col :span="24"><div class="grid-content"><el-button type="primary">Translate</el-button></div></el-col>
            </el-row>
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
        // Tabs
        activeTab: 'config',        
        translateTabDisabled:1,
        // Auth form
        authFormData: {
          accessPoint: 'https://mt-hub.eu/api',
          apiKey: 'PvWK3Im7srIYaudGh'
        },
        // Language selection
        firstOption: null,
        secondOption: null,
        list: {
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
                component.list = user.getEngineByLang()
                component.translateTabDisabled = 0
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
      },
      
      handleChange(value) {
        console.log(value);
      }


    }
  }
</script>
<style lang="scss">
  div {
    color: blue
  }
</style>
