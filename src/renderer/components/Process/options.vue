<template>
  <div>
    <h1>Identify</h1>
    <div class="block">
      <canvas ref="previewCanvas"
              width="1240"
              height="1754"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const canvas = new fabric.Canvas(this.$refs.previewCanvas, {
      backgroundColor: 'white'
    })

    fabric.loadSVGFromURL(
      '../../../../sample-data/design/AnswerSheet-1.svg',
      (objects, options) => {
        canvas.setWidth(options.width)
        canvas.setHeight(options.height)

        for (let i = 0; i < 50; i += 1) {
          const obj = objects[i]
          canvas.add(obj)
          obj.setCoords()
          console.log(obj)
        }

        /*
        const obj = fabric.util.groupSVGElements(objects, options)
        canvas.add(obj).centerObject(obj)
        obj.setCoords()
        */

        canvas.calcOffset()
        canvas.renderAll()
      }
    )
  }
}
</script>

<style lang="sass">
canvas
  border: 1px solid red
</style>
