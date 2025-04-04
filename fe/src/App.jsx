import { BrowserRouter } from "react-router-dom"
import Layout from "./Layout"
import StateContext from "./state/StateContext"

function App() {

  return (
    <BrowserRouter>
      <StateContext>
        <Layout />
      </StateContext>
    </BrowserRouter>

  )
}

export default App
