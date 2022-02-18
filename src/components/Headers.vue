<template>
    <div class="p-2"  style="min-height: 50px">
        <h4>{{header}}</h4>
        <div class="w-100"></div>
        <div class="btn-group">
            <button class="btn btn-outline-secondary rounded" @click="$emit('alphabetical')" v-show="header == 'Keys'">Sort (A-Z)</button>
            <button class="btn btn-outline-secondary" @click="$emit('importValues',header)" v-show="header != 'Keys'">Import</button>
            <button class="btn btn-outline-secondary" v-show="header != 'Keys'" @click="$emit('exportValues',header)">Export</button>
            <button class="btn btn-outline-danger" v-show="header != 'Keys'" @click="$emit('deleteHeader',header)">Delete</button>
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
