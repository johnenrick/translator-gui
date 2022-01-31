<template>
  <div class='home'>
    <h1>JSON Translator</h1>
    <div class="buttons">
      <button @click="addLanguage">Add language</button>
      <input v-model="langName">
      <button @click="addPhrase">Add Phrase</button>
      <input v-model="phrase">
      <div class="grid-container">
        <div class="grid-data">
          <b>Keys</b>
          <div v-for="key in keys" v-bind:key="key">
            {{key}}
          </div>
        </div>
        <div v-for="lang in langs" v-bind:key="lang">
          {{lang}}
          <input type="file" v-bind:hidden="isHidden">
          <button @click="importing">import</button>
        </div>
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
      langs: [],
      keys: [],
      retrieved: [],
      isHidden: true
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
      } else{
        alert("invalid input")
      }
    },
    addPhrase () {
      if(this.phrase.length > 0){
        this.keys.push(this.phrase)
        var toStore = []
        var tempObj = {}
        var key
        for(key in this.keys){
          tempObj = this.keys[key]
          toStore.push(tempObj)
        }
        toStore = JSON.stringify(toStore)
        localStorage.setItem('keys', toStore)
        this.phrase = ''
      } else {
        alert("invalid input")
      }
    },
    importing (){
      this.isHidden = !this.isHidden
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
</style>
