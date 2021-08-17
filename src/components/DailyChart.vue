<script>
import { defineComponent } from 'vue'
import { Bar } from 'vue3-chart-v2'
import { mixins } from 'vue-chartjs'

export default defineComponent({
  name: 'DailyChart',
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    },
  },
  mixins: [ mixins.reactiveProp ],
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
  }
})
</script>