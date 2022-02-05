<template>
  <div class='home'>
    <h1>JSON Translator</h1>
    <div class="buttons">
      <button style="margin-bottom: 10px" @click="newAddLanguage">Add language</button>
      <input v-model="langName">
      <div class="grid-container">
        <div class="grid-data">
          <button @click="editKeys">{{editKeyButtonText}}</button>
        </div>
        <div v-for="lang in langs" v-bind:key="lang">
          {{lang}}
          <span class="header-border"></span>
          <input type="file" v-bind:hidden="isHidden" ref="input">
          <button @click="importing">import</button>
        </div>
      </div>
    </div>
    <div class="buttons">
      <div class="grid-container">
        <div v-for="row in rows" v-bind:key="row">
          {{row.header}}
          <div class="grid-data">
            <div v-for="data in row.rows" v-bind:key="data" class="bordered">
                <div style="margin-left: 15%">{{data}}</div>
                <div style="float:right" v-bind:hidden="editingKeys">
                  <div v-show="row.header == 'keys'" @click="moveUp(data)" class="arrow up"/>
                  <div v-show="row.header == 'keys'" @click="moveDown(data)" class="arrow down"/>
                  <button v-show="row.header == 'keys'" @click="removeKey(data)">Delete</button>
                </div>
            </div>
          </div>
          <input v-show="row.header != 'keys'" type="file" v-bind:hidden="isHidden" @change="importJSON" id="file" ref="myFiles" accept=".json" multiple>
          <button @click="importing(row.header)" v-show="row.header != 'keys'">import</button>
        </div>
      </div>
      <div>
        <span class="header-border"></span>
      </div>
      <button style="margin-top: 10px" @click="newAddPhrase">Add Phrase</button>
      <input v-model="phrase">
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
        header: 'keys',
        rows: []
      }],
      toDisplay: [],
      langs: [],
      keys: [],
      retrieved: {},
      translations: [],
      isHidden: true,
      editingKeys: true,
      editKeyButtonText: 'Edit',
      file: '',
      isUsing: Boolean,
      uploader: '',
      
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
    this.isUsing = document.hidden
  },
  methods: {
    newAddLanguage () {
      if(this.langName.length > 0){
        this.cols.push(this.langName)
        var header = this.langName
        this.initLangRows(header)
        this.langName = ""
        this.newStoreChanges("cols")
      }
    },
    newAddPhrase() {
      if(this.phrase.length > 0){
        for(let x in this.rows){
          if(x == 0){
            this.rows[x].rows.push(this.phrase)    
          }else{
            this.rows[x].rows.push('')
          }  
        }
        this.phrase = ''
        this.newStoreChanges("rows")
      }
    },
    importing (uploader){
      this.uploader = uploader
      this.isHidden = !this.isHidden
    },
    editKeys (){
      this.editingKeys = !this.editingKeys
      if(this.editingKeys){
        this.editKeyButtonText = 'Edit'
      } else{
        this.editKeyButtonText = 'Save'
      }
      if(this.editingKeys){
        this.newStoreChanges('rows')
      }
    },
    newStoreChanges(type){
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
      console.log(this.rows)
      this.newStoreChanges()
    },
    moveUp (key) {
      var temp, indx, val
      indx = this.keys.indexOf(key)
      for(let el in this.rows){
        if(indx > 0){
          val = this.rows[el].rows[indx]
          temp = this.rows[el].rows[indx - 1]
          this.rows[el].rows[indx - 1] = val
          this.rows[el].rows[indx] = temp
        }
      }
    },
    moveDown (key) {
      var temp, indx, val
      indx = this.keys.indexOf(key)
      console.log(key + ' ' + indx)
      for(let el in this.rows){
        if(indx < this.rows[el].rows.length - 1){
          val = this.rows[el].rows[indx]
          temp = this.rows[el].rows[indx + 1]
          this.rows[el].rows[indx + 1] = val
          this.rows[el].rows[indx] = temp
        }
      }
    },
    removeKey (key) {
      var indx = this.keys.indexOf(key)
      if(indx > -1){
        for(let el in this.rows){
          this.rows[el].rows.splice(indx,1) 
        }
      }
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
              toPush.rows[ this.keys.indexOf(f)] = file[f]
            }
            if(this.keys.length > toPush.rows.length){
              toPush.rows[this.keys.length - 1] = ''
            }
          }
        }
      }
      this.addImported(toPush)
    },addImported (toAdd){
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
