<template>
    <div class="row p-4">
      <div class="input-group">
        <button class="btn btn-outline-primary" title="Adds a new phrase in the KEYS columns" @click="$emit('addPhrase',phrase); this.phrase = ''">Add Phrase</button>
        <input class="form-control" @keydown.enter="$emit('addPhrase',phrase); this.phrase = ''" v-model="phrase">
      </div>
    </div>
</template>

<script>
export default {
    name: "addLanguage",
    data () {
        return{
            phrase: ''
        }
    }
}
</script>

<style>

</style>