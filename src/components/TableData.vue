<template>
    <div>
        <div  class="input-group border-bottom" style="min-height: 40px" @click="isHidden = false">
            <div class="input-group-prepend" v-show="header == 'Keys'">
                <span class="input-group-text">{{rowNum + 1}}</span>
            </div>
            <input style="min-height: 40px" class="form-control border-0" @keydown.enter="$emit('edit',$event);isHidden = true" @keydown.esc="$emit('setEdit',['','']);isHidden = true"  @click="$emit('setEdit',[val,header,rowNum])" :value="val" type="text"/>
            <button style="height: 40px; width: 40px" class="btn btn-outline-secondary" v-show="header == 'Keys'" @click="$emit('up',val);isHidden = true"><span class="arrow up"/></button>
            <button style="height: 40px; width: 40px" class="btn btn-outline-secondary" v-show="header == 'Keys'" @click="$emit('down',val);isHidden = true"><span class="arrow down"/></button>
            <button class="btn btn-outline-danger" v-show="header == 'Keys'" @click="$emit('removeK',val)">Delete</button>
            <button style="height: 40px" class="btn btn-danger" :hidden="isHidden" @click="$emit('removeP');isHidden = true">Delete</button>
        </div>        
    </div>
</template>

<script>
    export default {
        name: "tableData",
        props: {
            val: String,
            header: String,
            rowNum: Number
        },
        data (){
            return{
                isHidden: true
            }
        }
    }
</script>

<style>
</style>
