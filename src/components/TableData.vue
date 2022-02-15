<template>
    <div>
        <div  class="input-group border-bottom" style="min-height: 40px">
            <div class="input-group-prepend" v-show="header == 'Keys'">
                <span class="input-group-text">{{rowNum + 1}}</span>
            </div>
            <textarea rows="1" style="min-height: 40px" class="form-control border-0" @change="$emit('edit',$event)" @click="$emit('setEdit',[val,header,rowNum]);isHidden = !isHidden" :value="newVal" type="text"/>
            <div class="align-middle">
                <button style="height: 40px; width: 40px" class="btn btn-outline-secondary" v-show="header == 'Keys'" @click="$emit('up',val)"><span class="arrow up"/></button>
                <button style="height: 40px; width: 40px" class="btn btn-outline-secondary" v-show="header == 'Keys'" @click="$emit('down',val)"><span class="arrow down"/></button>
                <button class="btn btn-outline-danger" v-show="header == 'Keys'" @click="$emit('removeK',val)">Delete</button>
            </div>
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
