<template> 
  <div style="width:450px" id="main">
    <el-container id="header">
      <div id="logo-container"><div id="logo"><img src="./assets/imgs/logo-mt-hub-small.png"></div></div><h1>Web translator</h1>
    </el-container>   
    <div id="tabs">    
      <el-tabs v-model="data.tabs.activeTab" type="border-card">
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
        <el-tab-pane label="Log in" name="login" >
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
              <el-button ref="authenticateButton" type="primary" @click="authenticate" :loading="data.authenticateLoading">Log in</el-button>
          </el-form>
        </el-tab-pane> 
        <!-- Options -->
        <el-tab-pane label="Options" name="options">
          <el-form ref="optionForm">  
            <p id="options-info">For a better user experience, this plug-in store your api key and the acccess point you used. 
              You can delete these data clicking the "delete button" above.</p>      
            <el-button type="primary" @click="restore" size="small">Delete</el-button>
          </el-form>
        </el-tab-pane>          
      </el-tabs>    
    </div>
    <el-row>
      <el-col :span="24">
        <el-card id="credits-card" :body-style="{ padding: '15px' }">
          <el-container>
            <div id="logo-ce-container"><img src="./assets/imgs/logo_ce-en-pantone-hr.jpg" id="logo-ce" /></div>
            <div id="credits">
              This project has received funding from the European Comission
            </div>
          </el-container> 
        </el-card>
      </el-col>
    </el-row>
       
  </div>  
</template>
<script>
  import User from './user'

  const STORAGE_VERSION = 'v4'
  const STORAGE_DATA = 'app-data' + STORAGE_VERSION
  const STORAGE_DATA_DATE = 'app-data-date' + STORAGE_VERSION
  const STORAGE_DATA_EXPIRE = 15 * 60 * 1000 // 15 mins
  const STORAGE_AUTH = 'app-auth' + STORAGE_VERSION
  const STORAGE_AUTH_DATE = 'app-auth-date' + STORAGE_VERSION
  const STORAGE_AUTH_EXPIRE = 90 * 24 * 60 * 60 * 1000 // 90 dias

  function getDefault (authFormData) {
    // PvWK3Im7srIYaudGh
    if (authFormData == null) {
      authFormData = {
        accessPoint: 'https://mt-hub.eu/api',
        apiKey: ''
      }
    }
    let data = {
      // Tabs
      tabs: {
        activeTab: 'login',
        translateTabDisabled: 1
      },
      // Translate form
      translateForm: {
        srcLangName: null,
        engine: null,
        enginesByLang: {}
      },
      // AutForm
      authFormData: authFormData,

      // Auth loading
      authenticateLoading: false

    }
    return data
  }

  export default {
    data () {
      return {
        data: getDefault()
      }
    },
    computed: { },
    created () {
      this.init()
    },
    mounted () { },
    methods: {
      // Sign in
      signIn () {
  
      },
      authenticate () {
        // Loading animation for the log in button
        this.data.authenticateLoading = true

        // That is this
        const that = this
  
        // Login
        const accessPoint = this.data.authFormData.accessPoint
        const apiKey = this.data.authFormData.apiKey
        const user = new User(apiKey, accessPoint)
        user.auth().then(u => {
          // Close loading animation
          this.data.authenticateLoading = false
  
          if (user.isAuthenticated()) {
            // Tab
            that.data.tabs.activeTab = 'translate'
            that.data.tabs.translateTabDisabled = 0

            // Translate form restore language selection
            that.data.translateForm.srcLangName = null
            that.data.translateForm.engine = null

            // Add languages
            const enginesByLang = user.getEnginesByLang()
            that.data.translateForm.enginesByLang = enginesByLang
  
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
            that.saveData()
            that.saveAuth()
          } else {
            that.$message.error('Oops, authentication error. please, retry..')
            console.log('auth error')
          }
        })
      },

      saveData () {
        const data = JSON.stringify(this.data)
        const date = Date.now()
        localStorage.setItem(STORAGE_DATA, data)
        localStorage.setItem(STORAGE_DATA_DATE, date)
      },

      saveAuth () {
        const authFormData = JSON.stringify(this.data.authFormData)
        const date = Date.now()
        localStorage.setItem(STORAGE_AUTH, authFormData)
        localStorage.setItem(STORAGE_AUTH_DATE, date)
      },

      init () {
        if (localStorage.hasOwnProperty(STORAGE_DATA) && localStorage.hasOwnProperty(STORAGE_DATA_DATE)) {
          const data = JSON.parse(localStorage.getItem(STORAGE_DATA))
          const now = Date.now()
          const date = new Date(parseInt(localStorage.getItem(STORAGE_DATA_DATE)))
          if (now - date.getTime() < STORAGE_DATA_EXPIRE) {
            this.data = data
          } else {
            // todo: eliminar storage
            if (localStorage.hasOwnProperty(STORAGE_AUTH) && localStorage.hasOwnProperty(STORAGE_AUTH_DATE)) {
              const authFormData = JSON.parse(localStorage.getItem(STORAGE_AUTH))
              const now = Date.now()
              const date = new Date(parseInt(localStorage.getItem(STORAGE_AUTH_DATE)))
              this.data.authFormData = authFormData
              if (now - date.getTime() < STORAGE_AUTH_EXPIRE) {
                this.data.authFormData = authFormData
                // this.authenticate()
              } else {
                // TODO: eliminar storage
              }
            }
          }
        }
      },
      notifiyAuthError () {
        this.$notify.error({
          title: 'Authentication error',
          message: 'Please, retry...',
          duration: 3000
        })
      },
  
      // When srcLang is selected we update tgtlang
      srcLangNameChanged () {
        const srcLangName = this.data.translateForm.srcLangName
        const engines = this.data.translateForm.enginesByLang[srcLangName]
  
        let engineToSelect = null
        let engineSelected = this.data.translateForm.engine

        for (let e of engines) {
          if (engineSelected != null) {
            if (e.tgtLang === engineSelected.tgtLang) {
              engineToSelect = e
              break
            }
          }
        }
        this.data.translateForm.engine = engineToSelect
        this.saveData()
      },

      // When tgt lang is selected
      engineSelected () {
        console.log('Engine selected manually', this.data.translateForm.engine)
        this.saveData()
      },

      // Translate current tab
      translate () {
        console.log('Translating')
        const srcLang = this.data.translateForm.engine.srcLang
        const tgtLang = this.data.translateForm.engine.tgtLang
        const domain = this.data.translateForm.engine.domain
        const apiKey = this.data.authFormData.apiKey
        const accessPoint = this.data.authFormData.accessPoint
        const batchSize = 20
  
        // send the js code to current tab
        const code = `window.webPageTranslator.translate("${srcLang}", "${tgtLang}", "${domain}", "${apiKey}", "${accessPoint}", ${batchSize})`
        // console.log(code)
        chrome.tabs.executeScript(null, {code: code})
        // chrome.tabs.executeScript(null, {file: 'js/content.js'}, function () {
        //   // start translation
        // })
      },

      // Restore
      restore () {
        console.log('restore')
        // Restore data
        this.data = getDefault()

        // remove local storage
        const storages = [
          STORAGE_DATA,
          STORAGE_DATA_DATE,
          STORAGE_AUTH,
          STORAGE_AUTH
        ]
        storages.forEach(key => {
          console.log(key)
          if (localStorage.hasOwnProperty(key)) {
            console.log('delete storage', key)
            localStorage.clear(key)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  #header {
    margin-bottom:8px;
  }
  #logo-container {
    float:left;
    padding-left:2px
  }
  h1 {
    font-size:14px;    
    color:#3B3B3B;
    font-weight:bold;
    float:left;
    padding-left: 5px;
    margin:0;
    line-height: 26px;
    vertical-align: middle;
    text-transform: uppercase;
  }


  #logo {
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color:#3B3B3B;
    padding:3px;
    text-align: center;
    display: block;
    line-height: 0;
    overflow: hidden;
  }

  #logo img {
    width:20px;
    height: auto;
  }

  #options-info {
    margin-top:0
  }

  #credits-card {
    margin-top:10px
  }
  #logo-ce-container {
    float: left;
  }
  #credits {
    float:left;
    width: 200px;
    padding-top:19px;
    padding-left:15px;
  }

  #logo-ce {
    width:100px;
    height: auto;
  }

  
</style>