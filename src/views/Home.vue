<template>
  <div class='container'>
    <div class="row">
      <h1>JSON Translator</h1>
    </div>
    <div class="row standard-height">
      <div class="col">
        <button class="btn btn-danger" @click="resetTranslator">Reset</button>
      </div>
      <div class="col">
        <button @click="storeChanges" class="btn btn-info">Save</button>
      </div>
    </div>
    <div class="row standard-height mt-4">
      <div class="col">
        <div :hidden="isNotifyingLang" class="alert " :class="notifClass" role="alert">
          {{alertMessage}}
        </div>
      </div>
    </div>
    <addLanguage
      @addLang="addLanguage"
    />
    <view-switcher
      @switch="switchView"
    />
    <div class="container testimonial-group">
      <div class="row align-self-center">
        <div class="row standard-height flex-nowrap align-self-center">
          <headers
            class="col border-bottom border-dark very-wide"
            :header="'KEYS'"
            @exportValues="exportRows"
            @importValues="importing"
            @deleteHeader="deleteHeader"
            @alphabetical="sortKeys"
          />
          <div class="col very-wide border-bottom border-dark" v-for="col in cols" :key="col">
            <headers
              :header="col"
              @exportValues="exportRows"
              @importValues="importing"
              @deleteHeader="deleteHeader"
              @alphabetical="sortKeys"
            />
            <input type="file" hidden @change="importJSON" :id="col" ref="myFiles" accept=".json">
          </div>
        </div>
        <div v-show="(viewType == 'All rows') || (viewType == 'Lacking rows' && (Object.keys(entry).length < cols.length + 1 || Object.values(entry).indexOf(null) > -1))" class="row standard-height flex-nowrap align-self-center mt-3" v-for="(entry,index) in tableEntries" :key="entry">
          <div class="col very-wide border-bottom">
            <table-data
              :val="entry['KEYS']"
              :rowNum="index"
              :header="'KEYS'"
              @edit="editPhrase"
              @up="moveUp"
              @down="moveDown"
              @removeK="removeKey"
              @dupe="duplicateRow"
            />
          </div>
          <div class="col border-bottom very-wide" v-for="col in cols" :key="col">
            <div>
            <textarea
              class="form-control border-0"
              @change="setEditPhrase($event)"
              :value="entry[col]"
              type="text"
            />
            </div>
          </div>
        </div>
        <div class="row standard-height flex-nowrap align-self-center mt-4">
          <div class="col very-wide">
            <button class="btn btn-outline-secondary rounded" @click="sortKeys">Sort (A-Z)</button>
          </div>
        <div class="col very-wide" v-for="col in cols" :key="col">
          <button class="btn btn-outline-secondary" @click="importing(col)">Import</button>
          <button class="btn btn-outline-secondary"  @click="exportRows(col)">Export</button>
          <input type="file" hidden @change="importJSON" :id="col" ref="myFiles" accept=".json">
        </div>
      </div>
    </div>
  </div>
    <add-phrase
      @addPhrase="addPhrase"
    />
    <div class="row standard-height mt-4">
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
import viewSwitcher from "../components/viewSwitcher.vue"

export default {
  name: 'Home',
  components: {
    headers,
    tableData,
    addLanguage,
    addPhrase,
    viewSwitcher
  },
  data() {
    return {
      viewType: 'All rows',
      langName: '',
      phrase: '',
      cols: [],
      tableEntries:[],
      keys: [],
      timer: Number,
      file: '',
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
      this.tableEntries = localStorage.getItem("tableEntries")
      this.tableEntries = JSON.parse(this.tableEntries)
    }
    document.addEventListener("visibilitychange", this.handleVisibilityChange, false)
    this.handleVisibilityChange()
  },
  methods: {
    switchView(val){
      var status = val.target.checked
      if(status){
        this.viewType = 'Lacking rows'
      }else{
        this.viewType = 'All rows'
      }
    },
    resetTranslator(){
      this.keys = []
      this.cols = []
      this.tableEntries = []
      this.storeChanges()
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
        this.storeChanges()
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
      var file
      fr.onload = function () {
        file = fr.result
        file = JSON.parse(file)
        for(let f in file){
          if(this.keys.indexOf(f) < 0){
            this.keys.push(f)
            this.tableEntries.push({'KEYS': f})
          }
          this.tableEntries[this.keys.indexOf(f)][this.uploader] = file[f]
        }
        this.storeChanges()
      }.bind(this)
      fr.readAsText(theFile)
    },
    addLanguage(newLang){
      this.stopCacheTimer()
      this.langName = newLang.toUpperCase()
      if(this.cols.indexOf(this.langName) == -1){
        if(this.langName.length > 0){
          this.cols.push(this.langName)
        }
        this.storeChanges()
      }else{
        this.notify(newLang)
      }
      this.langName = ''
    },   
    addPhrase(newPhrase){
      this.phrase = newPhrase
      if(this.keys.indexOf(this.phrase) == -1){
        if(this.phrase.length > 0){
          this.keys.push(this.phrase)
          this.tableEntries.push({'KEYS': this.phrase})
          this.storeChanges()
        }
      }else{
        this.notify(newPhrase)
      }
      this.phrase = ''
    },
    deleteHeader(val){
      var indx = this.cols.indexOf(val)
      this.tableEntries.forEach(el => {
        delete el[val]
      })
      this.cols.splice(indx,1)
    },
    editPhrase(vals){
      if(vals[0].target.value == null || vals[0].target.value == ''){
        this.removeKey(vals[2])
      }else{
        this.tableEntries[vals[2]][vals[1]] = vals[0].target.value
      }
    },
    sortKeys(){
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
        tempArr[ctr] = this.tableEntries[dir[ctr]]
      }
      this.tableEntries = tempArr
      this.keys.sort( (a,b) => {
        let x = a.toUpperCase(),
        y = b.toUpperCase()
        return x == y ? 0 : x > y ? 1 : -1
      })
    },
    duplicateRow(indx){
      this.tableEntries.splice(indx,0,this.tableEntries[indx])
      this.keys.splice(indx,0,this.keys[indx])
    },
    removeKey(indx){
      this.tableEntries.splice(indx,1)
      this.keys.splice(indx,1)
    },
    moveDown(indx) {
      var temp1,temp2
      if(this.keys.length - 1 > indx){
        temp1 = this.tableEntries[indx + 1]
        temp2 = this.tableEntries[indx]
        this.tableEntries[indx] = temp1
        this.tableEntries[indx + 1] = temp2      
        this.keys.splice(indx,2,this.keys[indx + 1],this.keys[indx])
      }
    },
    moveUp(indx) {
      var temp1,temp2
      if(indx >= 1){
        temp1 = this.tableEntries[indx]
        temp2 = this.tableEntries[indx - 1]
        this.tableEntries[indx] = temp2
        this.tableEntries[indx - 1] = temp1
        this.keys.splice(indx - 1,2,this.keys[indx],this.keys[indx - 1])
      }
    },
    storeChanges(){
      var keys = JSON.stringify(this.keys)
      var cols = JSON.stringify(this.cols)
      var toStore = JSON.stringify(this.tableEntries)
      localStorage.setItem('tableEntries', toStore)
      localStorage.setItem('Keys', keys)
      localStorage.setItem('Columns', cols)
      this.startCacheTimer()
    },
    exportRows(header){
      clearTimeout(this.timer)
      var tempK, tempV
      var row = {}
      for(let el in this.tableEntries){
        tempK = this.tableEntries[el]['KEYS']
        tempV = this.tableEntries[el][header]
        Object.assign(row, {[tempK]: tempV})
      }
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(row, null, '\t'))
      var downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href",     dataStr)
      downloadAnchorNode.setAttribute("download", header + ".json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
      this.storeChanges()
    },
  }
}
</script>

<style>
.testimonial-group > .row {
  overflow-x: auto;
  white-space: nowrap;
}
.testimonial-group > .row > .col {
  display: inline-block;
  float: none;
}
.very-wide{
  min-width: 650px;
}
.standard-height{
  min-height: 50px;
}
</style>
