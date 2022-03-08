<template>
    <div class="align-middle">
        <div  class="input-group" >
            <div class="input-group-prepend" v-show="header == 'KEYS'">
                <span class="input-group-text">{{rowNum + 1}}</span>
            </div>
            <textarea rows="1" class="form-control border-0" @change="$emit('edit',[$event,header,rowNum])" :value="val" type="text"/>
            <div class="align-self-center">
                <span>
                    <button
                        title="Duplicates the entire row"
                        class="btn btn-outline-secondary icon-size" 
                        @click="$emit('dupe',rowNum)">
                        <font-awesome-icon :icon="['fas', 'clone']" 
                    />
                    </button>
                </span>
                <span :title="isDisabled == true ? disabledMove : enabledMove + 'up'">
                    <button  
                        class="btn btn-outline-secondary icon-size"
                        :disabled="isDisabled"
                        @click="$emit('up',rowNum)">
                        <font-awesome-icon :icon="['fas', 'arrow-up']"
                    />
                    </button>
                </span>
                <span :title="isDisabled == true ? disabledMove : enabledMove + 'up'">
                    <button
                        class="btn btn-outline-secondary icon-size" 
                        :disabled="isDisabled"
                        @click="$emit('down',rowNum)">
                        <font-awesome-icon :icon="['fas', 'arrow-down']"
                    />
                    </button>
                </span>
                <span>
                    <button
                        title="Deletes the entire row"
                        class="btn btn-outline-danger icon-size"  
                        @click="$emit('removeK',rowNum)">
                        <font-awesome-icon :icon="['fas', 'trash-can']" 
                    />
                    </button>
                </span>
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
            val: String, // a value of tableEntries passed from home.vue to be displayed in the table as a row
            header: String, //a value of cols passed from home.vue to be displayed in the table as a header
            rowNum: Number, // used to display the row's order in the table
            isDisabled: Boolean //used to enable/disable move up/down 
        },
        data (){
            return{
                disabledMove: 'Unable to move row if only incomplete rows are shown',
                enabledMove: 'Moves the entire row ',
            }
        }
    }
</script>

<style>
    .icon-size{
        height: 40px;
        width: 40px
    }
    
</style>
