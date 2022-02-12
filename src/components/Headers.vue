<template>
    <div>
        <div class="row" style="min-height: 40px">
            <div class="col">
                {{header}}
            </div>
            <div class="col">
                <div class="btn-group">
                <button class="btn btn-outline-secondary" @click="$emit('importValues',header)" v-show="header != 'Keys'">import</button>
                <button class="btn btn-outline-secondary" v-show="header != 'Keys'" @click="$emit('exportValues',header)">Export</button>
                </div>
            </div>
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
