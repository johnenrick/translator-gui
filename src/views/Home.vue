<template>
  <div class='container'>
    <div class="row">
      <h1>JSON Translator</h1>
    </div>
    <button class="btn btn-danger" @click="resetTranslator">Reset</button>
    <div class="row mt-4">
      <div class="col">
        <div :hidden="isNotifyingLang" class="alert " :class="notifClass" role="alert">
          {{alertMessage}}
        </div>
      </div>
    </div>
    <addLanguage
      @addLang="newAddLanguageV3"
    />
    <div class="container testimonial-group">
      <div class="row flex-nowrap align-self-center">
        <div style="min-width: 650px" class="col border-top border-bottom border-dark" v-for="(colLabel,name) in cols" v-bind:key="name">
          <headers
            class="col border-bottom border-dark"
            :header="colLabel"
            @exportValues="exportRowsV3"
            @importValues="importing"
            @deleteHeader="deleteHeaderV3"
            @alphabetical="sortKeysV3"
          />
            <div v-for="(data,index) in tableEntriesV2" v-bind:key="'data ' + data + index">
              <tableData
                class="col mt-3"
                :val="data[colLabel]"
                :header="colLabel"
                :rowNum="index"
                @edit="editPhraseV3"
                @setEdit="setEditPhrase"
                @up="moveUpV3"
                @down="moveDownV3"
                @removeK="removeKeyV3"
                @dupe="duplicateRowV3"
              />
            </div>
          <input v-show="colLabel != 'KEYS'" type="file" hidden @change="importJSON" :id="colLabel" ref="myFiles" accept=".json">
          <div class="btn-group mt-4 mb-4">
            <button class="btn btn-outline-secondary" @click="importing(colLabel)" v-show="colLabel != 'KEYS'">import</button>
            <button class="btn btn-outline-secondary" v-show="colLabel != 'KEYS'" @click="exportRowsV3(colLabel)">Export</button>
          </div>
        </div>
      </div>
    </div>
    <add-phrase
      @addPhrase="newAddPhraseV3"
    />
    <div class="row mt-4">
      <div class="col">
        <div :hidden="isNotifyingPhrase" class="alert " :class="notifClass" role="alert">
          {{alertMessage}}
        </div>
      </div>
    </div>
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
      cols: ['KEYS'],
      tableEntriesV2:[],
      keys: [],
      timer: Number,
      file: '',
      isEdited: {
        col: String,
        data: String,
        index: Number
      },
      uploader: '',
      keyTableLength: Number,
      isNotifyingLang: true,
      isNotifyingPhrase: true,
      alertMessage: String,
      notifClass: String,
      notifType: ''
    }
  },
  mounted() {
    if(localStorage.getItem("Keys")){
      this.keys = localStorage.getItem("Keys")
      this.keys = JSON.parse(this.keys)
    }
    if(localStorage.getItem("Columns")){
      this.cols = localStorage.getItem("Columns")
      this.cols = JSON.parse(this.cols)
    }
    if(localStorage.getItem("tableEntries")){
      this.tableEntriesV2 = localStorage.getItem("tableEntries")
      this.tableEntriesV2 = JSON.parse(this.tableEntriesV2)
    }
    document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
    this.handleVisibilityChange()
  },
  methods: {
    resetTranslator(){
      this.keys = []
      this.cols = ['KEYS']
      this.tableEntriesV2 = []
      this.newStoreChangesV3()
    },
    setEditPhrase(data,header,row){
      this.isEdited.col = header
      this.isEdited.data = data
      this.isEdited.index = row
    },
    handleVisibilityChange(){
      if(document.visibilityState == 'hidden'){
        this.stopCacheTimer()
      }else if (document.visibilityState == 'visible'){
        this.startCacheTimer()
      }
    },
    stopCacheTimer(){
      clearTimeout(this.timer)
    },
    startCacheTimer(){
      this.timer = setTimeout(() => {
        this.newStoreChangesV3()
        },30000)
    },
    notify(val){
      var indx,msg
      if(val == this.phrase){
        indx = this.keys.indexOf(val)
        msg = val + " already exists! It can be found at line " + indx
        this.isNotifyingPhrase = false
      }else{
        indx = this.cols.indexOf(val)
        msg = val + " already exists!"
        this.isNotifyingLang = false
      }
      indx = indx + 1
      this.notifClass = 'alert-info'
      this.alertMessage = msg
      this.phrase = ''
      setTimeout( () => {
        this.clearNotif()
      },3000)
    },
    clearNotif(){
      this.isNotifyingPhrase = true
      this.isNotifyingLang = true
      this.notifClass = ''
      this.alertMessage = ''
    },
    importing (uploader){
      document.getElementById(uploader).click()
      this.uploader = uploader
    },
    importJSON(event){
      this.stopCacheTimer()
      var theFile = event.target.files[0]
      var fr = new FileReader
      var jsonFile
      fr.onload = function () {
        jsonFile = fr.result
        jsonFile = JSON.parse(jsonFile)
        this.compareKeysV3(jsonFile)
      }.bind(this)
      fr.readAsText(theFile)
    },
    compareKeysV3 (file){
      for(let f in file){
        if(this.keys.indexOf(f) < 0){
          this.keys.push(f)
          this.tableEntriesV2.push({'KEYS': f})
        }
        this.tableEntriesV2[this.keys.indexOf(f)][this.uploader] = file[f]
      }
      this.newStoreChangesV3()
    },
    newAddLanguageV3 (newLang){
      this.stopCacheTimer()
      this.langName = newLang.toUpperCase()
      if(this.cols.indexOf(this.langName) == -1){
        if(this.langName.length > 0){
          this.cols.push(this.langName)
        }
        this.newStoreChangesV3()
      }else{
        this.notify(newLang)
      }
      this.langName = ''
    },   
    newAddPhraseV3(newAddPhrase){
      this.phrase = newAddPhrase
      if(this.keys.indexOf(this.phrase) == -1){
        if(this.phrase.length > 0){
          this.keys.push(this.phrase)
          this.tableEntriesV2.push({'KEYS': this.phrase})
          this.newStoreChangesV3()
        }
      }else{
        this.notify(newAddPhrase)
      }
      this.phrase = ''
    },
    deleteHeaderV3 (val){
      var indx = this.cols.indexOf(val)
      this.tableEntriesV2.forEach(el => {
        delete el[val]
      })
      this.cols.splice(indx,1)
    },
    editPhraseV3(newVal){
      var header = this.isEdited.data[1]
      var num = this.isEdited.data[2]
      if(newVal.target.value == null || newVal.target.value == ''){
        this.removeKeyV3(num)
      }else{
        this.tableEntriesV2[num][header] = newVal.target.value
      }
    },
    sortKeysV3(){
      var len = this.keys.length - 1
      var keyCopy = []
      var dir = []
      var tempArr = []
      this.keys.forEach(el => {
        if(el != '' && el != null){
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
      for(let ctr = 0; ctr <= len ; ctr++){
        tempArr[ctr] = this.tableEntriesV2[dir[ctr]]
      }
      this.tableEntriesV2 = tempArr
      this.keys.sort( (a,b) => {
        let x = a.toUpperCase(),
        y = b.toUpperCase()
        return x == y ? 0 : x > y ? 1 : -1
      })
    },
    duplicateRowV3(indx){
      this.tableEntriesV2.splice(indx,0,this.tableEntriesV2[indx])
      this.keys.splice(indx,0,this.keys[indx])
    },
    removeKeyV3 (indx){
      this.tableEntriesV2.splice(indx,1)
      this.keys.splice(indx,1)
    },
    moveDownV3 (indx) {
      var temp1,temp2
      if(this.keys.length - 1 > indx){
        temp1 = this.tableEntriesV2[indx + 1]
        temp2 = this.tableEntriesV2[indx]
        this.tableEntriesV2[indx] = temp1
        this.tableEntriesV2[indx + 1] = temp2      
        this.keys.splice(indx,2,this.keys[indx + 1],this.keys[indx])
      }
    },
    moveUpV3 (indx) {
      var temp1,temp2
      if(indx >= 1){
        temp1 = this.tableEntriesV2[indx]
        temp2 = this.tableEntriesV2[indx - 1]
        this.tableEntriesV2[indx] = temp2
        this.tableEntriesV2[indx - 1] = temp1
        this.keys.splice(indx - 1,2,this.keys[indx],this.keys[indx - 1])
      }
    },
    newStoreChangesV3(){
      var keys = JSON.stringify(this.keys)
      var cols = JSON.stringify(this.cols)
      var toStore = JSON.stringify(this.tableEntriesV2)
      localStorage.setItem('tableEntries', toStore)
      localStorage.setItem('Keys', keys)
      localStorage.setItem('Columns', cols)
      this.startCacheTimer()
    },
    exportRowsV3(header){
      clearTimeout(this.timer)
      var tempK, tempV
      var row = {}
      for(let el in this.tableEntriesV2){
        tempK = this.tableEntriesV2[el]['KEYS']
        tempV = this.tableEntriesV2[el][header]
        Object.assign(row, {[tempK]: tempV})
      }
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(row, null, '\t'))
      var downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href",     dataStr)
      downloadAnchorNode.setAttribute("download", header + ".json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
      this.newStoreChangesV3()
    },
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
