class VacancyProgress {
  constructor(vacancys) {
    this.$items = vacancys
    this.currentPortion = 1
    this.totalItems = this.$items.length
    this.countLoadingPerClick = this.$items.filter((_, item) => $(item).data().portion === this.currentPortion).length

    this.maxPortionValue = Math.ceil(this.totalItems / this.countLoadingPerClick)
    this.showNextPortionItems = this.showNextPortionItems.bind(this)

    this.isFirst = true
    this.init()
  }

  prepareListener(type, cb) {
    $('.js-loading__more').on(type, cb)
  }

  isLastPortion() {
    if (this.currentPortion === this.maxPortionValue) {
      return true
    } if (this.currentPortion + 1 >= this.maxPortionValue && !this.isFirst) {
      return true
    }

    return false
  }

  calculateCountLoading() {
    if (!this.isFirst) {
      const countLoading = this.$items.filter((_, item) => $(item).data().portion === this.currentPortion).length
      this.countLoadingPerClick += countLoading
    }

    const delta = (this.currentPortion / this.maxPortionValue) * 100
    $('[data-progress]').css('width', `${delta}%`)
    this.progressChange()
    this.isFirst = false
  }

  showNextPortionItems() {
    if (this.isLastPortion()) {
      $('.js-loading__more').hide()
    }

    this.currentPortion += 1
    $(`[data-portion=${this.currentPortion}]`).fadeIn(400)
    this.calculateCountLoading()
    window.locoScroll.update()
  }

  progressChange() {
    $('.js-progress-current').text(`${this.countLoadingPerClick >= 10 ? this.countLoadingPerClick : `0${this.countLoadingPerClick}`} /`)
    $('.js-progress-total').text(this.totalItems >= 10 ? this.totalItems : `0${this.totalItems}`)
  }

  init() {
    if (!this.$items.length) {
      $('.vacancy__progress-bottom__fill').css('width', '100%')
      this.countLoadingPerClick = 0
      this.totalItems = 0
      this.progressChange()
      return
    }

    $('.js-loading__more').show()

    this.$items.each((i, item) => {
      if (i > this.countLoadingPerClick - 1) {
        $(item).hide()
      }
    })

    if (this.isLastPortion()) {
      $('.js-loading__more').hide()
    }

    this.prepareListener('click', () => this.showNextPortionItems())
    this.calculateCountLoading()
  }
}
