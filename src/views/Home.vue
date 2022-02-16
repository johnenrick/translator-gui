<template>
  <div class='container'>
    <div class="row">
      <h1>JSON Translator</h1>
    </div>
    <button class="btn btn-danger" @click="resetTranslator">Reset</button>
    <div class="row">
      <div class="col">
        <div class="row mb-2 p-4">
          <div class="col-4">
            <button class="btn btn-outline-primary" @click="newAddLanguage">Add language</button>
          </div>
          <div class="col-8">
            <input class="form-control" @keydown.enter="newAddLanguage" v-model="langName">
          </div>
        </div>
      </div>
    </div>
    <div class="grid-container">
      <div v-for="row in rows" v-bind:key="row">
        <div class="row"><span class="header-border mb-4"></span></div>
        <headers
          :header="row.header"
          @exportValues="exportRows"
          @importValues="importing"
          @deleteHeader="deleteHeader"
          @alphabetical="sortKeys"
        />
        <div class="row mt-3"><span class="header-border"></span></div>
        <div class="row mt-3">
          <div v-for="(data,index) in row.rows" v-bind:key="'data ' + data + index">
            <tableData
              :val="data"
              :header="row.header"
              :rowNum="index"
              @edit="editPhrase"
              @setEdit="setEditPhrase"
              @up="moveUp"
              @down="moveDown"
              @removeK="removeKey"
            />
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

import headers from "../components/Headers.vue"
import tableData from "../components/TableData.vue"

export default {
  name: 'Home',
  components: {
    headers,
    tableData
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
        data: String,
        index: Number
      },
      uploader: '',
      keyTableLength: Number,
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
    resetTranslator(){
      this.keys = []
      this.cols = ['Keys']
      this.rows = []
      this.rows.push({'header': 'Keys', 'rows': []})
      this.newStoreChanges('rows')
      this.newStoreChanges('cols')
    },
    editPhrase(newVal){
      var header = this.isEdited.data[1]
      var num = this.isEdited.data[2]
      this.rows[this.cols.indexOf(header) + 1].rows[num] = newVal.target.value
      this.newStoreChanges("rows")
    },
    sortKeys(){
      var keyCopy = []
      var dir = []
      this.keys.forEach(el => [
        keyCopy.push(el)
      ])
      keyCopy.sort( (a,b) => {
        let x = a.toUpperCase(),
        y = b.toUpperCase()
        return x == y ? 0 : x > y ? 1 : -1
      })
      keyCopy.forEach(el=>{
        dir.push(this.keys.indexOf(el))
      })
      for(let col in this.rows){
        var tempArr = []
        for(let row in this.rows[col].rows){
          if(this.rows[col].rows[dir[row]]){
            tempArr.push(this.rows[col].rows[dir[row]])
          }else{
            tempArr.push('')
          }
        }
        this.rows[col].rows = tempArr
      }
      this.keys.sort( (a,b) => {
        let x = a.toUpperCase(),
        y = b.toUpperCase()
        return x == y ? 0 : x > y ? 1 : -1
      })
      this.newStoreChanges('rows')
    },
    deleteHeader (val){
      var indx = this.cols.indexOf(val)
      this.rows.splice(indx,1)
      this.cols.splice(indx,1)
      this.newStoreChanges('cols')
      this.newStoreChanges('rows')
    },
    setEditPhrase(data,header,row){
      this.isEdited.col = header
      this.isEdited.data = data
      this.isEdited.index = row
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
      this.langName = this.langName.charAt(0).toUpperCase() + this.langName.slice(1)
      if(this.cols.indexOf(this.langName) == -1){
        if(this.langName.length > 0){
          this.cols.push(this.langName)
          var header = this.langName
          this.initLangRows(header)
          this.langName = ""
          this.newStoreChanges("cols")
        }
      }else{
        this.langName = ''
        console.log("language already exists")
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
        this.phrase = ''
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
.cross {
    height: 100px;
    width: 100px;
    border-radius: 5px;
    position: relative;
}
.cross:after {
    position: inline-block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "\274c"; /* use the hex value here... */
    color: #FFF;
}
</style>
