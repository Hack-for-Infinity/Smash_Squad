export const InputBus = {
  isLeft: false,
  isRight: false,
  isShooting: false,
  deadZone: 0.1,
}

// keyboard tester — arrow keys control the bar
window.addEventListener('keydown', (e) => {
  InputBus.isLeft = false
  InputBus.isRight = false
  
  if (e.key === 'ArrowLeft')  InputBus.isLeft = true
  if (e.key === 'ArrowRight') InputBus.isRight = true
})

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft')  InputBus.isLeft = false
  if (e.key === 'ArrowRight') InputBus.isRight = false
})