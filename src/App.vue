<template>
  <div class='container'>
    <div class="row">
      <h1>JSON Translator</h1>
    </div>
    <div class="row mb-4">
      <div class="col">
        <div class="row mb-2">
          <div class="col-4">
            <button class="btn btn-outline-primary" @click="newAddLanguage">Add language</button>
          </div>
          <div class="col-8">
            <input class="form-control" v-model="langName">
          </div>
        </div>
        <div class="row mt-4"><span class="header-border"></span></div>
        <div class="col">
          <div v-for="lang in langs" v-bind:key="lang">
            {{lang}}
            <input type="file" v-bind:hidden="isHidden" ref="input">
            <button class="btn btn-outline-secondary" @click="importing">import</button>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-container">
      <div v-for="row in rows" v-bind:key="row">
        {{row.header}}
        <div class="grid-data">
          <div class="row mt-3">
            <div v-for="data in row.rows" v-bind:key="data" class="bordered">
              <div class="grid-options">
                <div @click="editPhrase(data)" style="margin-left: 15%, float: left; min-height: 32px">{{data}}</div>
                <div style="float:right; text-align: right; margin-right: 25px">
                  <div style="max-height: 18px" v-show="row.header == 'Keys'" @click="moveUp(data)" class="arrow up"/>
                    <div style="max-height: 18px; margin-right: 15px" v-show="row.header == 'Keys'" @click="moveDown(data)" class="arrow down"/>
                      <button class="btn btn-outline-secondary btn-sm" v-show="row.header == 'Keys'" @click="removeKey(data)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <input v-show="row.header != 'Keys'" type="file" hidden @change="importJSON" :id="row.header" ref="myFiles" accept=".json">
        <div class="btn-group">
          <button class="btn btn-outline-secondary" @click="importing(row.header)" v-show="row.header != 'Keys'">import</button>
          <button class="btn btn-outline-secondary" v-show="row.header != 'Keys'" @click="exportRows(row.header)">Export</button>
        </div>
      </div>
    </div>
    <div>
      <span class="header-border"></span>
    </div>
    <div class="row mt-4"><span class="header-border"></span></div>
    <div class="row mt-4">
      <div class="col-4">
        <button class="btn btn-outline-primary" @click="newAddPhrase">Add Phrase</button>
      </div>
      <div class="col-8">
        <input class="form-control" v-model="phrase">
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      langName: '',
      phrase: '',
      cols: ['Keys'],
      rows: [{
        header: 'Keys',
        rows: []
      }],
      langs: [],
      keys: [],
      timer: Number,
      isHidden: true,
      editKeyButtonText: 'Edit',
      file: '',
      isUsing: 0,
      uploader: '',
      autosave: false
      
    }
  },
  mounted() {
    if(localStorage.getItem("cols")){
      this.cols = localStorage.getItem("cols")
      this.cols = JSON.parse(this.cols)
    }
    if(localStorage.getItem("rows")){
      this.rows = localStorage.getItem("rows")
      this.rows = JSON.parse(this.rows)
      for(let el in this.rows[0].rows){
        this.keys[el] = this.rows[0].rows[el]
      }
    }
    document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
    this.isUsing = document.hidden
  },
  methods: {
    editPhrase(data){
      console.log(data + " is being edited")
    },
    handleVisibilityChange(){
      if(document.visibilityState == 'hidden'){
        clearInterval(this.timer)
      }else if (document.visibilityState == 'visible'){
        if(this.autosave == true){
          this.timer = setInterval(() => {
            this.newStoreChanges('rows')
            this.newStoreChanges('cols')
          },30000)
        }
      }
    },
    newAddLanguage (){
      if(this.langName.length > 0){
        var x = this.langName.charAt(0).toUpperCase() + this.langName.slice(1);
        this.cols.push(x)
        var header = x
        this.initLangRows(header)
        this.langName = ""
        this.newStoreChanges("cols")
      }
    },
    newAddPhrase(){
      if(this.phrase.length > 0){
        for(let x in this.rows){
          if(x == 0){
            this.rows[x].rows.push(this.phrase)    
          }else{
            this.rows[x].rows.push('')
          }  
        }
        this.keys.push(this.phrase)
        this.phrase = ''
        this.newStoreChanges("rows")
      }
    },
    importing (uploader){
      document.getElementById(uploader).click()
      this.uploader = uploader
    },
    exportRows(header){
      var tempK, tempV
      var row = {}
      for(let r in this.rows){
        if(header == this.rows[r].header){
          for(let el in this.rows[r].rows){
            tempK = this.keys[el]
            tempV = this.rows[r].rows[el]
            Object.assign(row, {[tempK]: tempV})
          }
        }
      }
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(row, null, '\t'))
      var downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href",     dataStr)
      downloadAnchorNode.setAttribute("download", header + ".json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
      this.newStoreChanges('rows')
      this.newStoreChanges('cols')
      this.autosave = true
    },
    newStoreChanges(type){
      this.autosave = true
      var toStore = []
      if(type == 'cols'){
        this.cols.forEach(element => {
          toStore.push(element)
        })
      }else if(type == 'rows'){
        this.rows.forEach(element => {
          toStore.push(element)
        })
      }else{
        type = 'rows'
        toStore = this.rows
      }
      toStore = JSON.stringify(toStore)
      localStorage.setItem(type, toStore)
    },
    initLangRows(lang){
      var arr = this.keys
      var obj = {
        header: '',
        rows: []
      }
      for(let el in arr){
        obj.rows[el] = ''
      }
      obj.header = lang
      this.rows.push(obj)
      this.newStoreChanges()
    },
    moveUp (key) {
      var temp, indx, val
      indx = this.keys.indexOf(key)
      if(indx > 0){
        temp = this.keys[indx - 1]
        this.keys[indx] = temp
        this.keys[indx - 1] = key
      }
      for(let el in this.rows){
        if(indx > 0){
          val = this.rows[el].rows[indx]
          temp = this.rows[el].rows[indx - 1]
          this.rows[el].rows[indx - 1] = val
          this.rows[el].rows[indx] = temp
        }
      }
      this.newStoreChanges('rows')
    },
    moveDown (key) {
      var temp, indx, val
      indx = this.keys.indexOf(key)
      if(indx < this.keys.length - 1){
        temp = this.keys[indx - 1]
        this.keys[indx] = temp
        this.keys[indx - 1] = key
      }
      for(let el in this.rows){
        if(indx < this.rows[el].rows.length - 1){
          val = this.rows[el].rows[indx]
          temp = this.rows[el].rows[indx + 1]
          this.rows[el].rows[indx + 1] = val
          this.rows[el].rows[indx] = temp
        }
      }
      this.newStoreChanges('rows')
    },
    removeKey (key){
      var indx = this.keys.indexOf(key)
      if(indx > -1){
        for(let el in this.rows){
          this.rows[el].rows.splice(indx,1) 
        }
      }
      this.newStoreChanges('rows')
    },
    importJSON(event){
      var theFile = event.target.files[0]
      var fr = new FileReader
      var jsonFile
      fr.onload = function () {
        jsonFile = fr.result
        jsonFile = JSON.parse(jsonFile)
        this.compareKeys(jsonFile)
      }.bind(this)
      fr.readAsText(theFile)
      this.isHidden = !this.isHidden
    },
    compareKeys (file){
      var toPush = {
        header: this.uploader,
        rows: []
      }
      for(let lang in this.cols){
        if(this.cols[lang] == this.uploader){
          for(let f in file){
            if(this.keys.indexOf(f) > -1){
              toPush.rows[this.keys.indexOf(f)] = file[f]
            }else{
              this.keys.push(f)
              this.rows[0].rows.push(f)
              toPush.rows[this.keys.indexOf(f)] = file[f]
            }
            if(this.keys.length > toPush.rows.length){
              toPush.rows[this.keys.length - 1] = ''
            }
          }
        }
      }
      this.addImported(toPush)
    },
    addImported (toAdd){
      for(let row in this.rows){
        if(toAdd.header == this.rows[row].header){
          this.rows[row] = toAdd
        }
      }
      this.newStoreChanges()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.counter {
  font-size: 80px
}
.buttons button{
  font-size: 20px;
  margin: 0 10px;
}
.grid-options{
  display: grid;
  grid-auto-flow: column;
}
.grid-container{
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 200px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.grid-data{
  display: grid;
  grid-auto-flow: row;
  text-align: left;
}
.bordered{
  margin-top: 5px;
  margin-bottom: 5px;
  border-bottom: solid;
  border-width: thin;
  min-height: 20px;
}
.header-border{
  margin-top: 5px;
  margin-bottom: 5px;
  border-width: thick;
  border-bottom: solid;
}
.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  margin-right: 5px;
}
.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
