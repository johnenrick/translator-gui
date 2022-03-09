<template>
    <div title="Toggles between show all rows and show incomplete rows only" class="input-group justify-content-center">
      <label class="form-check-label" for="flexSwitchCheckDefault">Show incomplete rows only</label>
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
