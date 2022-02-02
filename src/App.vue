<template>
  <div class='home'>
    <h1>JSON Translator</h1>
    <div class="buttons">
      <button @click="addLanguage">Add language</button>
      <input v-model="langName">
      <div class="grid-container">
        <div class="grid-data">
          <b class="bordered">Keys <button style="float:right" @click="editKeys">{{editKeyButtonText}}</button> </b>
          <div v-for="key in keys" v-bind:key="key" class="bordered">
            {{key}}
            <div style="float: right" v-bind:hidden="editingKeys">
              <div @click="moveUp(key)" class="arrow up"/>
              <div @click="moveDown(key)" class="arrow down"/>
              <button @click="removeKey(key)">Delete</button>
            </div>
          </div>
        </div>
        <div v-for="lang in langs" v-bind:key="lang" class="bordered">
          {{lang}}
          <input type="file" v-bind:hidden="isHidden">
          <input type="submit" v-bind:hidden="isHidden" @click="show(lang)" id="input">
          <button @click="importing">import</button>
        </div>
      </div>
      <button @click="addPhrase">Add Phrase</button>
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
      langs: [],
      keys: [],
      retrieved: [],
      translations: [],
      isHidden: true,
      editingKeys: true,
      editKeyButtonText: 'Edit'
    }
  },
  mounted() {
    if(localStorage.getItem("keys")){
    this.keys = localStorage.getItem("keys")
    this.keys = JSON.parse(this.keys)
    }
    if(localStorage.getItem("langs")){
      this.langs = localStorage.getItem("langs")
      this.langs = JSON.parse(this.langs)
    }
  },
  methods: {
    logging () {
      console.log("hello")
    },
    addLanguage () {
      if(this.langName.length > 0){
        this.langs.push(this.langName)
         var toStore = []
        var tempObj = {}
        var lang
        for(lang in this.langs){
          tempObj = this.langs[lang]
          toStore.push(tempObj)
        }
        toStore = JSON.stringify(toStore)
        localStorage.setItem('langs', toStore)
        this.langName = ''
        //setInterval(this.logging, 30000)
      } else{
        alert("invalid input")
      }
    },
    addPhrase () {
      if(this.phrase.length > 0){
        this.keys.push(this.phrase)
        this.importKeys()
        this.phrase = ''
      } else {
        alert("invalid input")
      }
    },
    importing (){
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
        this.importKeys()
      }
    },
    importKeys (){
      var toStore = []
      var tempObj = {}
      var key
      for(key in this.keys){
        tempObj = this.keys[key]
        toStore.push(tempObj)
      }
      toStore = JSON.stringify(toStore)
      localStorage.setItem('keys', toStore)
    },
    moveUp (key) {
      var temp, indx
      indx = this.keys.indexOf(key)
      if(indx > 0){
        temp = this.keys[indx - 1]
        this.keys[indx - 1] = key
        this.keys[indx] = temp
      }
    },
    moveDown (key) {
      var temp, indx
      indx = this.keys.indexOf(key)
      if(indx < this.keys.length - 1){
        temp = this.keys[indx + 1]
        this.keys[indx + 1] = key
        this.keys[indx] = temp
      }
    },
    removeKey (key) {
      var indx = this.keys.indexOf(key)
      if(indx > -1){
        this.keys.splice(indx,1)
      }
    },
    show (name){
      const selectedFile = document.getElementById('input').files[0]
      console.log(selectedFile)
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
  border: solid;
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
