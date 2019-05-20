const prop = (data, name) => data.map(item => item[name]),
  summ = data => data.reduce((total, value) => total + value, 0);

class SpriteGenerator {
  constructor(container) {
    this.container = container;
    this.uploadButton = container.querySelector('.sprite-generator__upload');

    this.submitButton = container.querySelector('.sprite-generator__generate');
    this.imagesCountContainer = container.querySelector('.images__added-count-value');
    this.codeContainer = container.querySelector('.sprite-generator__code');
    this.imageElement = container.querySelector('.sprite-generator__result-image');
    this.images = [];

    this.imagesCount = 0;

    this.registerEvents()
  }

  registerEvents() {
    this.uploadButton.addEventListener('change', this.addIcon.bind(this));
    this.submitButton.addEventListener('click', this.generateSprite.bind(this))
  }

  addIcon(event) {

    const files = Array.from(event.currentTarget.files)
    files.forEach(el => this.images.push(el))
    this.imagesCountContainer.innerText = this.images.length
  }

  generateSprite() {
    // создаём canvas
    this.container.appendChild(document.createElement('canvas'))
    const canvas = document.querySelector('canvas')
    let ctx = canvas.getContext('2d')
    // определяем ширину и высоту канваса на основе массива иконок и их размера
    const maxInRaw = Math.floor(document.body.offsetWidth / 110);
    ctx.canvas.width = this.images.length < maxInRaw ? this.images.length * 110 : maxInRaw * 110;
    const maxColomns = Math.ceil(this.images.length / maxInRaw) * 110
    ctx.canvas.height = maxColomns

    let stepX = 0;
    let stepY = 0;
    let imgWidth = 100
    let imgHeight = 100

    // переносим изображения на canvas
    this.images.forEach((el, i) => {

      let img = document.createElement('img')
      img.src = URL.createObjectURL(el)
      img.classList.add(`icon_${el.name}`)
      img.width = imgWidth
      img.height = imgHeight

      img.addEventListener('load', () => {
        // если ширина отрисовки следующей иконки превышает ширину канваса, переносим иконку на следующую строку канваса
        if (stepX < ctx.canvas.width) {
          ctx.drawImage(img, stepX, stepY, img.width, img.height)
          stepX += 110;

          this.codeContainer.value +=
            `.${img.classList} {
width: ${img.width}px;
height: ${img.height}px;
background-position: -${stepX}px ${stepY}px;
}
 `
        } else {

          stepY += 110;
          stepX = 0;

          this.codeContainer.value +=
            `.${img.classList} {
  width: ${img.width}px;
  height: ${img.height}px;
  background-position: -110px ${stepY}px;
}
`

          ctx.drawImage(img, stepX, stepY, img.width, img.height)
          stepX += 110;
        }

        // переносим изображение в результирующий блок, очищаем массив иконок
        if (i === this.images.length - 1) {
          this.imageElement.src = canvas.toDataURL()
          this.images = []
          this.imagesCountContainer.innerText = 0
        }
      })

    })

    this.container.removeChild(canvas)
  }
}

new SpriteGenerator(document.getElementById('generator'));
