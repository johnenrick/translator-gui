<template>
  <div class='container'>
    <div class="row">
      <h1>JSON Translator</h1>
    </div>
    <div class="row mb-4">
      <div class="col">
        <div class="row mb-2 p-4">
          <div class="col-4">
            <button class="btn btn-outline-primary" @click="newAddLanguage">Add language</button>
          </div>
          <div class="col-8">
            <input class="form-control" @keydown.enter="newAddLanguage" v-model="langName">
          </div>
        </div>
        <div class="row mt-4"><span class="header-border"></span></div>
      </div>
    </div>
    <div class="grid-container">
      <div v-for="row in rows" v-bind:key="row">
        <div class="row" style="min-height: 40px">
          <div class="col">
            {{row.header}}
          </div>
          <div class="col">
            <div class="btn-group">
              <button class="btn btn-outline-secondary" @click="importing(row.header)" v-show="row.header != 'Keys'">import</button>
              <button class="btn btn-outline-secondary" v-show="row.header != 'Keys'" @click="exportRows(row.header)">Export</button>
            </div>
          </div>
        </div>
        <div class="row mt-4"><span class="header-border"></span></div>
        <div class="row mt-3">
          <div v-for="data in row.rows" v-bind:key="data">
            <div  class="input-group border-bottom" style="min-height: 40px">
              <div class="input-group-prepend" v-show="row.header == 'Keys'">
                <span class="input-group-text" @click="hey(this.id)" :id="row.rows.indexOf(data)">{{row.rows.indexOf(data) + 1}}</span>
              </div>
              <input style="min-height: 40px" class="form-control border-0" @keydown.enter="editPhrase($event)" @click="setEditPhrase(data,row.header)" :value="data" type="text"/>
              <button style="height: 40px; width: 40px" class="btn btn-outline-secondary rounded-circle" v-show="row.header == 'Keys'" @click="moveUp(data)"><span class="arrow up"/></button>
              <button style="height: 40px; width: 40px" class="btn btn-outline-secondary rounded-circle" v-show="row.header == 'Keys'" @click="moveDown(data)"><span class="arrow down"/></button>
              <button class="btn btn-outline-danger rounded-pill" v-show="row.header == 'Keys'" @click="removeKey(data)">Delete</button>
              <button style="height: 40px; width: 40px" class="btn btn-outline-danger rounded-circle" v-show="row.header != 'Keys' && isEdited.col == row.header && isEdited.data == data" @click="removePhrase">X</button>
            </div>
          </div>
        </div>
        <input v-show="row.header != 'Keys'" type="file" hidden @change="importJSON" :id="row.header" ref="myFiles" accept=".json">
        <div class="btn-group mt-4">
          <button class="btn btn-outline-secondary" @click="importing(row.header)" v-show="row.header != 'Keys'">import</button>
          <button class="btn btn-outline-secondary" v-show="row.header != 'Keys'" @click="exportRows(row.header)">Export</button>
        </div>
      </div>
    </div>
    <div>
      <span class="header-border"></span>
    </div>
    <div class="row mt-4"><span class="header-border"></span></div>
    <div class="row mt-4 p-4">
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
      keys: [],
      timer: Number,
      editKeyButtonText: 'Edit',
      file: '',
      isEdited: {
        col: String,
        data: String
      },
      uploader: '',
      keyTableLength: Number,
      order: 0,
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
      this.keyTableLength = this.keys.length
    }
    document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
  },
  methods: {
    hey(val){
      console.log(val)
    },
    editPhrase(newVal){
      var header = this.isEdited.col
      var data = this.isEdited.data
      this.rows[this.cols.indexOf(header)].rows[this.rows[this.cols.indexOf(header)].rows.indexOf(data)] = newVal.target.value
      this.newStoreChanges("rows")
    },
    removePhrase(){
      var header = this.isEdited.col
      var data = this.isEdited.data
      this.rows[this.cols.indexOf(header)].rows[this.rows[this.cols.indexOf(header)].rows.indexOf(data)] = ''
      this.newStoreChanges("rows")
    },
    setEditPhrase(data,header){
      this.isEdited.col = header
      this.isEdited.data = data
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
      if(this.keys.indexOf(this.phrase) == -1){
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
      }else{
        console.log("phrase already exists")
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
        temp = this.keys[indx + 1]
        this.keys[indx] = temp
        this.keys[indx + 1] = key
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
      this.keyTableLength = this.keys.length
      this.addImported(toPush)
    },
    addImported (toAdd){
      for(let row in this.rows){
        if(toAdd.header == this.rows[row].header){
          this.rows[row] = toAdd
        }
      }
      this.checkTranslationColLength()
    },
    checkTranslationColLength(){
      for(let x in this.rows){
        if(this.rows[x].rows.length < this.keyTableLength){
          let ctr = this.keyTableLength - this.rows[x].rows.length
          for(; ctr > 0; ctr--){
            this.rows[x].rows.push('')
          }
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
