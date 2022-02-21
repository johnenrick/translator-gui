<template>
    <div class="row p-4">
      <div class="col-4">
        <button class="btn btn-outline-primary" @click="$emit('addPhrase',phrase); this.phrase = ''">Add Phrase</button>
      </div>
      <div class="col-8">
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