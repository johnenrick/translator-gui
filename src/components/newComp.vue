<template>
    <div class="card">
        This is a {{ msg }}.
    </div>
</template>

<script>
    export default {
        name: "newComp",
        props: [
            'msg'
        ]
    }

</script>

<style>
 .card {
     border: 1px solid darkgray;
     border-radius: 25px;
     padding: 12px 8px;
 }
</style>
