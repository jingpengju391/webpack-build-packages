import { App } from 'vue'
import MyButton from './MyButton'
const components = [MyButton]

const install = (app: App): void => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export default {
  install,
  MyButton
}
