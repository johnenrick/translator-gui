<template>
    <div class="row mb-2 p-4">
        <div class="input-group">
            <button class="btn btn-outline-primary" @click="$emit('addLang',langName);langName=''">Add language</button>
            <input class="form-control" @keydown.enter="$emit('addLang',langName);langName=''" v-model="langName">
        </div>
    </div>
</template>

<script>
export default {
    name: "addLanguage",
    data () {
        return{
            langName: ''
        }
    }
}
</script>

<style>

</style>