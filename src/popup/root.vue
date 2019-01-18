<template> 
  <div style="width:450px">  
      <el-tabs v-model="data.tabs.activeTab" @tab-click="handleTabClick" type="border-card">
        <el-tab-pane label="Translate" name="translate" :disabled="data.tabs.translateTabDisabled == 1? true:false">
            <el-form ref="form">
            <el-row :gutter="15">
              <el-col :span="12">
                <!-- Source language -->
                <el-form-item label="Source Language">
                  <el-select v-model="data.translateForm.srcLangName" placeholder="Source Language" @change="srcLangNameChanged">
                    <el-option
                      v-for="(item, index) in data.translateForm.enginesByLang"
                      :key="index"
                      :label="index"
                      :value="index">
                    </el-option>             
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- Target language -->
                <el-form-item label="Target Language">
                  <el-select v-model="data.translateForm.engine" @change="engineSelected" placeholder="Target Language" value-key="index">
                    <el-option                    
                      v-for="option in data.translateForm.enginesByLang[data.translateForm.srcLangName]"
                      :key="option.index"                    
                      :label="option.tgtLangName"
                      :value="option">
                    </el-option>              
                  </el-select>
                </el-form-item>
              </el-col>                 
            </el-row>
            <el-row> 
              <!-- Translate button -->
              <el-col :span="24">
                <el-button type="primary" :disabled="data.translateForm.engine == null? true:false" @click="translate">Translate</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- AuthForm -->
        <el-tab-pane label="Config" name="config" >
          <el-form ref="authForm">
              <!--  Access point -->
              <el-form-item label="Access point">
                <el-input v-model="data.authFormData.accessPoint" placeholder="Enter your access point">
                    <template slot="prepend">https://</template>
                </el-input>            
              </el-form-item>
              <!--  Api key  -->
              <el-form-item label="API key" >
                <el-input v-model="data.authFormData.apiKey" placeholder="Enter your API key" type="password"></el-input>
              </el-form-item>
              <!--  Sign in -->
              <el-button type="primary" @click="handleSubmit">Sign in</el-button>
          </el-form>
        </el-tab-pane> 
        <!-- Options -->
        <el-tab-pane label="Options" name="options">
          <el-form ref="optionForm">  
            This plugin store personal information       
            <el-button type="primary">Restore</el-button>
          </el-form>
        </el-tab-pane>          
      </el-tabs>
  </div>  
</template>
<script>
  import User from './user'

  const STORAGE_VERSION = 'v4'

  const STORAGE_DATA = 'app-data' + STORAGE_VERSION
  const STORAGE_DATA_DATE = 'app-data-date' + STORAGE_VERSION
  const STORAGE_DATA_EXPIRE =  1000 // 1 mins
  
  const STORAGE_AUTH = 'app-auth' + STORAGE_VERSION
  const STORAGE_AUTH_DATE = 'app-auth-date' + STORAGE_VERSION
  const STORAGE_AUTH_EXPIRE = 30*24*60*60*1000 //30 dias

  function getDefault(authFormData) {
    //PvWK3Im7srIYaudGh
    if (authFormData == null) {
      authFormData =  {
        accessPoint: 'https://mt-hub.eu/api',
        apiKey: ''
      } 
    }
    let data =  {
      // Tabs
      tabs: {
        activeTab: 'config',        
        translateTabDisabled: 1,  
      },
      // Translate form
      translateForm: {
        srcLangName: null,
        engine: null,
        enginesByLang: {}
      },  
      // AutForm
      authFormData: authFormData 
    }
    return data
  }

  export default {
    data () {
      return {
        data:getDefault()
      }
    },
    computed: { },
    created () {
      this.restoreData()
    },
    mounted () { },
    methods: {
      handleTabClick (key, keyPath) {
        console.log(key, keyPath)
      },
      handleSubmit (e) {
        const accessPoint = this.data.authFormData.accessPoint
        const apiKey = this.data.authFormData.apiKey
        this.authenticate(accessPoint, apiKey)
      },
      authenticate (accessPoint, apiKey) {
        const component = this
        const user = new User(apiKey, accessPoint)
        user.auth().then(u => {               
            if (user.isAuthenticated()) {
                // Tab
                component.data.tabs.activeTab = 'translate'
                component.data.tabs.translateTabDisabled = 0

                // Translate form
                const enginesByLang = user.getEnginesByLang()              
                component.data.translateForm.enginesByLang = enginesByLang

                // Translate form default Selection
                // let defaultSelection = null
                // for (let srcLangName in engineByLang) {
                //     defaultSelection = {
                //       srcLangName: srcLangName,
                //       engineIndex: engineByLang[srcLangName][0].index
                //     }
                //     break
                // }
                // if (defaultSelection !== null) {
                //   component.data.translateForm.srcLangName = defaultSelection.srcLangName
                //   component.data.translateForm.engineIndex = defaultSelection.engineIndex
                // }

                component.saveData()
                component.saveAuth()              
            } else {
                component.notifiyAuthError()
                console.log("auth error")
            }
        }).catch(err => {
            component.notifiyAuthError()
            console.log(err)   
        })
      },

      saveData() {
          const data = JSON.stringify(this.data)
          const date = Date.now()
          localStorage.setItem(STORAGE_DATA, data)
          localStorage.setItem(STORAGE_DATA_DATE, date) 
      },

      saveAuth() {
          const authFormData = JSON.stringify(this.data.authFormData)
          const date = Date.now()
          localStorage.setItem(STORAGE_AUTH, authFormData)
          localStorage.setItem(STORAGE_AUTH_DATE, date)
      },

      restoreData() {
        if (localStorage.hasOwnProperty(STORAGE_DATA) && localStorage.hasOwnProperty(STORAGE_DATA_DATE)) {
          const data = JSON.parse(localStorage.getItem(STORAGE_DATA))
          const now = Date.now()
          const date = new Date(parseInt(localStorage.getItem(STORAGE_DATA_DATE)))         
          if (now - date.getTime() < STORAGE_DATA_EXPIRE) {
            this.data = data
          } else {
            if (localStorage.hasOwnProperty(STORAGE_AUTH) && localStorage.hasOwnProperty(STORAGE_AUTH_DATE)) {
              const authFormData = JSON.parse(localStorage.getItem(STORAGE_AUTH))
              const now = Date.now()
              const date = new Date(parseInt(localStorage.getItem(STORAGE_AUTH_DATE)))  
              this.data.authFormData = authFormData
              if (now - date.getTime() < STORAGE_AUTH_EXPIRE) {
                  this.data.authFormData = authFormData
              }                 
            }
          }          
        }
      },
      notifiyAuthError() {
        this.$notify.error({
          title: 'Authentication error',
          message: 'Please, retry...',
          duration: 3000
        });
      },
      openFullScreen2 () {
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
      // When srcLang is selected we update tgtlang
      srcLangNameChanged() {
          const srcLangName = this.data.translateForm.srcLangName
          const engines = this.data.translateForm.enginesByLang[srcLangName]
          
          let engineToSelect = null
          let engineSelected = this.data.translateForm.engine

          for (let e of engines){
            if (engineSelected != null) {
              if (e.tgtLang == engineSelected.tgtLang) {
                engineToSelect = e
                break
              }
            } 
          }
          this.data.translateForm.engine = engineToSelect
      },
      engineSelected() {
        console.log("Engine selected manually", this.data.translateForm.engine)
      },
      handleChange(value) {
        console.log(value);
      },
      // Translate current tab
      translate(){
        // send the js file
        chrome.tabs.executeScript(null, {file:'js/content.js'},function(){
          // start translation
          chrome.tabs.executeScript(null,{code:'window.director.hello()'});
        });
      }
    }
  }
</script>
<style lang="scss">

</style>