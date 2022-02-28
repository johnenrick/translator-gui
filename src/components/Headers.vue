<template>
    <div>
        <h4>{{header}}</h4>
        <div class="w-100"></div>
        <div class="btn-group mb-4">
            <button class="btn btn-outline-secondary rounded" @click="$emit('alphabetical')" v-show="header == 'KEYS'">Sort (A-Z)</button>
            <button class="btn btn-outline-secondary" @click="$emit('importValues',header)" v-show="header != 'KEYS'">Import</button>
            <button class="btn btn-outline-secondary" v-show="header != 'KEYS'" @click="$emit('exportValues',header)">Export</button>
            <button class="btn btn-outline-danger" v-show="header != 'KEYS'" @click="$emit('deleteHeader',header)">Delete</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Headers",
        props: {
            header: String
        },
    }
</script>

<style>
</style>
