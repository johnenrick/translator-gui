<template>
    <div>
        <h4>{{header}}</h4>
        <div class="w-100"></div>
        <div class="btn-group mb-4">
            <button title="Rearranges the table in alphabetical order" class="btn btn-outline-secondary rounded" @click="$emit('alphabetical')" v-show="header == 'KEYS'">Sort (A-Z)</button>
            <button title="Insert a JSON file to be translated into this column" class="btn btn-outline-secondary rounded" @click="$emit('importValues',header)" v-show="header != 'KEYS'">Import</button>
            <button title="Creates a JSON file containing key:value pairs from this column" class="btn btn-outline-secondary rounded" v-show="header != 'KEYS'" @click="$emit('exportValues',header)">Export</button>
            <button title="Deletes the entire column" class="btn btn-outline-danger rounded" v-show="header != 'KEYS'" @click="$emit('deleteHeader',header)">Delete</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Headers",
        props: {
            header: String //a value of cols passed from home.vue to be displayed in the table as a header
        },
    }
</script>

<style>
</style>
