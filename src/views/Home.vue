<template>
  <div class='container'>
    <div class="row">
      <h1>JSON Translator</h1>
    </div>
    <button class="btn btn-danger" @click="resetTranslator">Reset</button>
    <addLanguage
      @addLang="newAddLanguage"
    />
    <div class="container testimonial-group">
      <div class="row flex-nowrap align-self-center">
        <div style="min-width: 650px" class="col border-top border-bottom border-dark" v-for="row in rows" v-bind:key="row">
          <headers
            class="col border-bottom border-dark"
            :header="row.header"
            @exportValues="exportRows"
            @importValues="importing"
            @deleteHeader="deleteHeader"
            @alphabetical="sortKeys"
          />
            <div v-for="(data,index) in row.rows" v-bind:key="'data ' + data + index">
              <tableData
                class="col mt-3"
                :val="data"
                :header="row.header"
                :rowNum="index"
                @edit="editPhrase"
                @setEdit="setEditPhrase"
                @up="moveUp"
                @down="moveDown"
                @removeK="removeKey"
                @dupe="duplicateRow"
              />
            </div>
          <input v-show="row.header != 'Keys'" type="file" hidden @change="importJSON" :id="row.header" ref="myFiles" accept=".json">
          <div class="btn-group mt-4 mb-4">
            <button class="btn btn-outline-secondary" @click="importing(row.header)" v-show="row.header != 'Keys'">import</button>
            <button class="btn btn-outline-secondary" v-show="row.header != 'Keys'" @click="exportRows(row.header)">Export</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col">
        <div :hidden="isNotifying" class="alert " :class="notifClass" role="alert">
          {{alertMessage}}
        </div>
      </div>
    </div>
    <add-phrase
      @addPhrase="newAddPhrase"
    />
  </div>
</template>

<script>

import headers from "../components/Headers.vue"
import tableData from "../components/TableData.vue"
import addLanguage from "../components/AddLanguage.vue"
import addPhrase from "../components/AddPhrase.vue"

export default {
  name: 'Home',
  components: {
    headers,
    tableData,
    addLanguage,
    addPhrase
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
      autosave: false,
      isNotifying: true,
      alertMessage: String,
      notifClass: String,
      notifType: {
        success: 'alert-success',
        fail: 'alert-danger',
        info: 'alert-info'
      }
      
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
      if(newVal.target.value == ''){
        if(header == "Keys"){
          this.removeKey(num)
        }else{
          this.rows[this.cols.indexOf(header)].rows[num] = null  
        }
      }else{
      this.rows[this.cols.indexOf(header)].rows[num] = newVal.target.value
      }
      this.newStoreChanges("rows")
    },
    duplicateRow(indx){
      this.rows.forEach(el => {
        el.rows.splice(indx,0,el.rows[indx])
      })
      this.keys.splice(indx,0,this.keys[indx])
      this.newStoreChanges('rows')
    },
    sortKeys(){
      var len = this.keyTableLength - 1
      var keyCopy = []
      var dir = []
      var tempArr = []
      this.keys.forEach(el => {
        if(el != '' || el != null){
          keyCopy.push(el)
        }
      })
      keyCopy.sort( (a,b) => {
        let x = a.toUpperCase(),
        y = b.toUpperCase()
        return x == y ? 0 : x > y ? 1 : -1
      })
      keyCopy.forEach(el=>{
        dir.push(this.keys.indexOf(el))
      })
      for(let col in this.rows){
        for(let ctr = 0; ctr <= len; ctr ++){
          if(this.rows[col].rows[dir[ctr]]){
            tempArr[ctr] = this.rows[col].rows[dir[ctr]]
          }else{
            tempArr[ctr] = null
          }
        }
        this.rows[col].rows = tempArr
        tempArr = []
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
    newAddLanguage (newLang){
      this.langName = newLang.charAt(0).toUpperCase() + newLang.slice(1)
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
      }
    },
    newAddPhrase(newAddPhrase){
      this.phrase = newAddPhrase
      if(this.keys.indexOf(this.phrase) == -1){
        if(this.phrase.length > 0){
          for(let x in this.rows){
            if(x == 0){
              this.rows[x].rows.push(this.phrase)    
            }else{
              this.rows[x].rows.push(null)
            }  
          }
          this.keys.push(this.phrase)
          this.phrase = ''
          this.newStoreChanges("rows")
        }
      }else{
        this.phrase = ''
        this.notify('info')
      }
    },
    notify(type){
      var indx = this.keys.indexOf(this.phrase)
      indx = indx + 1
      this.isNotifying = false
      this.notifClass = this.notifType[type]
      this.alertMessage = this.phrase + " already exists! It can be found at line " + indx
      this.phrase = ''
      setTimeout( () => {
        this.clearNotif()
      },3000)
    },
    clearNotif(){
      this.isNotifying = false
      this.notifClass = ''
      this.alertMessage = ''
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
      if(this.autosave == false){
        this.autosave = true
        this.handleVisibilityChange()
      }
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
      var newRows = []
      var obj = {
        header: lang,
        rows: []
      }
      if(this.keys.length > 0){
        newRows = Array(this.keys.length).fill(null)
      }
      obj.rows = newRows
      this.rows.push(obj)
      this.newStoreChanges()
    },
    moveUp (indx) {
      if(indx >= 1){
      var newIndex = indx - 1
      this.rows.forEach(el => {
        el.rows.splice(newIndex,2,el.rows[indx],el.rows[newIndex])
      })
      this.keys.splice(newIndex,2,this.keys[indx],this.keys[newIndex])
      }
      this.newStoreChanges('rows')
    },
    moveDown (indx) {
      if(this.keys.length - 1 > indx){
      this.rows.forEach(el => {
        el.rows.splice(indx,2,el.rows[indx + 1],el.rows[indx])
      })
      this.keys.splice(indx,2,this.keys[indx + 1],this.keys[indx])
      }
      this.newStoreChanges('rows')
    },
    removeKey (indx){
      this.keys.splice(indx,1)
      for(let el in this.rows){
        this.rows[el].rows.splice(indx,1) 
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
              toPush.rows[this.keys.length - 1] = null
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
            this.rows[x].rows.push(null)
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
.testimonial-group > .row {
  overflow-x: auto;
  white-space: nowrap;
}
.testimonial-group > .row > .col {
  display: inline-block;
  float: none;
}
</style>
