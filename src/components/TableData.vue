<template>
    <div class="border-bottom align-middle p-2">
        <div  class="input-group" style="min-height: 50px">
            <div class="input-group-prepend" v-show="header == 'Keys'">
                <span class="input-group-text">{{rowNum + 1}}</span>
            </div>
            <textarea rows="1" style="min-height: 40px" class="form-control border-0" @change="$emit('edit',$event)" @click="$emit('setEdit',[val,header,rowNum]);isHidden = !isHidden" :value="newVal" type="text"/>
            <div class="align-middle">
                <button style="height: 40px" class="btn btn-outline-secondary" v-show="header == 'Keys'" @click="$emit('dupe',rowNum)"><font-awesome-icon :icon="['fas', 'clone']" /></button>
                <button style="height: 40px; width: 40px" class="btn btn-outline-secondary" v-show="header == 'Keys'" @click="$emit('up',rowNum)"><span class="arrow up"/></button>
                <button style="height: 40px; width: 40px" class="btn btn-outline-secondary" v-show="header == 'Keys'" @click="$emit('down',rowNum)"><span class="arrow down"/></button>
                <button style="height: 40px; width: 40px" class="btn btn-outline-danger" v-show="header == 'Keys'" @click="$emit('removeK',rowNum)"><span class="btn-close"/></button>
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
            val: String,
            header: String,
            rowNum: Number
        },
        data (){
            return{
                isHidden: true,
                newVal : this.val,
                newRowNum: this.rowNum
            }
        },
        methods: {
            setNewVal(v){
                this.newVal = v.target.value
                this.newRowNum = this.rowNum
            }
        }
    }
</script>

<style>
</style>
