<template>
    <div>
        <div>{{ no }}</div>
    </div>    
</template>
  
<script>
    export default {
        name: 'no',
        data: function() {
            return {
                no: 0,
            }
        },
        /*
        omputed: {
            res: function() {
                let result = this.no ++
                return result
            }
        }
        */
    } 
</script>