<template> 
  <div style="width:500px" id="main">
    <!-- Header -->
    <el-container id="header">
      <div id="logo-container"><div id="logo"><img src="./assets/imgs/logo-mt-hub-small.png"></div></div><h1>Web translator</h1>
    </el-container>  
    
    <!-- Tabs -->
    <div id="tabs">    
      <el-tabs v-model="data.activeTab" type="border-card">
        <el-tab-pane label="Translate" name="translate" :disabled="data.translateTabDisabled == 1? true:false">
            <el-form ref="form">
              <el-row>
                <el-col :span="24">
                  <!-- Engine Selector -->
                  <el-form-item label="Please, choose a translation engine" >
                    <el-cascader
                        expand-trigger="hover"
                        @change="engineSelected"
                        :options="data.engines"
                        v-model="data.engine"
                        style="width:100%"
                        placeholder="Domain / Source language / Target langugae">
                    </el-cascader>
                  </el-form-item> 
                </el-col>
              </el-row>
            <el-row> 
              <!-- Translate button -->
              <el-col :span="24">
                <el-button type="primary" :disabled="data.engine == null? true:false" @click="translate">Translate</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- Login Form -->
        <el-tab-pane label="Log in" name="login" >
          <el-form>
              <!--  Access point -->
              <el-form-item label="Access point">
                <el-input v-model="data.accessPoint" placeholder="Enter your access point">
                    <template slot="prepend">https://</template>
                </el-input>            
              </el-form-item>
              <!--  Api key  -->
              <el-form-item label="API key" >
                <el-input v-model="data.apiKey" placeholder="Enter your API key" type="password"></el-input>
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

  const STORAGE_VERSION = 'v5'
  const STORAGE_DATA = 'app-data' + STORAGE_VERSION
  const STORAGE_DATA_DATE = 'app-data-date' + STORAGE_VERSION
  const STORAGE_DATA_EXPIRE = 15 * 60 * 1000
  const STORAGE_AUTH = 'app-auth' + STORAGE_VERSION
  const STORAGE_AUTH_DATE = 'app-auth-date' + STORAGE_VERSION
  const STORAGE_AUTH_EXPIRE = 90 * 24 * 60 * 60 * 1000 // 90 dias

  function getDefault () {
    // PvWK3Im7srIYaudGh

    let data = {
      // Tabs
      activeTab: 'login',
      translateTabDisabled: 1,
  
      accessPoint: 'https://mt-hub.eu/api',
      apiKey: '',

      engines: [],
      engine: null,

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
      authenticate () {
        // Loading animation for the log in button
        this.data.authenticateLoading = true

        // That is this
        const that = this
  
        // Login
        const accessPoint = this.data.accessPoint
        const apiKey = this.data.apiKey
        const user = new User(apiKey, accessPoint)
        user.auth().then(u => {
          // Close loading animation
          this.data.authenticateLoading = false
  
          if (user.isAuthenticated()) {
            // Tab
            that.data.activeTab = 'translate'
            that.data.translateTabDisabled = 0

            // Translate form restore language selection
            that.data.engine = null

            // populate engine selector
            const engineCascader = user.getEngineCascader()
            this.data.engines = engineCascader
  
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
        const auth = JSON.stringify({
          accessPoint: this.data.accessPoint,
          apiKey: this.data.apiKey
        })
        const date = Date.now()
        localStorage.setItem(STORAGE_AUTH, auth)
        localStorage.setItem(STORAGE_AUTH_DATE, date)
      },

      init () {
        console.log("Popup: init")
        if (localStorage.hasOwnProperty(STORAGE_DATA) && localStorage.hasOwnProperty(STORAGE_DATA_DATE)) {
          const data = JSON.parse(localStorage.getItem(STORAGE_DATA))
          const now = Date.now()
          const date = new Date(parseInt(localStorage.getItem(STORAGE_DATA_DATE)))
          if (now - date.getTime() < STORAGE_DATA_EXPIRE) {
            console.log("Popup: Use stored data")
            // We restore the data
            this.data = data
            // We update the date
            localStorage.setItem(STORAGE_DATA_DATE, now)
          } else { 
            // We clear data storage because it has expired
            this.clearStorage(STORAGE_DATA)
            this.clearStorage(STORAGE_DATA_DATE)
            this.initFromAuth()        
          }
        } else {
          this.initFromAuth()
        }
      },
      
      // Init from auth
      initFromAuth() {
        console.log("Popup: Try to init from auth")
        console.log(localStorage.getItem(STORAGE_AUTH))
        if (localStorage.hasOwnProperty(STORAGE_AUTH) && localStorage.hasOwnProperty(STORAGE_AUTH_DATE)) {         
          const auth = JSON.parse(localStorage.getItem(STORAGE_AUTH))
          console.log("Popup: Auth data found")
          const now = Date.now()
          const date = new Date(parseInt(localStorage.getItem(STORAGE_AUTH_DATE)))

          if (now - date.getTime() < STORAGE_AUTH_EXPIRE) {
            console.log("Popup: auth data not expired")
            this.data.accessPoint = auth.accessPoint
            this.data.apiKey = auth.apiKey
          } else {
            this.clearStorage(STORAGE_AUTH)
            this.clearStorage(STORAGE_AUTH_DATE)
          }
        }
      },      

      engineSelected () {
        this.saveData()
      },

      // Translate current tab
      translate () {
  
        console.log('Translating')
        const srcLang = this.data.engine[1]
        const tgtLang = this.data.engine[2]
        const domain = this.data.engine[0]
        const apiKey = this.data.apiKey
        const accessPoint = this.data.accessPoint
        const batchSize = 20
  
        // send the js code to current tab
        const code = `window.webPageTranslator.translate("${srcLang}", "${tgtLang}", "${domain}", "${apiKey}", "${accessPoint}", ${batchSize})`
        console.log(`Translate: "${srcLang}", "${tgtLang}", "${domain}", "${accessPoint}", ${batchSize}"`)
        const that = this
        chrome.tabs.executeScript(null, {code: code}, function() {
          that.$message.success({'message':'Translation started...', duration:5000})
          setTimeout(function(){ window.close() }, 5000);
        })    
      },

      // Restore
      restore () {
        console.log('restore')
        // Restore data
        this.data = getDefault()

        // Remove local storage
        const storages = [
          STORAGE_DATA,
          STORAGE_DATA_DATE,
          STORAGE_AUTH,
          STORAGE_AUTH
        ]
        storages.forEach(key => {
          this.clearStorage(key)
        })
      },
      // Clear a storage key
      clearStorage (key) {
        console.log('Delete storage', key)
        if (localStorage.hasOwnProperty(key)) {
          localStorage.removeItem(key)
        }
      }
    }
  }
</script>
<style lang="scss">

  #header {
    margin-bottom:8px;
  }
  /* Header */
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
  
  /* Cascader */
  .el-cascader-menu__item--extensible:after {
    right: 10px !important;
  }

  .el-cascader-menu {
     min-width: 150px !important;
  }

  .el-cascader-menu__item {
    padding-left:15px !important;
    padding-right:15px !important;
  }  

  /* Footer */
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