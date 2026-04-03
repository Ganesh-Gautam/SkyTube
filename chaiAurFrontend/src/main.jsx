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
import Search from './pages/Search.jsx';

import You from "./pages/You.jsx";
import PlayListDetailPage from "./pages/PlaylistDetailPage.jsx"
import LikedVideos from "./pages/LikedVideos.jsx";

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
          <AuthLayout authentication={true}>
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
        path : "/feed/liked-videos",
        element :(
          <AuthLayout authentication={true}>
            <LikedVideos/>
          </AuthLayout>
        )
      },
      {
        path : "/search",
        element : <Search/>
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
  <Provider store ={store}>
    <RouterProvider  router ={router}/>
  </Provider>
)
