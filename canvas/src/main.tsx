import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CanvasWithButton from './canvas'
createRoot(document.getElementById('root')!).render(
    <CanvasWithButton/>
)
