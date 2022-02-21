<template>
    <div class="row mb-2 p-4">
        <div class="col-4">
            <button class="btn btn-outline-primary" @click="$emit('addLang',langName);langName=''">Add language</button>
        </div>
        <div class="col-8">
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