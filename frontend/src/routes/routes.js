import { Switch, Route } from 'react-router-dom'
import Home from '../components/home/Home'
import Admin from '../components/admin/index'
import CreateChannel from '../components/createChannel/index'
import MessageBoardIndex from '../components/MessageBoard/MessageBoardIndex'

const routes = () => {
  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/create-channel'>
        <CreateChannel />
      </Route>
      <Route path='/admin'>
        <Admin />
      </Route>
      <Route path='/message-board'>
        <MessageBoardIndex />
      </Route>
    </Switch>
  )
}

export default routes
