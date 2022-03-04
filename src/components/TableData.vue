<template>
    <div class="align-middle">
        <div  class="input-group" >
            <div class="input-group-prepend" v-show="header == 'KEYS'">
                <span class="input-group-text">{{rowNum + 1}}</span>
            </div>
            <textarea rows="1" class="form-control border-0" @change="$emit('edit',[$event,header,rowNum])" :value="val" type="text"/>
            <div class="align-self-center">
                <button class="btn btn-outline-secondary icon-size"  @click="$emit('dupe',rowNum)"><font-awesome-icon :icon="['fas', 'clone']" /></button>
                <button class="btn btn-outline-secondary icon-size"  @click="$emit('up',rowNum)"><font-awesome-icon :icon="['fas', 'arrow-up']" /></button>
                <button class="btn btn-outline-secondary icon-size"  @click="$emit('down',rowNum)"><font-awesome-icon :icon="['fas', 'arrow-down']" /></button>
                <button class="btn btn-outline-danger icon-size"  @click="$emit('removeK',rowNum)"><font-awesome-icon :icon="['fas', 'trash-can']" /></button>
            </div>
        </div>
    </div>
</template>

<script>

    import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

    export default {
        name: "tableData",
        components:{
            FontAwesomeIcon
        },
        props: {
            val: String, // to be shown in the table
            header: String, // to identify which column this phrase belong
            rowNum: Number // used to display the row's order in the table
        },
    }
</script>

<style>
    .icon-size{
        height: 40px;
        width: 40px
    }
    
</style>
