export const InputBus = {
  isLeft: false,
  isRight: false,
  isShooting: false,
  deadZone: 0.1,
}

// Keyboard override: only update InputBus when our keys are pressed/released
// so face tracker input is not wiped by other keypresses
window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault()
    InputBus.isShooting = true
  }
  if (e.key === 'ArrowLeft') InputBus.isLeft = true
  if (e.key === 'ArrowRight') InputBus.isRight = true
})

window.addEventListener('keyup', (e) => {
  if (e.key === ' ') InputBus.isShooting = false
  if (e.key === 'ArrowLeft') InputBus.isLeft = false
  if (e.key === 'ArrowRight') InputBus.isRight = false
})