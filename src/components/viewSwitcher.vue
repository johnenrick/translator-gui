<template>
    <div class="input-group justify-content-center">
      <label class="form-check-label" for="flexSwitchCheckDefault">Display all rows</label>
      <div class="form-switch">
        <input class="form-check-input" @change="$emit('switch',$event)" type="checkbox" value="" id="flexSwitchCheckDefault">
      </div>
    </div>
</template>

<script>
    export default {
        name: "viewSwitcher"
    }
</script>

<style>
</style>
