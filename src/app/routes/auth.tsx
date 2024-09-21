import { motion } from "framer-motion"
import './styles/auth.css'

const AuthPage = () => {
    return (
        <>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                
                id="auth-body"
            >
                <div id="auth-header">
                    funkyscout
                </div>
                <div id="auth-box">
                    <button id="auth-top">
                        <i className='fa-solid fa-chevron-down'></i>
                        Event
                    </button>
                    <div id='auth-bottom'>
                        <button id="auth-name">
                            <i className='fa-solid fa-chevron-down'></i>
                            Name
                        </button>
                        <button id="auth-submit">
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default AuthPage;