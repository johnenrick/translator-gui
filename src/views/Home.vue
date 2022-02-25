<template>
  <div class='container'>
    <div class="row">
      <h1>JSON Translator</h1>
    </div>
    <button class="btn btn-danger" @click="resetTranslator">Reset</button>
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
          <input v-show="colLabel != 'Keys'" type="file" hidden @change="importJSON" :id="colLabel" ref="myFiles" accept=".json">
          <div class="btn-group mt-4 mb-4">
            <button class="btn btn-outline-secondary" @click="importing(colLabel)" v-show="colLabel != 'Keys'">import</button>
            <button class="btn btn-outline-secondary" v-show="colLabel != 'Keys'" @click="exportRowsV3(colLabel)">Export</button>
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
      @addPhrase="newAddPhraseV3"
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
      tableEntries:{
        Keys: Array
      },
      tableEntriesV2:[],
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
    // if(localStorage.getItem("cols")){
    //   this.cols = localStorage.getItem("cols")
    //   this.cols = JSON.parse(this.cols)
    // }
    // if(localStorage.getItem("rows")){
    //   this.rows = localStorage.getItem("rows")
    //   this.rows = JSON.parse(this.rows)
    //   for(let el in this.rows[0].rows){
    //     this.keys[el] = this.rows[0].rows[el]
    //   }
    //   this.keyTableLength = this.keys.length
    // }
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
      // this.keys = this.tableEntries['Keys']
    }
    document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
  },
  methods: {
    resetTranslator(){
      this.keys = []
      this.cols = ['Keys']
      this.rows = []
      this.rows.push({'header': 'Keys', 'rows': []})
      this.tableEntriesV2 = []
      this.newStoreChangesV3()
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
      this.keyTableLength = this.keys.length
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
            this.newStoreChangesV3()
            // this.newStoreChanges('rows')
            // this.newStoreChanges('cols')
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
      this.keyTableLength = this.keys.length
      this.newStoreChanges('rows')
    },
    importJSON(event){
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
    },
    compareKeysV2 (file){
      var toPush = []
      for(let f in file){
        if(this.keys.length > toPush.length){
          toPush[this.keys.length - 1] = null
        }
        if(this.keys.indexOf(f) > -1){
          toPush[this.keys.indexOf(f)] = file[f]
        }else{
          this.keys.push(f)
          toPush.push(file[f])
        }
      }
      if(this.tableEntries[this.uploader].length == 0){
        this.tableEntries[this.uploader] = toPush
      }else{
        for(let el in this.keys){
          if(toPush[el] != null && toPush[el] != '' && toPush[el] != undefined){
            this.tableEntries[this.uploader][el] = toPush[el]
          }
        }
      }
      this.tableEntries["Keys"] = this.keys
      this.keyTableLength = this.keys.length
      this.checkTranslationColLengthV2()
      this.newStoreChangesV2()
    },
    newStoreChangesV2(){
      if(this.autosave == false){
        this.autosave = true
        this.handleVisibilityChange()
      }
      var toStore = JSON.stringify(this.tableEntries)
      localStorage.setItem('tableEntries', toStore)
    },
    moveUpV2 (indx) {
      var temp1,temp2
      if(indx >= 1){
        for(let el in this.tableEntries){
          temp1 = this.tableEntries[el][indx]
          temp2 = this.tableEntries[el][indx - 1]
          this.tableEntries[el][indx] = temp2
          this.tableEntries[el][indx - 1] = temp1
        }
        this.keys = this.tableEntries["Keys"]
      }
    },
    moveDownV2 (indx) {
      var temp1,temp2
      if(this.keys.length - 1 > indx){
        for(let el in this.tableEntries){
          temp1 = this.tableEntries[el][indx + 1]
          temp2 = this.tableEntries[el][indx]
          this.tableEntries[el][indx] = temp1
          this.tableEntries[el][indx + 1] = temp2
        }
        this.keys = this.tableEntries["Keys"]
      }
    },
    removeKeyV2 (indx){
      for(let el in this.tableEntries){
        this.tableEntries[el].splice(indx,1) 
      }
      this.keys = this.tableEntries['Keys']
      this.keyTableLength = this.keys.length
    },
    duplicateRowV2(indx){
      for(let el in this.tableEntries){
        this.tableEntries[el].splice(indx,0,this.tableEntries[el][indx])
      }
      this.keys = this.tableEntries['Keys']
      this.keyTableLength = this.keys.length
    },
    checkTranslationColLengthV2(){
      for(let el in this.tableEntries){
        if(this.tableEntries[el].length < this.keyTableLength){
          let ctr = this.keyTableLength - this.tableEntries[el].length
          for(; ctr > 0; ctr--){
            this.tableEntries[el].push(null)
          }
        }
      }
      this.newStoreChanges()
    },
    sortKeysV2(){
      var len = this.keyTableLength - 1
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
      for(let el in this.tableEntries){
        for(let ctr = 0; ctr <= len; ctr++){
          if(this.tableEntries[el][dir[ctr]]){
            tempArr[ctr] = this.tableEntries[el][dir[ctr]]
          }else{
            tempArr[ctr] = null
          }
        }
        this.tableEntries[el] = tempArr
        tempArr = []
      }
      this.keys = this.tableEntries['Keys']
    },
    editPhraseV2(newVal){
      var header = this.isEdited.data[1]
      var num = this.isEdited.data[2]
      if(newVal.target.value == ''){
        if(header == "Keys"){
          this.removeKey(num)
        }else{
          this.tableEntries[header][num] = null  
        }
      }else{
      this.tableEntries[header][num] = newVal.target.value
      }
      this.newStoreChangesV2()
    },
    deleteHeaderV2 (val){
      var indx = this.cols.indexOf(val)
      delete this.tableEntries[val]
      this.cols.splice(indx,1)
      this.newStoreChangesV2()
    },
    newAddPhraseV2(newAddPhrase){
      this.phrase = newAddPhrase
      if(this.keys.indexOf(this.phrase) == -1){
        if(this.phrase.length > 0){
          for(let el in this.tableEntries){
            if(el == 'Keys'){
              this.tableEntries[el].push(this.phrase)
            }else{
              this.tableEntries[el].push(null)
            }
          }
          this.phrase = ''
          this.newStoreChangesV2()
        }
      }else{
        this.notify('info')
      }
    },
    newAddLanguageV2 (newLang){
      this.langName = newLang.charAt(0).toUpperCase() + newLang.slice(1)
      if(this.cols.indexOf(this.langName) == -1){
        if(this.langName.length > 0){
          this.cols.push(this.langName)
          var header = this.langName
          this.initLangRows(header)
          this.tableEntries[this.langName] = []
          this.newStoreChanges("cols")
        }
      }else{
        this.langName = ''
      }
    },
    exportRowsV2(header){
      var tempK, tempV
      var row = {}
      for(let el in this.tableEntries[header]){
        tempK = this.tableEntries['Keys'][el]
        tempV = this.tableEntries[header][el]
        Object.assign(row, {[tempK]: tempV})
      }
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(row, null, '\t'))
      var downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href",     dataStr)
      downloadAnchorNode.setAttribute("download", header + ".json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
      this.newStoreChangesV2()
      this.autosave = true
    },
    compareKeysV3 (file){
      for(let f in file){
        if(this.keys.indexOf(f) < 0){
          this.keys.push(f)
          this.tableEntriesV2.push({'Keys': f})
        }
        this.tableEntriesV2[this.keys.indexOf(f)][this.uploader] = file[f]
      }
      this.newStoreChangesV3()
    },
    newAddLanguageV3 (newLang){
      this.langName = newLang.charAt(0).toUpperCase() + newLang.slice(1)
      if(this.cols.indexOf(this.langName) == -1){
        if(this.langName.length > 0){
          this.cols.push(this.langName)
        }
        this.newStoreChangesV3()
        this.langName = ''
      }
    },   
    newAddPhraseV3(newAddPhrase){
      this.phrase = newAddPhrase
      if(this.keys.indexOf(this.phrase) == -1){
        if(this.phrase.length > 0){
          this.keys.push(this.phrase)
          this.tableEntriesV2.push({'Keys': this.phrase})
          this.newStoreChangesV3()
        }
      }else{
        this.notify('info')
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
      if(this.autosave == false){
        this.autosave = true
        this.handleVisibilityChange()
      }
      var keys = JSON.stringify(this.keys)
      var cols = JSON.stringify(this.cols)
      var toStore = JSON.stringify(this.tableEntriesV2)
      localStorage.setItem('tableEntries', toStore)
      localStorage.setItem('Keys', keys)
      localStorage.setItem('Columns', cols)
    },
    exportRowsV3(header){
      var tempK, tempV
      var row = {}
      for(let el in this.tableEntries[header]){
        tempK = this.tableEntriesV2[el]['Keys']
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
      this.autosave = true
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
