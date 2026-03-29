import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import AuthLayout from './layouts/AuthLayout.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import WatchVideo from './pages/WatchVideo.jsx';
import UploadVideo from './pages/UploadVideo.jsx';

import Channel from './pages/Channel.jsx'; 
import EditChannel from './pages/EditChannel.jsx';
import SubscriptionsPage from './pages/SubscriptionPage.jsx';

import CreatorStudio from './pages/CreatorStudio.jsx';

import You from "./pages/You.jsx";
import PlayListDetailPage from "./pages/PlaylistDetailPage.jsx"

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children : [
      {
        index : true,
        element : <Home/>
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path : "/watch/:videoId",
        element :<WatchVideo/>
      },
      {
        path : "/upload",
        element : ( 
          <AuthLayout authentication={true}>
            <UploadVideo/> 
          </AuthLayout>
        )
      },
      {
        path : "/channel/:channelName",
        element : (
          <Channel/>
        )
      },{
        path : "/channel/:channelName/edit",
        element :(
          <AuthLayout>
            <EditChannel/>
          </AuthLayout>
        )
      },{
        path : "/subscribedChannels",
        element : ( 
          <AuthLayout authentication={true}>
            <SubscriptionsPage/> 
          </AuthLayout>
        )
      },
      {
        path : "/studio",
        element : ( 
          <AuthLayout authentication={true}>
            <CreatorStudio/> 
          </AuthLayout>
        )
      },
      {
        path : "/feed/you",
        element :(
          <AuthLayout authentication={true}>
            <You/> 
          </AuthLayout>
        )
      },
      {
        path : "/playlists/:playlistId",
        element :
        <PlayListDetailPage/>
      },
    

    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store ={store}>
      <RouterProvider  router ={router}/>
    </Provider>
  </StrictMode>
)
